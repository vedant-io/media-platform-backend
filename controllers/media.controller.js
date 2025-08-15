import { v4 as uuidv4 } from "uuid";
import { bucket } from "../lib/storage.js";
import MediaAsset from "../models/mediaAsset.model.js";

import MediaViewLog from "../models/mediaViewLog.model.js";

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

    const viewLog = new MediaViewLog({
      media_id: mediaAsset._id,
      viewed_by_ip: req.ip,
    });

    await viewLog.save();

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
