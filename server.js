import "dotenv/config";

import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import { connectDB } from "./lib/db.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);

app.listen(8000, () => {
  connectDB();
  console.log("Server is running on port: 8000");
});

export default app;
