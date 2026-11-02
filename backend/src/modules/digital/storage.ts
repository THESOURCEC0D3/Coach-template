import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { validPrivateKey } from "./policy";

export async function signPrivateDownload(key: string, format: string) {
  const bucket = process.env.S3_PRIVATE_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!bucket || !accessKeyId || !secretAccessKey || !validPrivateKey(key)) throw new Error("Private download storage is not configured.");
  const endpoint = process.env.S3_PUBLIC_ENDPOINT || process.env.S3_ENDPOINT;
  const client = new S3Client({ region: process.env.S3_REGION || "us-east-1", endpoint, forcePathStyle: Boolean(endpoint), credentials: { accessKeyId, secretAccessKey } });
  const expiresIn = Math.min(300, Math.max(30, Number(process.env.DOWNLOAD_URL_TTL_SECONDS) || 120));
  return getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: key, ResponseContentType: format === "pdf" ? "application/pdf" : "application/epub+zip", ResponseContentDisposition: `attachment; filename="book.${format}"` }), { expiresIn });
}
