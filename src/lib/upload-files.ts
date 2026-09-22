type UploadFile = {
  field: string;
  file: File;
};

type PresignedFile = {
  field: string;
  originalName: string;
  mimeType: string;
  size: number;
  key: string;
  uploadUrl: string;
};

export async function uploadFilesToR2(
  submissionId: string,
  files: UploadFile[]
) {
  try {
    const response = await fetch("/api/upload/presign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        submissionId,
        files: files.map(({ field, file }) => ({
          field,
          name: file.name,
          type: file.type,
          size: file.size,
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to generate upload URLs");
    }

    const presignedFiles: PresignedFile[] = data.files;

    return await Promise.all(
      presignedFiles.map(async (item) => {
        const original = files.find(
          (file) =>
            file.field === item.field &&
            file.file.name === item.originalName
        );

        if (!original) {
          throw new Error(`Original file not found: ${item.originalName}`);
        }

        const uploadResponse = await fetch(item.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": item.mimeType,
          },
          body: original.file,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload ${item.originalName}`);
        }

        return {
          field: item.field,
          originalName: item.originalName,
          mimeType: item.mimeType,
          size: item.size,
          key: item.key,
        };
      })
    );
  } catch (error) {
    try {
      await fetch("/api/submissions/fail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          reason:
            error instanceof Error
              ? error.message
              : "Unable to upload submission files",
        }),
      });
    } catch (markError) {
      console.error("Unable to report upload failure:", markError);
    }

    throw error;
  }
}