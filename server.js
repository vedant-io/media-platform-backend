import { configDotenv } from "dotenv";
import express from "express";

const app = express();

dotenv.config();

app.use(express.json());
