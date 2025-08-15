import "dotenv/config";
import { Storage } from "@google-cloud/storage";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectId = process.env.GCP_PROJECT_ID;
const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const bucketName = process.env.GCS_BUCKET_NAME;

if (!projectId || !keyFilename || !bucketName) {
  throw new Error(
    "Missing required environment variables: GCP_PROJECT_ID, GOOGLE_APPLICATION_CREDENTIALS, or GCS_BUCKET_NAME"
  );
}

const storage = new Storage({
  projectId: projectId,
  keyFilename: path.join(__dirname, keyFilename),
});

const bucket = storage.bucket(bucketName);

console.log(
  `Successfully connected to Google Cloud Storage bucket: ${bucket.name}`
);

export { bucket, storage };
