import { prisma } from "@/lib/prisma";
import type { AdminRecord, RecordKind, SubmissionStatus } from "@/lib/admin-data";

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

const sizeLabel = (size: number) => {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

type AdminPerson = Record<string, unknown>;
type AdminSubmission = {
  id: string;
  status: SubmissionStatus;
  failedReason: string | null;
  type: string;
  createdAt: Date;
  employee: AdminPerson | null;
  guarantor: AdminPerson | null;
  documents: {
    id: string;
    type: string;
    originalName: string;
    mimeType: string;
    size: number;
  }[];
};

function employeeName(employee: AdminPerson) {
  return [employee.firstName, employee.middleName, employee.lastName].filter(Boolean).join(" ");
}

function guarantorName(guarantor: AdminPerson) {
  return [guarantor.firstName, guarantor.otherName, guarantor.surname].filter(Boolean).join(" ");
}

function recordFromSubmission(submission: AdminSubmission, kind: RecordKind): AdminRecord {
  const employee = submission.employee;
  const guarantor = submission.guarantor;
  const person = kind === "employees" ? employee : guarantor;
  const name = person
    ? kind === "employees" ? employeeName(employee!) : guarantorName(guarantor!)
    : submission.id;
  const documents = submission.documents.map((document) => ({
    id: document.id,
    name: document.originalName,
    category: document.type,
    type: (document.mimeType.startsWith("image/") ? "image" : "pdf") as "image" | "pdf",
    size: sizeLabel(document.size),
    url: `/api/admin/download?submissionId=${submission.id}&documentId=${document.id}`,
  }));

  return {
    id: submission.id,
    name,
    email: person ? String(person.email) : "",
    phone: person ? String(person.phoneNumber) : "",
    location: person ? String(kind === "employees" ? person.state : person.guarHomeState) : "",
    status: submission.status as SubmissionStatus,
    failedReason: submission.failedReason,
    submittedAt: formatDate(submission.createdAt),
    role: person ? String(kind === "employees" ? person.jobTitle : person.occupation) : "",
    department: person ? String(kind === "employees" ? person.department : `For ${person.employeeName}`) : "",
    documents,
    fields: person ? Object.entries(person)
      .filter(([key, value]) => !["id", "submissionId", "createdAt", "updatedAt"].includes(key) && value !== null)
      .map(([label, value]) => ({ label, value: String(value) })) : [],
  };
}

export async function getAdminRecords(kind: RecordKind, query = "", status = "All status") {
  const submissions = await prisma.submission.findMany({
    where: {
      type: kind === "employees" ? "EMPLOYEE" : "GUARANTOR",
      ...(status !== "All status" ? { status: status as SubmissionStatus } : {}),
    },
    include: { employee: true, guarantor: true, documents: true },
    orderBy: { createdAt: "desc" },
  });

  const normalizedQuery = query.trim().toLowerCase();
  return submissions
    .filter((submission) => {
      const person = kind === "employees" ? submission.employee : submission.guarantor;
      const name = person ? kind === "employees" ? employeeName(person) : guarantorName(person) : submission.id;
      const contact = person ? `${person.email} ${person.phoneNumber}` : "";
      return !normalizedQuery || `${name} ${contact} ${submission.id}`.toLowerCase().includes(normalizedQuery);
    })
    .map((submission) => recordFromSubmission(submission as AdminSubmission, kind));
}

export async function getAdminRecordsPage(
  kind: RecordKind,
  query = "",
  status = "All status",
  page = 1,
  pageSize = 4,
) {
  const normalizedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
  const normalizedPageSize = Number.isFinite(pageSize) ? Math.min(50, Math.max(1, Math.floor(pageSize))) : 4;
  const normalizedQuery = query.trim();
  const searchTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const statusFilter = status !== "All status"
    ? { status: status as SubmissionStatus }
    : {};
  const personFilter = normalizedQuery
    ? kind === "employees"
      ? {
          employee: {
            AND: searchTokens.map((token) => ({ OR: [
              { firstName: { contains: token, mode: "insensitive" as const } },
              { middleName: { contains: token, mode: "insensitive" as const } },
              { lastName: { contains: token, mode: "insensitive" as const } },
              { email: { contains: token, mode: "insensitive" as const } },
              { phoneNumber: { contains: token, mode: "insensitive" as const } },
              { department: { contains: token, mode: "insensitive" as const } },
            ] })),
          },
        }
      : {
          guarantor: {
            AND: searchTokens.map((token) => ({ OR: [
              { firstName: { contains: token, mode: "insensitive" as const } },
              { otherName: { contains: token, mode: "insensitive" as const } },
              { surname: { contains: token, mode: "insensitive" as const } },
              { email: { contains: token, mode: "insensitive" as const } },
              { phoneNumber: { contains: token, mode: "insensitive" as const } },
              { occupation: { contains: token, mode: "insensitive" as const } },
              { employeeName: { contains: token, mode: "insensitive" as const } },
            ] })),
          },
        }
    : {};
  const where: NonNullable<Parameters<typeof prisma.submission.findMany>[0]>["where"] = {
    type: (kind === "employees" ? "EMPLOYEE" : "GUARANTOR") as "EMPLOYEE" | "GUARANTOR",
    ...statusFilter,
    ...(normalizedQuery ? {
      OR: [
        { id: { contains: normalizedQuery, mode: "insensitive" as const } },
        personFilter,
      ],
    } : {}),
  };
  const submissions = await prisma.submission.findMany({
    where,
    include: { employee: true, guarantor: true, documents: true },
    orderBy: { createdAt: "desc" },
    skip: (normalizedPage - 1) * normalizedPageSize,
    take: normalizedPageSize,
  });
  const total = await prisma.submission.count({ where });

  return {
    records: submissions
      .map((submission) => recordFromSubmission(submission as AdminSubmission, kind)),
    total,
    page: normalizedPage,
    pageSize: normalizedPageSize,
    totalPages: Math.max(1, Math.ceil(total / normalizedPageSize)),
  };
}

export async function getAdminRecord(kind: RecordKind, id: string) {
  const submission = await prisma.submission.findFirst({
    where: { id, type: kind === "employees" ? "EMPLOYEE" : "GUARANTOR" },
    include: { employee: true, guarantor: true, documents: true },
  });
  if (!submission) return null;
  return recordFromSubmission(submission as AdminSubmission, kind);
}

export async function getAdminOverview() {
  const today = new Date();
  const todayStart = new Date(today);
  todayStart.setUTCHours(0, 0, 0, 0);
  const activityStart = new Date(todayStart);
  activityStart.setUTCDate(activityStart.getUTCDate() - 6);

  const [employees, guarantors, submitted, failed, recent, activitySubmissions] = await Promise.all([
    prisma.submission.count({ where: { type: "EMPLOYEE" } }),
    prisma.submission.count({ where: { type: "GUARANTOR" } }),
    prisma.submission.count({ where: { status: "SUBMITTED" } }),
    prisma.submission.count({ where: { status: "FAILED" } }),
    prisma.submission.findMany({ include: { employee: true, guarantor: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.submission.findMany({
      where: { createdAt: { gte: activityStart } },
      select: { createdAt: true },
    }),
  ]);

  const activity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(activityStart);
    date.setUTCDate(activityStart.getUTCDate() + index);
    const nextDate = new Date(date);
    nextDate.setUTCDate(date.getUTCDate() + 1);

    return {
      label: date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
      count: activitySubmissions.filter(
        (submission) => submission.createdAt >= date && submission.createdAt < nextDate
      ).length,
    };
  });

  return {
    employees,
    guarantors,
    submitted,
    failed,
    activity,
    recent: recent.map((submission) => ({
      id: submission.id,
      type: submission.type,
      name: submission.employee
        ? employeeName(submission.employee)
        : submission.guarantor
          ? guarantorName(submission.guarantor)
          : submission.id,
      submittedAt: formatDate(submission.createdAt),
      status: submission.status as SubmissionStatus,
    })),
  };
}

export async function getSubmissionDocument(documentId: string, submissionId: string) {
  return prisma.document.findFirst({ where: { id: documentId, submissionId } });
}

export async function getSubmissionDocuments(submissionId: string) {
  return prisma.document.findMany({ where: { submissionId }, orderBy: { createdAt: "asc" } });
}
