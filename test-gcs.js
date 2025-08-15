// File: test-gcs.js
import "dotenv/config";
import { Storage } from "@google-cloud/storage";
import path from "path";

async function testConnection() {
  try {
    console.log("Attempting to connect to Google Cloud Storage...");

    const keyFilePath = path.resolve(
      process.env.GOOGLE_APPLICATION_CREDENTIALS
    );
    console.log(`Using key file at: ${keyFilePath}`);

    const storage = new Storage({
      keyFilename: keyFilePath,
      projectId: process.env.GCP_PROJECT_ID,
    });

    const bucketName = process.env.GCS_BUCKET_NAME;
    console.log(`Pinging bucket: ${bucketName}`);

    // This is a simple, non-blocking operation to test authentication.
    const [buckets] = await storage.getBuckets();

    console.log("✅ Connection Successful! Found buckets:");
    buckets.forEach((bucket) => {
      console.log(`- ${bucket.name}`);
    });
  } catch (error) {
    console.error("❌ CONNECTION FAILED:", error);
  }
}

testConnection();
