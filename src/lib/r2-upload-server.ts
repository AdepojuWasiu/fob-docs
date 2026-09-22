import {
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { r2, R2_BUCKET } from "./r2";

export async function uploadBufferToR2({
  key,
  buffer,
  contentType,
}: {
  key: string;
  buffer: Buffer;
  contentType: string;
}) {
  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
}