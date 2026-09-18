"use client";

import Link from "next/link";
import { useState } from "react";
import JSZip from "jszip";
import { ArrowDownToLine, ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, Download, Eye, FileArchive, FileText, Image as ImageIcon, Search, SlidersHorizontal, Users, X } from "lucide-react";
import { AdminDocument, AdminRecord, RecordKind, makeMockDocument } from "@/lib/admin-data";

const statusStyles: Record<AdminRecord["status"], string> = {
    Verified: "bg-[#EAF8F0] text-[#258253]", 
    Pending: "bg-[#FFF6DE] text-[#A06B00]", 
    Review: "bg-[#FFF0EE] text-[#C45B4E]"
 };

const kindLabel = (kind: RecordKind) => kind === "employees" ? "employees" : "guarantors";

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return(
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#00A1D8]">
                {eyebrow}
            </p>
            <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[#19334A] md:text-[34px]">
                {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7590A1]">
                {description}
            </p>
        </div>
                {action}
    </div>
  )
}

function StatCard({ label, value, note, accent, icon: Icon }: { label: string; value: string; note: string; accent: string; icon: typeof Users }) {
  return (
        <div className="rounded-2xl border border-[#E0ECF2] bg-white p-5 shadow-[0_8px_30px_rgba(32,89,117,0.04)]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-[#7891A0]">{label}</p>
                    <p className="mt-3 text-[30px] font-bold tracking-[-0.04em] text-[#19334A]">{value}</p>
                </div>
                <div className="rounded-xl p-3" style={{ backgroundColor: `${accent}18`, color: accent }}>
                    <Icon size={20} />
                </div>
            </div>
            <p className="mt-4 text-xs text-[#7891A0]">
                <span className="font-semibold text-[#258253]">
                    {note}
                </span> from last month
            </p>
        </div>
  )
}

