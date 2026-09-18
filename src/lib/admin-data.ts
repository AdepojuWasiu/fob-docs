export type RecordKind = "employees" | "guarantors";

export interface AdminDocument {
  id: string;
  name: string;
  category: string;
  type: "image" | "pdf";
  size: string;
  url: string;
}

export interface AdminRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "Verified" | "Pending" | "Review";
  submittedAt: string;
  role: string;
  department: string;
  documents: AdminDocument[];
  fields: { label: string; value: string }[];
}

const previewText = (title: string) =>
  `FOB Docs mock document\n\n${title}\n\nThis placeholder represents a submitted document in the admin dashboard demo.`;

export const makeMockDocument = (
  id: string,
  name: string,
  category: string,
  type: "image" | "pdf",
  size: string,
  url = ""
): AdminDocument => ({
  id,
  name,
  category,
  type,
  size,
  url: url || `data:text/plain;charset=utf-8,${encodeURIComponent(previewText(name))}`,
});

export const employees: AdminRecord[] = [
  {
    id: "FOB-2401",
    name: "Amina Yusuf",
    email: "amina.yusuf@fob.ng",
    phone: "+234 803 445 1201",
    location: "Lagos",
    status: "Verified",
    submittedAt: "Sep 12, 2026",
    role: "Senior Operations Analyst",
    department: "Corporate Services",
    documents: [
      makeMockDocument("e-1", "Passport photograph.jpg", "Personal", "image", "248 KB", "/fob-image.png"),
      makeMockDocument("e-2", "National ID card.pdf", "Identification", "pdf", "1.2 MB"),
      makeMockDocument("e-3", "Bank details.pdf", "Financial", "pdf", "684 KB"),
      makeMockDocument("e-4", "Pension PIN.pdf", "Employment", "pdf", "516 KB"),
    ],
    fields: [
      { label: "Full name", value: "Amina Zainab Yusuf" },
      { label: "Date of birth", value: "14 February 1992" },
      { label: "Gender", value: "Female" },
      { label: "Employment type", value: "Full-time employee" },
      { label: "NIN", value: "2849 1039 2210" },
      { label: "Address", value: "18 Adeola Odeku Street, Victoria Island, Lagos" },
      { label: "Bank", value: "GTBank •••• 8832" },
      { label: "PFA", value: "Tangerine APT Pensions" },
    ],
  },
  {
    id: "FOB-2402",
    name: "Chinedu Okafor",
    email: "chinedu.okafor@fob.ng",
    phone: "+234 809 220 4345",
    location: "Abuja",
    status: "Pending",
    submittedAt: "Sep 11, 2026",
    role: "Technology Specialist",
    department: "Technology",
    documents: [
      makeMockDocument("e-5", "Passport photograph.jpg", "Personal", "image", "212 KB", "/fob-image.png"),
      makeMockDocument("e-6", "Voters card.pdf", "Identification", "pdf", "944 KB"),
      makeMockDocument("e-7", "Tax identification.pdf", "Employment", "pdf", "708 KB"),
    ],
    fields: [
      { label: "Full name", value: "Chinedu Emmanuel Okafor" },
      { label: "Date of birth", value: "02 July 1988" },
      { label: "Gender", value: "Male" },
      { label: "Employment type", value: "Contract" },
      { label: "NIN", value: "5120 8842 1093" },
      { label: "Address", value: "22 Gwarimpa Estate, Abuja" },
      { label: "Bank", value: "Access Bank •••• 1940" },
      { label: "PFA", value: "Stanbic IBTC Pension Managers" },
    ],
  },
  {
    id: "FOB-2403",
    name: "Tolu Adeyemi",
    email: "tolu.adeyemi@fob.ng",
    phone: "+234 701 902 8830",
    location: "Ibadan",
    status: "Review",
    submittedAt: "Sep 09, 2026",
    role: "Finance Associate",
    department: "Finance",
    documents: [
      makeMockDocument("e-8", "Passport photograph.jpg", "Personal", "image", "231 KB", "/fob-image.png"),
      makeMockDocument("e-9", "International passport.pdf", "Identification", "pdf", "1.4 MB"),
      makeMockDocument("e-10", "Next of kin form.pdf", "Personal", "pdf", "630 KB"),
    ],
    fields: [
      { label: "Full name", value: "Tolulope David Adeyemi" },
      { label: "Date of birth", value: "19 November 1995" },
      { label: "Gender", value: "Male" },
      { label: "Employment type", value: "Full-time employee" },
      { label: "NIN", value: "6702 3319 5811" },
      { label: "Address", value: "6 Ring Road, Ibadan, Oyo State" },
      { label: "Bank", value: "First Bank •••• 4208" },
      { label: "PFA", value: "ARM Pension Managers" },
    ],
  },
  {
    id: "FOB-2404",
    name: "Fatima Bello",
    email: "fatima.bello@fob.ng",
    phone: "+234 806 720 1901",
    location: "Kano",
    status: "Verified",
    submittedAt: "Sep 08, 2026",
    role: "Regulatory Officer",
    department: "Regulatory and Public Relations",
    documents: [
      makeMockDocument("e-11", "Passport photograph.jpg", "Personal", "image", "228 KB", "/fob-image.png"),
      makeMockDocument("e-12", "National ID card.pdf", "Identification", "pdf", "1.1 MB"),
      makeMockDocument("e-13", "Bank details.pdf", "Financial", "pdf", "596 KB"),
    ],
    fields: [
      { label: "Full name", value: "Fatima Halima Bello" },
      { label: "Date of birth", value: "10 March 1990" },
      { label: "Gender", value: "Female" },
      { label: "Employment type", value: "Full-time employee" },
      { label: "NIN", value: "3901 7704 2518" },
      { label: "Address", value: "14 Bompai Road, Kano" },
      { label: "Bank", value: "UBA •••• 7511" },
      { label: "PFA", value: "Leadway Pensure" },
    ],
  },
  {
    id: "FOB-2405",
    name: "Emeka Nwosu",
    email: "emeka.nwosu@fob.ng",
    phone: "+234 814 321 7700",
    location: "Enugu",
    status: "Verified",
    submittedAt: "Sep 06, 2026",
    role: "Commercial Executive",
    department: "Commercial",
    documents: [
      makeMockDocument("e-14", "Passport photograph.jpg", "Personal", "image", "245 KB", "/fob-image.png"),
      makeMockDocument("e-15", "Drivers licence.pdf", "Identification", "pdf", "892 KB"),
      makeMockDocument("e-16", "Pension PIN.pdf", "Employment", "pdf", "478 KB"),
    ],
    fields: [
      { label: "Full name", value: "Emeka Joseph Nwosu" },
      { label: "Date of birth", value: "26 June 1986" },
      { label: "Gender", value: "Male" },
      { label: "Employment type", value: "Full-time employee" },
      { label: "NIN", value: "4209 3311 0048" },
      { label: "Address", value: "9 Independence Layout, Enugu" },
      { label: "Bank", value: "Zenith Bank •••• 9022" },
      { label: "PFA", value: "NLPC Pension Fund Administrators" },
    ],
  },
  {
    id: "FOB-2406",
    name: "Sade Ibrahim",
    email: "sade.ibrahim@fob.ng",
    phone: "+234 802 116 0455",
    location: "Lagos",
    status: "Pending",
    submittedAt: "Sep 04, 2026",
    role: "People Experience Lead",
    department: "Corporate Services",
    documents: [
      makeMockDocument("e-17", "Passport photograph.jpg", "Personal", "image", "219 KB", "/fob-image.png"),
      makeMockDocument("e-18", "National ID card.pdf", "Identification", "pdf", "1.0 MB"),
      makeMockDocument("e-19", "Next of kin form.pdf", "Personal", "pdf", "614 KB"),
    ],
    fields: [
      { label: "Full name", value: "Sade Mariam Ibrahim" },
      { label: "Date of birth", value: "08 January 1993" },
      { label: "Gender", value: "Female" },
      { label: "Employment type", value: "Full-time employee" },
      { label: "NIN", value: "7732 4490 1220" },
      { label: "Address", value: "4 Yaba Road, Lagos" },
      { label: "Bank", value: "Stanbic IBTC •••• 1146" },
      { label: "PFA", value: "Veritas Glanvills Pensions" },
    ],
  },
];

