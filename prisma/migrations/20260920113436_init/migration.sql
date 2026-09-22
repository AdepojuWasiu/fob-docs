-- CreateEnum
CREATE TYPE "SubmissionType" AS ENUM ('EMPLOYEE', 'GUARANTOR');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('DRAFT', 'UPLOADING', 'SUBMITTED', 'FAILED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('EMPLOYEE_PICTURE', 'GUARANTOR_PICTURE', 'ACADEMIC_CERTIFICATE', 'NYSC_CERTIFICATE', 'BIRTH_CERTIFICATE', 'OLEVEL_CERTIFICATE', 'EMPLOYEE_VALID_ID', 'GUARANTOR_VALID_ID', 'SIGNATURE', 'OTHER_DOCUMENT', 'GENERATED_EMPLOYEE_PDF', 'GENERATED_GUARANTOR_PDF');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'UPLOADED', 'VERIFIED', 'FAILED');

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "type" "SubmissionType" NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "nin" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "stateOfOrigin" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "lga" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "phoneNumberTwo" TEXT,
    "kinFirstName" TEXT NOT NULL,
    "kinLastName" TEXT NOT NULL,
    "kinMiddleName" TEXT NOT NULL,
    "kinGender" TEXT NOT NULL,
    "kinAddress" TEXT NOT NULL,
    "kinRelationship" TEXT NOT NULL,
    "kinPhoneNumber" TEXT NOT NULL,
    "kinPhoneNumberTwo" TEXT,
    "pfaName" TEXT,
    "pin" TEXT,
    "tin" TEXT,
    "accountHolder" TEXT,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "taxIdPin" TEXT,
    "sickness" TEXT,
    "moneyCheckBox" BOOLEAN NOT NULL DEFAULT false,
    "sicknessCheckBox" BOOLEAN NOT NULL DEFAULT false,
    "consentCheckBox" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guarantor" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "employeeAddress" TEXT NOT NULL,
    "employeeGender" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "yearsOfRelationship" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "otherName" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "guarGender" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "stateOfOrigin" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "phoneNumberTwo" TEXT,
    "occupation" TEXT NOT NULL,
    "guarHomeAddress" TEXT NOT NULL,
    "guarHomeState" TEXT NOT NULL,
    "guarHomeLga" TEXT NOT NULL,
    "guarHomeCity" TEXT NOT NULL,
    "guarOfficeAddress" TEXT NOT NULL,
    "guarOfficeState" TEXT NOT NULL,
    "guarOfficeLga" TEXT NOT NULL,
    "guarOfficeCity" TEXT NOT NULL,
    "checkGuarantorBox" BOOLEAN NOT NULL DEFAULT false,
    "signatureDate" TEXT NOT NULL,
    "consentCheckBox" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guarantor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "r2Key" TEXT NOT NULL,
    "url" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Submission_type_idx" ON "Submission"("type");

-- CreateIndex
CREATE INDEX "Submission_status_idx" ON "Submission"("status");

-- CreateIndex
CREATE INDEX "Submission_createdAt_idx" ON "Submission"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_submissionId_key" ON "Employee"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Guarantor_submissionId_key" ON "Guarantor"("submissionId");

-- CreateIndex
CREATE INDEX "Document_submissionId_idx" ON "Document"("submissionId");

-- CreateIndex
CREATE INDEX "Document_type_idx" ON "Document"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Document_submissionId_type_r2Key_key" ON "Document"("submissionId", "type", "r2Key");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guarantor" ADD CONSTRAINT "Guarantor_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
