import { DocumentType } from "@/generated/prisma/enums";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
];

export const FILE_RULES: Record<
  string,
  {
    documentType: DocumentType;
    multiple: boolean;
  }
> = {
  picture: {
    documentType: DocumentType.EMPLOYEE_PICTURE,
    multiple: false,
  },

  academicCertificate: {
    documentType: DocumentType.ACADEMIC_CERTIFICATE,
    multiple: false,
  },

  nyscCertificate: {
    documentType: DocumentType.NYSC_CERTIFICATE,
    multiple: false,
  },

  birthCertificate: {
    documentType: DocumentType.BIRTH_CERTIFICATE,
    multiple: false,
  },

  olevelCertificate: {
    documentType: DocumentType.OLEVEL_CERTIFICATE,
    multiple: false,
  },

  validId: {
    documentType: DocumentType.EMPLOYEE_VALID_ID,
    multiple: false,
  },

  otherDocuments: {
    documentType: DocumentType.OTHER_DOCUMENT,
    multiple: true,
  },

  validID: {
    documentType: DocumentType.GUARANTOR_VALID_ID,
    multiple: false,
  },

  signature: {
    documentType: DocumentType.SIGNATURE,
    multiple: false,
  },
};