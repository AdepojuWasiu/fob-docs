import { z } from "zod";

export const employeeFormOneSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    middleName: z.string().min(1, "Middle Name is required"),
    dateOfBirth: z.string().min(1, "Date Of Birth is required"),
    gender: z.string().min(1, "Select your gender"),
    nin: z.string().min(1, "NIN must contain exactly 11 digits"),
    jobTitle: z.string().min(1, "Job Title is required"),
    employmentType: z.string().min(1, "Select Your Employement Type"),
    department: z.string().min(1, "Select Your Department"),
    maritalStatus: z.string().min(1, "Select Marital status"),
    nationality: z.string().min(1, "Select Your Nationality"),
    stateOfOrigin: z.string().min(1, "Select your state of origin"),
    address: z.string().min(1, "Address is required"),
    state: z.string().min(1, "Select state your home is located"),
    lga: z.string().min(1, "LGA where your home is located is required"),
    city: z.string().min(1, "City where your home is located is required"),
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
    kinFirstName: z.string().min(1, "Next of Kin First Name is required"),
    kinLastName: z.string().min(1, "Next of Kin Last Name is required"),
    kinMiddleName: z.string().min(1, "Next of Kin Middle Name is required"),
    kinGender: z.string().min(1, "Select your Next of Kin gender"),
    kinAddress: z.string().min(1, "Next of Kin Address is required"),
    kinRelationship: z.string().min(1, "Select relationship with Next of Kin"),
    kinPhoneNumber: z
      .string()
      .regex(/^0[7-9]\d{9}$/, "Phone number must contain exactly 11 digits and start with 0"),
    kinPhoneNumberTwo: z
      .string()
      .refine(
        (value) => value === "" || /^0[7-9]\d{9}$/.test(value),
        "Phone number must be empty or contain exactly 11 digits and start with 0"
      )
      .optional(),
  
})

export type employeeFormOneValues = z.infer<typeof employeeFormOneSchema>