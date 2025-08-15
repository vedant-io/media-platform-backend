import mongoose from "mongoose";

const mediaAssetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["video", "audio"],
    },
    file_url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const MediaAsset = mongoose.model("MediaAsset", mediaAssetSchema);

export default MediaAsset;
