import { uploadFilesToR2 } from "./upload-files";

export async function uploadGuarantorFiles(
  submissionId: string,
  data: any
) {
  const files: {
    field: string;
    file: File;
  }[] = [];

  const fields = [
    "validID",
    "picture",
    "signature",
  ];

  for (const field of fields) {
    const value = data[field];

    if (value?.[0] instanceof File) {
      files.push({
        field,
        file: value[0],
      });
    }
  }

  return uploadFilesToR2(submissionId, files);
}