export const guarantors: AdminRecord[] = [
  {
    id: "GUA-1101",
    name: "Musa Abdullahi",
    email: "musa.abdullahi@gmail.com",
    phone: "+234 805 600 1208",
    location: "Lagos",
    status: "Verified",
    submittedAt: "Sep 12, 2026",
    role: "Business owner",
    department: "For Amina Yusuf",
    documents: [
      makeMockDocument("g-1", "Guarantor photograph.jpg", "Personal", "image", "206 KB", "/fob-image.png"),
      makeMockDocument("g-2", "Means of identification.pdf", "Identification", "pdf", "1.1 MB"),
      makeMockDocument("g-3", "Guaranty form.pdf", "Declaration", "pdf", "744 KB"),
    ],
    fields: [
      { label: "Full name", value: "Musa Ibrahim Abdullahi" },
      { label: "Relationship", value: "Family friend" },
      { label: "Years known", value: "More than 3 years" },
      { label: "Occupation", value: "Business owner" },
      { label: "Marital status", value: "Married" },
      { label: "Address", value: "31 Herbert Macaulay Way, Yaba, Lagos" },
      { label: "Guaranteed employee", value: "Amina Yusuf" },
      { label: "State of origin", value: "Kaduna" },
    ],
  },
  {
    id: "GUA-1102",
    name: "Ngozi Eze",
    email: "ngozi.eze@gmail.com",
    phone: "+234 803 114 9052",
    location: "Abuja",
    status: "Pending",
    submittedAt: "Sep 11, 2026",
    role: "Civil servant",
    department: "For Chinedu Okafor",
    documents: [
      makeMockDocument("g-4", "Guarantor photograph.jpg", "Personal", "image", "214 KB", "/fob-image.png"),
      makeMockDocument("g-5", "Voters card.pdf", "Identification", "pdf", "908 KB"),
      makeMockDocument("g-6", "Guaranty form.pdf", "Declaration", "pdf", "701 KB"),
    ],
    fields: [
      { label: "Full name", value: "Ngozi Adaeze Eze" },
      { label: "Relationship", value: "Friend" },
      { label: "Years known", value: "1-3 years" },
      { label: "Occupation", value: "Civil servant" },
      { label: "Marital status", value: "Single" },
      { label: "Address", value: "15 Garki Area 3, Abuja" },
      { label: "Guaranteed employee", value: "Chinedu Okafor" },
      { label: "State of origin", value: "Anambra" },
    ],
  },
  {
    id: "GUA-1103",
    name: "Kunle Adebayo",
    email: "kunle.adebayo@gmail.com",
    phone: "+234 706 440 2210",
    location: "Ibadan",
    status: "Review",
    submittedAt: "Sep 09, 2026",
    role: "Accountant",
    department: "For Tolu Adeyemi",
    documents: [
      makeMockDocument("g-7", "Guarantor photograph.jpg", "Personal", "image", "232 KB", "/fob-image.png"),
      makeMockDocument("g-8", "Drivers licence.pdf", "Identification", "pdf", "812 KB"),
      makeMockDocument("g-9", "Guaranty form.pdf", "Declaration", "pdf", "690 KB"),
    ],
    fields: [
      { label: "Full name", value: "Kunle Olumide Adebayo" },
      { label: "Relationship", value: "Brother" },
      { label: "Years known", value: "More than 3 years" },
      { label: "Occupation", value: "Accountant" },
      { label: "Marital status", value: "Married" },
      { label: "Address", value: "2 Bodija Estate, Ibadan, Oyo State" },
      { label: "Guaranteed employee", value: "Tolu Adeyemi" },
      { label: "State of origin", value: "Oyo" },
    ],
  },
  {
    id: "GUA-1104",
    name: "Hauwa Garba",
    email: "hauwa.garba@gmail.com",
    phone: "+234 809 801 3310",
    location: "Kano",
    status: "Verified",
    submittedAt: "Sep 08, 2026",
    role: "School administrator",
    department: "For Fatima Bello",
    documents: [
      makeMockDocument("g-10", "Guarantor photograph.jpg", "Personal", "image", "226 KB", "/fob-image.png"),
      makeMockDocument("g-11", "National ID card.pdf", "Identification", "pdf", "1.0 MB"),
      makeMockDocument("g-12", "Guaranty form.pdf", "Declaration", "pdf", "682 KB"),
    ],
    fields: [
      { label: "Full name", value: "Hauwa Aisha Garba" },
      { label: "Relationship", value: "Friend" },
      { label: "Years known", value: "More than 3 years" },
      { label: "Occupation", value: "School administrator" },
      { label: "Marital status", value: "Married" },
      { label: "Address", value: "7 Zoo Road, Kano" },
      { label: "Guaranteed employee", value: "Fatima Bello" },
      { label: "State of origin", value: "Kano" },
    ],
  },
];

export const getRecords = (kind: RecordKind) => (kind === "employees" ? employees : guarantors);
export const getRecord = (kind: RecordKind, id: string) => getRecords(kind).find((record) => record.id === id);
