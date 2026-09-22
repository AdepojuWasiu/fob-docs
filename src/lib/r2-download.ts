import {
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { r2, R2_BUCKET } from "./r2";

export async function getR2ObjectBuffer(
  key: string
) {
  const result = await r2.send(
    new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    })
  );

  if (!result.Body) {
    throw new Error("R2 object has no body");
  }

  const bytes = await result.Body.transformToByteArray();

  return Buffer.from(bytes);
}