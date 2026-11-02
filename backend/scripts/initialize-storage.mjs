import { S3Client, HeadBucketCommand, CreateBucketCommand, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

const { S3_ENDPOINT, S3_REGION = "us-east-1", S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_PRIVATE_BUCKET } = process.env;
if (!S3_ENDPOINT || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY || !S3_PRIVATE_BUCKET) throw new Error("Private storage environment must be configured.");
const client = new S3Client({ endpoint: S3_ENDPOINT, region: S3_REGION, forcePathStyle: true, credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY } });
try { await client.send(new HeadBucketCommand({ Bucket: S3_PRIVATE_BUCKET })); }
catch (error) { if (![404, 403].includes(error.$metadata?.httpStatusCode)) throw error; await client.send(new CreateBucketCommand({ Bucket: S3_PRIVATE_BUCKET })); }
const key = `_verification/${randomUUID()}.pdf`;
try {
  await client.send(new PutObjectCommand({ Bucket: S3_PRIVATE_BUCKET, Key: key, Body: "private storage verification fixture", ContentType: "application/pdf" }));
  const direct = await fetch(`${S3_ENDPOINT}/${S3_PRIVATE_BUCKET}/${key}`);
  if (direct.ok) throw new Error("Storage is publicly readable. Digital delivery must remain disabled.");
  const signed = await getSignedUrl(client, new GetObjectCommand({ Bucket: S3_PRIVATE_BUCKET, Key: key }), { expiresIn: 30 });
  const authorized = await fetch(signed);
  if (!authorized.ok) throw new Error("Signed private storage retrieval failed.");
  console.log("Private bucket verified: anonymous access denied; signed retrieval succeeded.");
} finally { await client.send(new DeleteObjectCommand({ Bucket: S3_PRIVATE_BUCKET, Key: key })); }
