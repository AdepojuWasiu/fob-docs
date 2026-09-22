import { prisma } from "@/lib/prisma";

export async function markSubmissionFailed(
  submissionId: unknown,
  reason: unknown
) {
  if (typeof submissionId !== "string" || !submissionId) {
    return;
  }

  const failedReason =
    typeof reason === "string" && reason
      ? reason
      : "Unknown submission failure";

  try {
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: "FAILED",
        failedReason,
      },
    });
  } catch (error) {
    console.error("Unable to mark submission as failed:", error);
  }
}