export function OverviewPage() {
  return( 
    <>
      <PageHeading 
          eyebrow="Good morning, Admin" title="A clear view of your submissions." 
          description="Monitor every employee and guarantor record from one organised workspace." 
          action={
             <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00B0F0] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(0,176,240,0.2)]">
               <ArrowDownToLine size={17} />
               Export report
             </button>} />
             <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total employees" value="248" note="12.8%" accent="#00B0F0" icon={Users} />
              <StatCard label="Total guarantors" value="236" note="8.4%" accent="#7B6FE8" icon={Users} />
              <StatCard label="Pending review" value="18" note="4 new" accent="#F1A33B" icon={CalendarDays} />
              <StatCard label="Verified records" value="466" note="96.1%" accent="#39A875" icon={FileText} />
             </div>
             <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <div className="rounded-2xl border border-[#E0ECF2] bg-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-base font-bold">Submission activity</h2>
                    <p className="mt-1 text-xs text-[#7891A0]">New records received over the last 7 days</p>
                  </div>
                  <span className="rounded-lg bg-[#F2F8FB] px-3 py-2 text-xs font-semibold text-[#60798B]">This week</span>
                </div>
                <div className="mt-8 flex h-[210px] items-end gap-3 border-b border-[#E8F0F4] px-2 sm:gap-6">
                  {[["Mon", 44], ["Tue", 68], ["Wed", 52], ["Thu", 86], ["Fri", 62], ["Sat", 37], ["Sun", 55]].map(([day, height]) => 
                      <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-3">
                        <div className="w-full max-w-[44px] rounded-t-lg bg-[#B8EAF8] transition-all hover:bg-[#00B0F0]" style={{ height: `${height}%` }} />
                        <span className="text-[11px] text-[#8BA0AD]">{day}</span>
                        </div>
                   )}
                </div>
                <div className="mt-5 flex gap-5 text-xs text-[#7891A0]">
                  <span className="flex items-center gap-2">
                    <i className="h-2 w-2 rounded-full bg-[#B8EAF8]" />
                    Submissions
                  </span>
                  <span className="font-semibold text-[#258253]">+18.6%</span>
                </div>
                </div>
                <div className="rounded-2xl border border-[#E0ECF2] bg-[#19334A] p-6 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#78DFFF]">
                     <FileArchive size={20} />
                  </div>
                  <h2 className="mt-8 text-xl font-bold tracking-tight">Document centre</h2>
                  <p className="mt-2 text-sm leading-6 text-[#B1C9D6]">You have 18 records waiting for a final review before they are archived.</p>
                  <Link href="/admin/employees?status=Review" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#00B0F0] px-4 py-3 text-xs font-bold text-white">
                    Review records 
                    <ChevronRight size={15} />
                  </Link>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-[#E0ECF2] bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold">Recent submissions</h2>
                    <p className="mt-1 text-xs text-[#7891A0]">The latest people added to FOB Docs</p>
                  </div>
                  <Link href="/admin/employees" className="text-xs font-semibold text-[#0099D0]">
                    View all
                  </Link>
                </div>
                <div className="mt-6 divide-y divide-[#EEF3F5]">
                  {["Amina Yusuf", "Chinedu Okafor", "Musa Abdullahi"].map((name, index) => 
                     <div key={name} className="flex items-center justify-between py-4 first:pt-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E9F8FD] text-xs font-bold text-[#008FC4]">
                          {name.split(" ").map((part) => part[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{name}</p>
                          <p className="text-xs text-[#8BA0AD]">{index === 2 ? "Guarantor" : "Employee"} · Sep {12 - index}, 2026</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${index === 1 ? statusStyles.Pending : statusStyles.Verified}`}>{index === 1 ? "Pending" : "Verified"}</span>
                    </div>
                  )}
                </div>
              </div>
      </>
  )
  } 


function FileIcon({ type }: { type: AdminDocument["type"] }) { return type === "image" ? <ImageIcon size={19} /> : <FileText size={19} />; }

type DetailField = { label: string; value: string };
type DetailSection = { title: string; fields: DetailField[] };

export function getCompleteDocuments(kind: RecordKind, record: AdminRecord) {
  const requiredDocuments = kind === "employees"
    ? [
        ["Academic certificate.pdf", "Academic", "pdf", "1.3 MB"],
        ["NYSC certificate.pdf", "Employment", "pdf", "816 KB"],
        ["Birth certificate.pdf", "Personal", "pdf", "744 KB"],
        ["OLevel certificate.pdf", "Academic", "pdf", "1.1 MB"],
        ["Other documents.pdf", "Additional", "pdf", "980 KB"],
      ]
    : [
        ["Signature.png", "Declaration", "image", "188 KB"],
        ["Guaranty declaration.pdf", "Declaration", "pdf", "744 KB"],
      ];

  const existingNames = new Set(record.documents.map((document) => document.name));
  const missingDocuments = requiredDocuments
    .filter(([name]) => !existingNames.has(name))
    .map(([name, category, type, size], index) => makeMockDocument(`${record.id}-extra-${index}`, name, category, type as "image" | "pdf", size));

  return [...record.documents, ...missingDocuments];
}

export function getDetailSections(kind: RecordKind, record: AdminRecord): DetailSection[] {
  const value = (label: string, fallback: string) => record.fields.find((field) => field.label === label)?.value ?? fallback;

  if (kind === "employees") {
    return [
      {
        title: "Personal details",
        fields: [
          { label: "Full name", value: value("Full name", record.name) },
          { label: "Date of birth", value: value("Date of birth", "14 February 1992") },
          { label: "Gender", value: value("Gender", "Not provided") },
          { label: "NIN", value: value("NIN", "Not provided") },
          { label: "Job title", value: record.role },
          { label: "Employment type", value: value("Employment type", "Full-time employee") },
          { label: "Department", value: record.department },
          { label: "Marital status", value: "Married" },
          { label: "Nationality", value: "Nigerian" },
          { label: "State of origin", value: "Lagos" },
        ],
      },
      {
        title: "Contact details",
        fields: [
          { label: "Address", value: value("Address", "Not provided") },
          { label: "State", value: record.location },
          { label: "LGA", value: record.location === "Lagos" ? "Eti-Osa" : "Municipal Area Council" },
          { label: "City", value: record.location },
          { label: "Email", value: record.email },
          { label: "Telephone number", value: record.phone },
          { label: "Telephone number 2", value: "+234 809 000 0000" },
        ],
      },
      {
        title: "Pension details",
        fields: [
          { label: "Name of PFA", value: value("PFA", "Tangerine APT Pensions") },
          { label: "PIN", value: "PEN100240188320" },
          { label: "Tax identification number", value: "TIN-4920188320" },
        ],
      },
      {
        title: "Personal bank details",
        fields: [
          { label: "Account holder", value: value("Full name", record.name) },
          { label: "Bank name", value: value("Bank", "GTBank") },
          { label: "Bank account number", value: "•••• 8832" },
          { label: "Tax ID PIN", value: "TXP-883201" },
          { label: "Payment consent", value: "Accepted" },
        ],
      },
      {
        title: "Next of kin details",
        fields: [
          { label: "Full name", value: "Ibrahim Yusuf" },
          { label: "Gender", value: "Male" },
          { label: "Address", value: "12 Alhaji Street, Lagos" },
          { label: "Relationship", value: "Brother" },
          { label: "Telephone number", value: "+234 805 112 4401" },
          { label: "Telephone number 2", value: "+234 701 221 0930" },
        ],
      },
      {
        title: "Health information",
        fields: [
          { label: "Sickness within the last 30 days", value: "None of the above" },
          { label: "Health declaration", value: "Accepted" },
        ],
      },
    ];
  }

  return [
    {
      title: "Employee personal information",
      fields: [
        { label: "Employee name", value: value("Guaranteed employee", "Amina Yusuf") },
        { label: "Employee address", value: "18 Adeola Odeku Street, Victoria Island, Lagos" },
        { label: "Gender", value: "Female" },
        { label: "Relationship with employee", value: value("Relationship", "Family friend") },
        { label: "Years of relationship", value: value("Years known", "More than 3 years") },
      ],
    },
    {
      title: "Guarantor personal information",
      fields: [
        { label: "Full name", value: value("Full name", record.name) },
        { label: "Date of birth", value: "22 August 1984" },
        { label: "Gender", value: "Male" },
        { label: "Marital status", value: value("Marital status", "Married") },
        { label: "State of origin", value: value("State of origin", "Kaduna") },
        { label: "Email", value: record.email },
        { label: "Telephone number", value: record.phone },
        { label: "Telephone number 2", value: "+234 809 000 0000" },
        { label: "Occupation", value: record.role },
      ],
    },
    {
      title: "Guarantor home address",
      fields: [
        { label: "Home address", value: value("Address", "31 Herbert Macaulay Way, Yaba, Lagos") },
        { label: "State", value: record.location },
        { label: "LGA", value: record.location === "Lagos" ? "Yaba" : "Municipal Area Council" },
        { label: "City", value: record.location },
      ],
    },
    {
      title: "Guarantor office address",
      fields: [
        { label: "Office address", value: "14 Marina Road, Central Business District" },
        { label: "State", value: record.location },
        { label: "LGA", value: record.location === "Lagos" ? "Lagos Island" : "Municipal Area Council" },
        { label: "City", value: record.location },
      ],
    },
    {
      title: "Guaranty",
      fields: [
        { label: "Declaration", value: "Accepted" },
        { label: "Signature", value: "Signature.png submitted" },
        { label: "Signature date", value: record.submittedAt },
        { label: "Consent", value: "Accepted" },
      ],
    },
  ];
}

export function RecordsPage(
  { kind, records }: { kind: RecordKind; records: AdminRecord[] }) {

  const [query, setQuery] = useState(""); 
  const [status, setStatus] = useState("All status"); 
  const [page, setPage] = useState(1); const pageSize = 5;

  const filtered = records.filter((record) => 
    (status === "All status" || record.status === status) && 
    `${record.name} ${record.email} ${record.id} ${record.department}`.toLowerCase().includes(query.toLowerCase())); 
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize)); 
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return(
    <>
        <PageHeading 
          eyebrow="Records" 
          title={`${kind === "employees" ? "Employee Bio Data" : "Guarantors Submissions"}`} 
          description={`Search, review and manage every ${kind === "employees" ? "employee bio data" : "guarantor submission"} in your workspace.`}
          action={
            <button className="inline-flex items-center gap-2 rounded-xl border border-[#D9E8EE] bg-white px-4 py-3 text-sm font-semibold text-[#527184]">
                <ArrowDownToLine size={16} />
                Export CSV
            </button>
          } />

        <div className="rounded-2xl border border-[#E0ECF2] bg-white shadow-[0_8px_30px_rgba(32,89,117,0.04)]">
            <div className="flex flex-col gap-3 border-b border-[#EAF1F4] p-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-[330px]">
                    <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AAEBB]" />
                    <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={`Search ${kindLabel(kind)}...`} className="h-10 w-full rounded-xl border border-[#E1EDF2] bg-[#F9FCFD] pl-10 pr-3 text-sm outline-none placeholder:text-[#A3B5BF] focus:border-[#00B0F0]" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-xs text-[#7891A0]">
                        <SlidersHorizontal size={15} />
                        Status
                    </div>
                    <select 
                        value={status} 
                        onChange={(event) => { setStatus(event.target.value); setPage(1); }} 
                        className="h-10 rounded-xl border border-[#E1EDF2] bg-white px-3 text-xs font-semibold text-[#527184] outline-none">
                        <option>All status</option>
                        <option>Verified</option>
                        <option>Pending</option>
                        <option>Review</option>
                    </select>
                </div>
                
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                    <thead className="bg-[#FBFDFE] text-[10px] uppercase tracking-[0.12em] text-[#91A5B1]">
                        <tr>
                            <th className="px-6 py-4 font-bold">Name</th>
                            <th className="px-4 py-4 font-bold">Contact</th>
                            <th className="px-4 py-4 font-bold">Location</th>
                            <th className="px-4 py-4 font-bold">Submitted</th>
                            <th className="px-4 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 text-right font-bold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEF3F5]">
                      { visible.map((record) => 
                         <tr key={record.id} className="group hover:bg-[#FBFDFE]">
                            <td className="px-6 py-4">
                                <Link href={`/admin/${kind}/${record.id}`} className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E9F8FD] text-xs font-bold text-[#008FC4]">
                                        {record.name.split(" ").map((part) => part[0]).join("")}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#19334A] group-hover:text-[#0099D0]">
                                            {record.name}
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-[#8BA0AD]">
                                            {record.id}
                                        </p>
                                    </div>
                                </Link>
                            </td>
                            <td className="px-4 py-4">
                                <p className="text-xs text-[#527184]">{record.email}</p>
                                <p className="mt-1 text-[11px] text-[#8BA0AD]">{record.phone}</p>
                            </td>
                            <td className="px-4 py-4 text-xs text-[#527184]">
                                {record.location}
                            </td>
                            <td className="px-4 py-4 text-xs text-[#527184]">
                                {record.submittedAt}
                            </td>
                            <td className="px-4 py-4">
                                <span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${statusStyles[record.status]}`}>
                                    {record.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <Link href={`/admin/${kind}/${record.id}`} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-[#008FC4] hover:bg-[#E9F8FD]">
                                  <Eye size={15} />
                                  View,
                                </Link>
                            </td>
                        </tr>
                      )}
                    </tbody>
                </table>
                
                {visible.length === 0 && 
                  <div className="p-12 text-center text-sm text-[#7891A0]">
                    No {kindLabel(kind)} match that search.
                  </div>
                }</div>
                <div className="flex flex-col gap-3 border-t border-[#EAF1F4] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-[#8BA0AD]">
                        Showing 
                        <span className="font-semibold text-[#527184]">{filtered.length ? (page - 1) * pageSize + 1 : 0}-{Math.min(page * pageSize, filtered.length)}</span>
                         of 
                         <span className="font-semibold text-[#527184]">{filtered.length}</span> 
                         records
                    </p>
                    <div className="flex items-center gap-2">
                        <button 
                          disabled={page === 1} 
                          onClick={() => setPage((value) => value - 1)} 
                          className="rounded-lg border border-[#E1EDF2] p-2 text-[#60798B] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Previous page">
                          <ChevronLeft size={16} />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#527184]">{page} / {totalPages}</span>
                        <button 
                         disabled={page === totalPages} 
                         onClick={() => setPage((value) => value + 1)} 
                         className="rounded-lg border border-[#E1EDF2] p-2 text-[#60798B] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Next page">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
     
    </>
  )
}

// export function DetailPage(
//   { kind, record }: { kind: RecordKind; record: AdminRecord }) {
//   const [preview, setPreview] = useState<AdminDocument | null>(null); 
//   const [downloading, setDownloading] = useState(false);

//   const documents = getCompleteDocuments(kind, record);
//   const sections = getDetailSections(kind, record);

//   record.fields = sections.flatMap((section) => [
//     { label: section.title, value: "Section" },
//     ...section.fields.map((field) => ({ ...field, label: `${section.title} · ${field.label}` })),
//   ]);

//   record.documents = documents;

//   const downloadFile = (file: AdminDocument) => { 
//     const anchor = document.createElement("a");
//      anchor.href = file.url; 
//      anchor.download = file.name;
//       anchor.click(); 
//   };

//   const downloadAll = async () => { 
//     setDownloading(true); 
//     const zip = new JSZip(); 
//      for (const file of documents) { 
//       const response = await fetch(file.url); 
//       zip.file(file.name, await response.blob());
//      } 
//      const blob = await zip.generateAsync({ type: "blob" }); 
//      const url = URL.createObjectURL(blob); 
//      const anchor = document.createElement("a");
//      anchor.href = url; 
//      anchor.download = `${record.name.replaceAll(" ", "-").toLowerCase()}-documents.zip`; 
//      anchor.click(); URL.revokeObjectURL(url); setDownloading(false); 
//   };

//   return (
//   <>
//     <Link href={`/admin/${kind}`} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#608091] hover:text-[#0099D0]">
//       <ArrowLeft size={16} />Back to {kindLabel(kind)}
//     </Link>
//     <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
//       <div>
//         <div className="mb-3 flex items-center gap-2">
//           <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyles[record.status]}`}>{record.status}</span>
//           <span className="text-xs text-[#91A5B1]">{record.id}</span>
//         </div>
//         <h1 className="text-[30px] font-bold tracking-[-0.03em]">{record.name}</h1>
//         <p className="mt-2 text-sm text-[#7891A0]">{record.role} · {record.department} · submitted {record.submittedAt}</p>
//       </div>
//       <button onClick={downloadAll} disabled={downloading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00B0F0] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(0,176,240,0.2)] disabled:opacity-60">
//         <Download size={17} />{downloading ? "Preparing ZIP..." : "Download all files"}
//       </button>
//     </div>
//     <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
//       <section className="rounded-2xl border border-[#E0ECF2] bg-white p-6">
//         <h2 className="text-base font-bold">{kind === "employees" ? "Employee information" : "Guarantor information"}</h2>
//         <p className="mt-1 text-xs text-[#7891A0]">Submitted details for this record</p>
//         <div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
//           { record.fields.map((field) => 
//               <div key={field.label}>
//                 <p className="text-[11px] font-medium text-[#91A5B1]">{field.label}</p>
//                 <p className="mt-1 text-sm font-semibold leading-5 text-[#315268]">{field.value}</p>
//               </div>)
//           }
//         </div>
//       </section>
//       <section className="rounded-2xl border border-[#E0ECF2] bg-white p-6">
//         <div className="flex items-start justify-between">
//           <div>
//             <h2 className="text-base font-bold">Submitted documents</h2>
//             <p className="mt-1 text-xs text-[#7891A0]">{record.documents.length} files attached to this record</p>
//           </div>
//           <FileArchive size={19} className="text-[#00B0F0]" />
//         </div>
//         <div className="mt-6 space-y-3">
//           {record.documents.map((file) => 
//              <div key={file.id} className="flex items-center gap-3 rounded-xl border border-[#EAF1F4] p-3">
//                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E9F8FD] text-[#0099D0]">
//                 <FileIcon type={file.type} />
//                </div>
//                <div className="min-w-0 flex-1">
//                 <p className="truncate text-xs font-semibold text-[#315268]">{file.name}</p>
//                 <p className="mt-1 text-[11px] text-[#91A5B1]">{file.category} · {file.size}</p>
//                </div>
//                <button onClick={() => setPreview(file)} className="rounded-lg p-2 text-[#7891A0] hover:bg-[#E9F8FD] hover:text-[#0099D0]" aria-label={`View ${file.name}`}>
//                 <Eye size={16} />
//               </button>
//               <button onClick={() => downloadFile(file)} className="rounded-lg p-2 text-[#7891A0] hover:bg-[#E9F8FD] hover:text-[#0099D0]" aria-label={`Download ${file.name}`}>
//                 <Download size={16} />
//               </button>
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//     {preview && 
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#19334A]/55 p-4 backdrop-blur-sm" onClick={() => setPreview(null)}>
//           <div className="w-full max-w-[680px] overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
//             <div className="flex items-center justify-between border-b border-[#EAF1F4] px-5 py-4">
//               <div>
//                 <p className="text-sm font-bold">{preview.name}</p>
//                 <p className="mt-1 text-[11px] text-[#91A5B1]">{preview.category} · {preview.size}</p>
//               </div>
//               <button onClick={() => setPreview(null)} className="rounded-lg p-2 text-[#7891A0] hover:bg-[#F2F8FB]" aria-label="Close preview">
//                 <X size={18} />
//               </button>
//             </div>
//             <div className="flex min-h-[300px] items-center justify-center bg-[#F2F8FB] p-8">
//               {preview.type === "image" && preview.url.startsWith("/") ? 
//                   <img src={preview.url} alt={preview.name} className="max-h-[380px] max-w-full rounded-xl object-contain shadow-sm" /> 
//                   : 
//                   <div className="w-full max-w-[400px] rounded-xl border border-[#DCEAF0] bg-white p-8 text-center">
//                     <FileText size={42} className="mx-auto text-[#00B0F0]" />
//                     <p className="mt-4 text-sm font-bold">Document preview</p>
//                     <p className="mt-2 text-xs leading-5 text-[#7891A0]">This mock PDF is ready to download. In production, the submitted file will render here.</p>
//                   </div>
//               }
//             </div>
//             <div className="flex justify-end gap-3 border-t border-[#EAF1F4] px-5 py-4">
//               <button onClick={() => downloadFile(preview)} className="inline-flex items-center gap-2 rounded-xl bg-[#00B0F0] px-4 py-2.5 text-xs font-bold text-white">
//                 <Download size={15} />Download file
//               </button>
//             </div>
//           </div>
//         </div>
//       }

//   </>
//   )
// }