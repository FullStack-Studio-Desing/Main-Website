import "server-only";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export type ContentDisposition = "inline" | "attachment";

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
};

function readConfig(): R2Config {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_TICKETS_BUCKET?.trim() || "fssd-ticket-files";
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 tickets storage is not configured.");
  }
  return { accountId, accessKeyId, secretAccessKey, bucket };
}

export function isR2TicketsConfigured() {
  return Boolean(
    process.env.R2_ACCOUNT_ID?.trim() &&
      process.env.R2_ACCESS_KEY_ID?.trim() &&
      process.env.R2_SECRET_ACCESS_KEY?.trim() &&
      process.env.R2_TICKETS_BUCKET?.trim(),
  );
}

let cachedClient: S3Client | null = null;

function client(): S3Client {
  if (cachedClient) return cachedClient;
  const { accountId, accessKeyId, secretAccessKey } = readConfig();
  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return cachedClient;
}

/** Presigned PUT for direct browser upload. Expires in 10 minutes. */
export async function presignPut(key: string, contentType: string, size: number) {
  const { bucket } = readConfig();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    ContentLength: size,
  });
  return getSignedUrl(client(), command, { expiresIn: 600 });
}

function quoteFilename(filename: string) {
  const ascii = filename.replace(/[^\x20-\x7E]/g, "_").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"${ascii}"`;
}

/** Presigned GET for download or inline preview. Expires in 5 minutes. */
export async function presignGet(
  key: string,
  filename: string,
  disposition: ContentDisposition,
  contentType: string,
) {
  const { bucket } = readConfig();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ResponseContentDisposition: `${disposition}; filename=${quoteFilename(filename)}`,
    ResponseContentType: contentType,
  });
  return getSignedUrl(client(), command, { expiresIn: 300 });
}

export async function headObject(key: string) {
  const { bucket } = readConfig();
  return client().send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
}

export async function deleteObject(key: string) {
  const { bucket } = readConfig();
  await client().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}