import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf", "image/jpg"];

const fileArray = z
  .array(z.instanceof(File))
  .refine(files => files.length > 0, "This file is required") 
  .max(1, "Only one file is allowed")
  .refine(files => files.every(f => ACCEPTED_FILE_TYPES.includes(f.type)), "Only .jpg, .png, and .pdf files are allowed")
  .refine(files => files.every(f => f.size <= MAX_FILE_SIZE), "File size must not exceed 5MB");

export const guarantorFormSchema = z.object({
    employeeName: z.string().min(1, "Employee Name is required"),
    employeeAddress: z.string().min(1, "Employee Address is required"),
    employeeGender: z.string().min(1, "Select Employee Gender"),
    relationship: z.string().min(1, "Relationship With Employee is required"),
    yearsOfRelationship: z.string().min(1, "Select years of relationship with employee"),
    validID: fileArray,
    picture: fileArray,
    firstName: z.string().min(1, "First Name is required"),
    surname: z.string().min(1, "Surname is required"),
    otherName: z.string().min(1, "Other Name is required"),
    dateOfBirth: z.string().min(1, "Date Of Birth is required"),
    guarGender: z.string().min(1, "Select your gender"),
    maritalStatus: z.string().min(1, "Select Marital status"),
    stateOfOrigin: z.string().min(1, "Select your state of origin"),
    email: z.email().min(1, "Email is required"),
    phoneNumber: z
      .string()
      .regex(/^0[7-9]\d{9}$/, "Phone number must contain exactly 11 digits and start with 0"),
    phoneNumberTwo: z
      .string()
      .refine(
        (value) => value === "" || /^0[7-9]\d{9}$/.test(value),
        "Phone number must be empty or contain exactly 11 digits and start with 0"
      )
      .optional(),
    occupation: z.string().min(1, "Select your occupation"),
    guarHomeAddress: z.string().min(1, "Home Address is required"),
    guarHomeState: z.string().min(1, "Select state your home is located"),
    guarHomeLga: z.string().min(1, "LGA where your home is located is required"),
    guarHomeCity: z.string().min(1, "City where your home is located is required"),
    guarOfficeAddress: z.string().min(1, "Office Address is required"),
    guarOfficeState: z.string().min(1, "Select state your office is located"),
    guarOfficeLga: z.string().min(1, "LGA where your office is located is required"),
    guarOfficeCity: z.string().min(1, "City where your office is located is required"),
    checkGuarantorBox: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
    signature: fileArray,
    signatureDate: z.string().min(1, "Signature Date is required"),
    consentCheckBox: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  
})

export type guarantorFormValues = z.infer<typeof guarantorFormSchema>