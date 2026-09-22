import { uploadFilesToR2 } from "./upload-files";

export async function uploadEmployeeFiles(
  submissionId: string,
  formTwo: any
) {
  const files: {
    field: string;
    file: File;
  }[] = [];

  const singleFiles = [
    "picture",
    "academicCertificate",
    "nyscCertificate",
    "birthCertificate",
    "olevelCertificate",
    "validId",
  ];

  for (const field of singleFiles) {
    const value = formTwo[field];

    if (value?.[0] instanceof File) {
      files.push({
        field,
        file: value[0],
      });
    }
  }

  for (const file of formTwo.otherDocuments ?? []) {
    if (file instanceof File) {
      files.push({
        field: "otherDocuments",
        file,
      });
    }
  }

  return uploadFilesToR2(submissionId, files);
}