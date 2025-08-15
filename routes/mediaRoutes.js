import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMediaAnalytics,
  getStreamUrl,
  logMediaView,
  uploadMedia,
} from "../controllers/media.controller.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

router.post("/", protectRoute, upload.single("mediaFile"), uploadMedia);
router.get("/:id/stream-url", protectRoute, getStreamUrl);
router.get("/:id/view", protectRoute, logMediaView);
router.get("/:id/analytics", protectRoute, getMediaAnalytics);

export default router;
