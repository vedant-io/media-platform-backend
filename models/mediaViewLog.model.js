import mongoose from "mongoose";

const mediaViewLogSchema = new mongoose.Schema(
  {
    media_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaAsset",
      required: true,
    },
    viewed_by_ip: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const MediaViewLog = mongoose.model("MediaViewLog", mediaViewLogSchema);

export default MediaViewLog;
