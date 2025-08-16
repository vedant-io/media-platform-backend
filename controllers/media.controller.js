import { v4 as uuidv4 } from "uuid";
import { bucket } from "../lib/storage.js";
import MediaAsset from "../models/mediaAsset.model.js";

import MediaViewLog from "../models/mediaViewLog.model.js";
import client from "../lib/client.js";

export const uploadMedia = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No File was uploaded" });
    }
    const { title, type } = req.body;

    if (!title || !type) {
      res.status(400).json({ error: "Title and Type of file is required" });
    }
    console.log(
      `File received by server: ${req.file.originalname}, Size: ${req.file.size} bytes`
    );

    const fileName = `${uuidv4()}-${req.file.originalname}`;
    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      console.error("GCS Stream Error:", err);
      res.status(500).json({ error: "Failed to upload file." });
    });

    blobStream.on("finish", async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      const newMediaAsset = new MediaAsset({
        title,
        type,
        file_url: publicUrl,
      });
      await newMediaAsset.save();
      res.status(201).json(newMediaAsset);
    });
  } catch (error) {
    console.error("Error in uploadMedia controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getStreamUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const mediaAsset = await MediaAsset.findById(id);
    if (!mediaAsset) {
      return res.status(404).json({ error: "Media asset not found" });
    }

    const fileName = mediaAsset.file_url.split(`${bucket.name}/`)[1];

    const options = {
      version: "v4",
      action: "read",
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    const [signedUrl] = await bucket.file(fileName).getSignedUrl(options);

    res.status(200).json({ streamUrl: signedUrl });
  } catch (error) {
    console.error("Error in getStreamUrl controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logMediaView = async (req, res) => {
  try {
    const { id } = req.params;

    const mediaAsset = await MediaAsset.findById(id);
    if (!mediaAsset) {
      return res.status(404).json({ error: "Media asset not found." });
    }

    const viewLog = new MediaViewLog({
      media_id: mediaAsset._id,
      viewed_by_ip: req.ip,
    });
    await viewLog.save();

    res.status(201).json({ message: "View logged successfully." });
  } catch (error) {
    console.error("Error in logMediaView controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMediaAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `analytics:${id}`;

    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid media ID format." });
    }

    const mediaAsset = await MediaAsset.findById(id);
    if (!mediaAsset) {
      return res.status(404).json({ error: "Media asset not found." });
    }

    const mediaIdObject = new mongoose.Types.ObjectId(id);

    const generalStats = await MediaViewLog.aggregate([
      { $match: { media_id: mediaIdObject } },
      {
        $group: {
          _id: null,
          total_views: { $sum: 1 },
          unique_ips_set: { $addToSet: "$viewed_by_ip" },
        },
      },
    ]);

    const viewsPerDay = await MediaViewLog.aggregate([
      { $match: { media_id: mediaIdObject } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const total_views = generalStats[0]?.total_views || 0;
    const unique_ips = generalStats[0]?.unique_ips_set?.length || 0;

    const views_per_day = viewsPerDay.reduce((acc, day) => {
      acc[day._id] = day.count;
      return acc;
    }, {});

    const finalResponse = {
      total_views,
      unique_ips,
      views_per_day,
    };

    await client.set(cacheKey, JSON.stringify(finalResponse), "EX", 3600);

    res.status(200).json(finalResponse);
  } catch (error) {
    console.error("Error in getMediaAnalytics controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
