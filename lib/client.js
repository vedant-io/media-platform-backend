import Redis from "ioredis";

const client = new Redis();

client.on("connect", () => {
  console.log("Connected to Redis successfully!");
});

client.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default client;
