import arcjet, { tokenBucket } from "@arcjet/node";
import "dotenv/config";

const viewLimiter = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: "1m",
      capacity: 100,
    }),
  ],
});

export default viewLimiter;
