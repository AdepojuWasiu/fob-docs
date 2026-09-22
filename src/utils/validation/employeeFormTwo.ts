import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf", "image/jpg"];
const ACCEPTED_FILE_TYPES_PHOTO = ["image/jpeg", "image/png", "image/jpg"];

const fileArray = z
  .array(z.instanceof(File))
  .refine(files => files.length > 0, "This file is required") 
  .max(1, "Only one file is allowed")
  .refine(files => files.every(f => ACCEPTED_FILE_TYPES.includes(f.type)), "Only .jpg, .png, and .pdf files are allowed")
  .refine(files => files.every(f => f.size <= MAX_FILE_SIZE), "File size must not exceed 5MB");

const fileArrayMultiple = z
  .array(z.instanceof(File))
  .refine(files => files.length > 0, "This file is required") 
  .refine(files => files.every(f => ACCEPTED_FILE_TYPES.includes(f.type)), "Only .jpg, .png, and .pdf files are allowed")
  .refine(files => files.every(f => f.size <= MAX_FILE_SIZE), "File size must not exceed 5MB");

const fileArrayPhoto = z
  .array(z.instanceof(File))
  .refine(files => files.length > 0, "This file is required") 
  .max(1, "Only one file is allowed")
  .refine(files => files.every(f => ACCEPTED_FILE_TYPES_PHOTO.includes(f.type)), "Only .jpg, .png files are allowed")
  .refine(files => files.every(f => f.size <= MAX_FILE_SIZE), "File size must not exceed 5MB");


export const employeeFormTwoSchema = z.object({
    pfaName: z.string().min(1, "PFA Name is required"),
    pin: z.string().min(1, "Pin is required"),
    tin: z.string().min(1, "Tin is required"),
    accountHolder: z.string().min(1, "Account holder is required"),
    bankName: z.string().min(1, "Bank Name is required"),
    accountNumber: z.string().min(1, "Account Number is required"),
    taxIdPin: z.string().min(1, "Tax ID Pin is required"),
    moneyCheckBox: z.boolean().refine((val) => val === true, {
      message: "You must agree with this claim",
    }),
    sickness: z.string().min(1, "Select Sickness in Last 30 days"),
    sicknessCheckBox: z.boolean().refine((val) => val === true, {
      message: "You must agree with this claim",
    }),
    picture: fileArrayPhoto,
    academicCertificate: fileArray,
    nyscCertificate: fileArray,
    birthCertificate: fileArray,
    olevelCertificate: fileArray,
    validId: fileArray,
    otherDocuments: fileArrayMultiple,
    consentCheckBox: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  
})

export type employeeFormTwoValues = z.infer<typeof employeeFormTwoSchema>