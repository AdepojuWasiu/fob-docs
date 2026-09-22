import {
  S3Client,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2_BUCKET = process.env.R2_BUCKET_NAME!;

export const R2_PUBLIC_URL =
  process.env.R2_PUBLIC_URL!;

export function getR2Url(key: string) {
  return `${R2_PUBLIC_URL}/${key}`;
}

export async function checkR2Object(key: string) {
  try {
    const result = await r2.send(
      new HeadObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
      })
    );

    return {
      exists: true,
      size: result.ContentLength ?? 0,
      contentType: result.ContentType,
    };
  } catch {
    return {
      exists: false,
    };
  }
}

export async function deleteR2Object(key: string) {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    })
  );
}