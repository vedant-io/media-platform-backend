import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/authRoutes.js";

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
