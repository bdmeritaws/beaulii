import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: process.env.AWS_REGION1 || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID1,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY1,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME1 || "beaulii";
const CDN_URL = process.env.AWS_CDN_URL1 || `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION1 || "us-east-1"}.amazonaws.com`;

const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadToS3(file, folder = "category") {
  if (!file) {
    throw new Error("No file provided");
  }

  const fileType = file.type;
  if (!ALLOWED_TYPES[fileType]) {
    throw new Error("Invalid file type. Allowed: jpg, jpeg, png, webp, gif");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("File too large. Maximum size: 5MB");
  }

  const extension = ALLOWED_TYPES[fileType];
  const uniqueName = `${uuidv4()}.${extension}`;
  const key = `${folder}/${uniqueName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: fileType,
  });

  await s3Client.send(command);

  return {
    path: key,
    url: `${CDN_URL}/${key}`.replace(/\/+/g, '/'),
    filename: uniqueName,
  };
}

export async function deleteFromS3(key) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
  return { success: true };
}

export { s3Client, BUCKET_NAME, CDN_URL, ALLOWED_TYPES, MAX_SIZE };
