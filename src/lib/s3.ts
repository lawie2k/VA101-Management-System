import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { checkRateLimit, RATE_LIMIT_PROFILES } from "./rate-limit";

// Initialize S3 Client
// AWS credentials will be automatically picked up from standard environment variables:
// AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

const DEFAULT_BUCKET = process.env.AWS_S3_BUCKET || "va101-storage";

interface UploadParams {
  fileBuffer: Buffer;
  fileName: string;
  contentType: string;
  isPublic?: boolean;
}

/**
 * Uploads a file to AWS S3.
 * If AWS credentials are not present (e.g. local dev), it falls back to a mock URL.
 * 
 * @param isPublic If true, uploads to a 'public/' folder. If false, uploads to 'private/' folder.
 * @returns The S3 key (path) of the uploaded file.
 */
export async function uploadToS3({ fileBuffer, fileName, contentType, isPublic = false }: UploadParams): Promise<string> {
  // 1. Enforce strict rate limit for storage to prevent AWS S3 bucket spam
  const rateLimit = checkRateLimit(`storage_upload`, RATE_LIMIT_PROFILES.STORAGE);
  if (!rateLimit.success) {
    console.warn(`[AWS S3 RATE LIMIT EXCEEDED] Throttling upload for ${fileName}`);
    throw new Error("Upload rate limit exceeded. Please try again later.");
  }

  const folder = isPublic ? "public" : "private";
  const uniqueKey = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}-${fileName}`;

  // Mock upload for local development if no AWS keys are present
  if (!process.env.AWS_ACCESS_KEY_ID && process.env.NODE_ENV !== "production") {
    console.log(`[AWS S3 MOCK] Uploading file ${fileName} to ${uniqueKey}`);
    return uniqueKey;
  }

  const command = new PutObjectCommand({
    Bucket: DEFAULT_BUCKET,
    Key: uniqueKey,
    Body: fileBuffer,
    ContentType: contentType,
    // Note: If you want objects to be publicly readable via direct URL without presigning,
    // you would set ACL: "public-read" here (if your bucket allows ACLs). 
    // We will assume signed URLs for everything or use CloudFront for public.
  });

  await s3Client.send(command);
  return uniqueKey;
}

/**
 * Generates a signed URL to view a private file securely.
 * The URL expires in the given number of seconds (default 1 hour).
 */
export async function getSignedFileUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
  // Mock for local dev
  if (!process.env.AWS_ACCESS_KEY_ID && process.env.NODE_ENV !== "production") {
    return `/mock-s3-url/${key}`;
  }

  const command = new GetObjectCommand({
    Bucket: DEFAULT_BUCKET,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

/**
 * Generates a public URL for a file (assuming bucket policy allows public read for the 'public/' prefix, 
 * or using a CloudFront distribution).
 */
export function getPublicFileUrl(key: string): string {
  // Mock for local dev
  if (!process.env.AWS_ACCESS_KEY_ID && process.env.NODE_ENV !== "production") {
    return `/mock-s3-url/${key}`;
  }

  if (process.env.NEXT_PUBLIC_CLOUDFRONT_URL) {
    return `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${key}`;
  }

  return `https://${DEFAULT_BUCKET}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;
}
