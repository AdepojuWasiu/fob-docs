"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowDownToLine, CalendarDays, ChevronLeft, ChevronsLeft, ChevronsRight, ChevronRight, Eye, FileArchive, FileText, Search, SlidersHorizontal, Users } from "lucide-react";
import { AdminRecord, RecordKind } from "@/lib/admin-data";

const statusStyles: Record<AdminRecord["status"], string> = {
  DRAFT: "bg-[#FFF6DE] text-[#A06B00]",
  UPLOADING: "bg-[#E9F8FD] text-[#008FC4]",
  SUBMITTED: "bg-[#EAF8F0] text-[#258253]",
  FAILED: "bg-[#FFF0EE] text-[#C45B4E]",
 };

const kindLabel = (kind: RecordKind) => kind === "employees" ? "employees" : "guarantors";

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return(
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
            {/* <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#00A1D8]">
                {eyebrow}
            </p> */}
            <h1 className="text-[20px] font-bold tracking-[-0.03em] text-[#19334A] md:text-[34px]">
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

export function OverviewPage({ data }: { data: { employees: number; guarantors: number; submitted: number; failed: number; activity: { label: string; count: number }[]; recent: { id: string; type: string; name: string; submittedAt: string; status: AdminRecord["status"] }[] } }) {
  const maxActivity = Math.max(1, ...data.activity.map((item) => item.count));

  return( 
    <>
      <PageHeading 
          eyebrow="Good morning, Admin" title="A clear view of submissions." 
          description="Monitor every employee and guarantor record from one organised workspace." 
          // action={
          //    <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00B0F0] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(0,176,240,0.2)]">
          //      <ArrowDownToLine size={17} />
          //      Export report
          //    </button>} 
        />
             <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total employees" value={String(data.employees)} note="Live" accent="#00B0F0" icon={Users} />
              <StatCard label="Total guarantors" value={String(data.guarantors)} note="Live" accent="#7B6FE8" icon={Users} />
              <StatCard label="Submitted records" value={String(data.submitted)} note="Live" accent="#39A875" icon={FileText} />
              <StatCard label="Failed records" value={String(data.failed)} note="Live" accent="#C45B4E" icon={CalendarDays} />
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
                  {data.activity.map(({ label, count }) => 
                      <div key={label} className="group relative flex h-full flex-1 flex-col items-center justify-end gap-3">
                        <div
                          className="w-full max-w-[44px] rounded-t-lg bg-[#B8EAF8] transition-all hover:bg-[#00B0F0]"
                          style={{ height: `${count === 0 ? 2 : (count / maxActivity) * 100}%` }}
                        />
                        <span className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-md bg-[#19334A] px-2 py-1 text-[10px] font-semibold whitespace-nowrap text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                          {count} submission{count === 1 ? "" : "s"}
                        </span>
                        <span className="text-[11px] text-[#8BA0AD]">{label}</span>
                        </div>
                   )}
                </div>
                <div className="mt-5 flex gap-5 text-xs text-[#7891A0]">
                  <span className="flex items-center gap-2">
                    <i className="h-2 w-2 rounded-full bg-[#B8EAF8]" />
                    Submissions
                  </span>
                  <span className="font-semibold text-[#258253]">
                    {data.activity.reduce((total, item) => total + item.count, 0)} this week
                  </span>
                </div>
                </div>
                <div className="rounded-2xl border border-[#E0ECF2] bg-[#19334A] p-6 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#78DFFF]">
                     <FileArchive size={20} />
                  </div>
                  <h2 className="mt-8 text-xl font-bold tracking-tight">Document centre</h2>
                  <p className="mt-2 text-sm leading-6 text-[#B1C9D6]">You have {data.failed} failed records that need attention.</p>
                  <Link href="/admin/employees?status=FAILED" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#00B0F0] px-4 py-3 text-xs font-bold text-white">
                    View failed records 
                    <ChevronRight size={15} />
                  </Link>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-[#E0ECF2] bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold">Recent submissions</h2>
                    <p className="mt-1 text-xs text-[#7891A0]">The latest submissions added to FOB Docs</p>
                  </div>
                  <Link href="/admin/employees" className="text-xs font-semibold text-[#0099D0]">
                    View all
                  </Link>
                </div>
                <div className="mt-6 divide-y divide-[#EEF3F5]">
                  {data.recent.map((submission) =>
                    <div key={submission.id} className="flex items-center justify-between py-4 first:pt-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E9F8FD] text-xs font-bold text-[#008FC4]">
                          {submission.name.split(" ").map((part) => part[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{submission.name}</p>
                          <p className="text-xs text-[#8BA0AD]">{submission.type === "GUARANTOR" ? "Guarantor" : "Employee"} · {submission.submittedAt}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyles[submission.status]}`}>{submission.status}</span>
                    </div>
                  )}
                </div>
              </div>
      </>
  )
  } 


type DetailField = { label: string; value: string };
type DetailSection = { title: string; fields: DetailField[] };

const asAdminRecords = (value: unknown): AdminRecord[] => Array.isArray(value) ? value : [];

export function getCompleteDocuments(record: AdminRecord) {
  return record.documents;
}

export function getDetailSections(kind: RecordKind, record: AdminRecord): DetailSection[] {
  const formatLabel = (label: string) => label
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase());
  const sectionDefinitions = kind === "employees"
    ? [
        { title: "Personal details", keys: ["firstName", "middleName", "lastName", "dateOfBirth", "gender", "nin", "jobTitle", "employmentType", "department", "maritalStatus", "nationality", "stateOfOrigin"] },
        { title: "Contact details", keys: ["address", "state", "lga", "city", "email", "phoneNumber", "phoneNumberTwo"] },
        { title: "Pension details", keys: ["pfaName", "pin", "tin"] },
        { title: "Personal bank details", keys: ["accountHolder", "bankName", "accountNumber", "taxIdPin", "moneyCheckBox", "consentCheckBox"] },
        { title: "Next of kin details", keys: ["kinFirstName", "kinMiddleName", "kinLastName", "kinGender", "kinAddress", "kinRelationship", "kinPhoneNumber", "kinPhoneNumberTwo"] },
        { title: "Health information", keys: ["sickness", "sicknessCheckBox"] },
      ]
    : [
        { title: "Employee personal information", keys: ["employeeName", "employeeAddress", "employeeGender", "relationship", "yearsOfRelationship"] },
        { title: "Guarantor personal information", keys: ["firstName", "otherName", "surname", "dateOfBirth", "guarGender", "maritalStatus", "stateOfOrigin", "email", "phoneNumber", "phoneNumberTwo", "occupation"] },
        { title: "Guarantor home address", keys: ["guarHomeAddress", "guarHomeState", "guarHomeLga", "guarHomeCity"] },
        { title: "Guarantor office address", keys: ["guarOfficeAddress", "guarOfficeState", "guarOfficeLga", "guarOfficeCity"] },
        { title: "Guaranty", keys: ["checkGuarantorBox", "signatureDate", "consentCheckBox"] },
      ];
  const responseFields = new Map(record.fields.map((field) => [field.label, field.value]));
  const usedKeys = new Set<string>();
  const sections = sectionDefinitions.map((section) => ({
    title: section.title,
    fields: section.keys
      .filter((key) => responseFields.has(key))
      .map((key) => {
        usedKeys.add(key);
        return { label: formatLabel(key), value: responseFields.get(key) ?? "" };
      }),
  })).filter((section) => section.fields.length > 0);
  const otherFields = record.fields
    .filter((field) => !usedKeys.has(field.label))
    .map((field) => ({ label: formatLabel(field.label), value: field.value }));

  return otherFields.length > 0
    ? [...sections, { title: "Other details", fields: otherFields }]
    : sections;
}

export function RecordsPage(
  { kind, records: initialRecords = [] }: { kind: RecordKind; records?: AdminRecord[] }) {

  const [query, setQuery] = useState(""); 
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedStatus = searchParams.get("status");
  const status = ["DRAFT", "UPLOADING", "SUBMITTED", "FAILED"].includes(requestedStatus ?? "")
    ? requestedStatus!
    : "All status";
  const [page, setPage] = useState(1);
  const initialRecordList = asAdminRecords(initialRecords);
  const [records, setRecords] = useState<AdminRecord[]>(initialRecordList);
  const [total, setTotal] = useState(initialRecordList.length);
  const [pageSize, setPageSize] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(initialRecordList.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const exportRecords = async () => {
    setExporting(true);
    try {
      const response = await fetch(`/api/admin/export?kind=${kind}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to export records");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `fob-${kind}-report.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : "Unable to export records");
    } finally {
      setExporting(false);
    }
  };
  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      setRecords([]);
      try {
        const params = new URLSearchParams({ kind, query, status, page: String(page) });
        const response = await fetch(`/api/admin/records?${params}`, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("Unable to load records");
        const result = await response.json() as { records?: unknown; total?: unknown; pageSize?: unknown; totalPages?: unknown };
        const nextRecords = asAdminRecords(result.records);
        const nextTotal = typeof result.total === "number" ? Math.max(0, result.total) : nextRecords.length;
        const nextPageSize = typeof result.pageSize === "number" && result.pageSize > 0 ? result.pageSize : 4;
        const nextTotalPages = typeof result.totalPages === "number" && result.totalPages > 0
          ? result.totalPages
          : Math.max(1, Math.ceil(nextTotal / nextPageSize));
        setRecords(nextRecords);
        setTotal(nextTotal);
        setPageSize(nextPageSize);
        setTotalPages(nextTotalPages);
        if (page > nextTotalPages) setPage(nextTotalPages);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load records");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [kind, page, query, status]);

  const pageNumbers = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages)
    .sort((first, second) => first - second);
  const paginationItems = pageNumbers.reduce<(number | "ellipsis")[]>((items, pageNumber, index) => {
    if (index > 0 && pageNumber - pageNumbers[index - 1] > 1) items.push("ellipsis");
    items.push(pageNumber);
    return items;
  }, []);
  const visible = records;

  return(
    <>
        <PageHeading 
          eyebrow="Records" 
          title={`${kind === "employees" ? "Employee Bio Data" : "Guarantors Submissions"}`} 
          description={`Search, review and manage every ${kind === "employees" ? "employee bio data" : "guarantor submission"} in your workspace.`}
          action={
            <button onClick={exportRecords} disabled={exporting} className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-[#D9E8EE] bg-white px-4 py-3 text-sm font-semibold text-[#527184] disabled:cursor-wait disabled:opacity-60">
                <ArrowDownToLine size={16} />
              {exporting ? "Exporting..." : "Export CSV"}
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
                        onChange={(event) => {
                          const params = new URLSearchParams(searchParams.toString());
                          if (event.target.value === "All status") params.delete("status");
                          else params.set("status", event.target.value);
                          router.replace(`?${params.toString()}`);
                          setPage(1);
                        }} 
                        className="h-10 rounded-xl border border-[#E1EDF2] bg-white px-3 text-xs font-semibold text-[#527184] outline-none">
                        <option>All status</option>
                        <option>DRAFT</option>
                        <option>UPLOADING</option>
                        <option>SUBMITTED</option>
                        <option>FAILED</option>
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
                      {loading ? Array.from({ length: 4 }, (_, index) => (
                        <tr key={`loading-${index}`}><td colSpan={6} className="px-6 py-5"><div className="h-4 animate-pulse rounded bg-[#EAF1F4]" /></td></tr>
                      )) : visible.map((record) => 
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
                                        {kind === "guarantors" ? (
                                            <p className="mt-0.5 text-[11px] text-[#8BA0AD]">
                                                For (
                                                {record.fields?.find((field) => field.label === "employeeName")?.value}
                                                )
                                            </p>
                                        ): (
                                          <p className="mt-0.5 text-[11px] text-[#8BA0AD]">
                                            {record.id}
                                          </p>
                                        )}

                                        
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
                
                {error && <div className="p-8 text-center text-sm text-[#C45B4E]">{error}</div>}
                {!loading && !error && visible.length === 0 && 
                  <div className="p-12 text-center text-sm text-[#7891A0]">
                    No {kindLabel(kind)} match that search.
                  </div>
                }</div>
                <div className="flex flex-col gap-4 border-t border-[#EAF1F4] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex flex-wrap items-center gap-1.5 text-sm text-[#8BA0AD]">
                        <span>Showing</span>
                        <span className="font-semibold text-[#527184]">
                          {total ? (page - 1) * pageSize + 1 : 0} - {Math.min(page * pageSize, total)}
                        </span>
                        <span>of</span>
                        <span className="font-semibold text-[#527184]">{total}</span>
                        <span>records</span>
                    </p>
                    <nav className="flex items-center gap-1" aria-label="Pagination">
                        <button 
                          disabled={loading || page === 1}
                          onClick={() => setPage((value) => value - 1)} 
                          className="rounded-lg border border-[#E1EDF2] p-2 text-[#60798B] transition-colors hover:bg-[#F2F8FB] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Previous page">
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          disabled={loading || page === 1}
                          onClick={() => setPage(1)}
                          className="hidden rounded-lg border border-[#E1EDF2] p-2 text-[#60798B] transition-colors hover:bg-[#F2F8FB] disabled:cursor-not-allowed disabled:opacity-40 sm:inline-flex"
                          aria-label="First page"
                        >
                          <ChevronsLeft size={16} />
                        </button>
                        {paginationItems.map((item, index) => item === "ellipsis" ? (
                          <span key={`ellipsis-${index}`} className="px-2 text-xs text-[#91A5B1]" aria-hidden="true">...</span>
                        ) : (
                          <button
                            key={item}
                            disabled={loading}
                            onClick={() => setPage(item)}
                            aria-current={item === page ? "page" : undefined}
                            className={`min-w-9 rounded-lg border px-2.5 py-2 text-xs font-semibold transition-colors disabled:cursor-wait disabled:opacity-60 ${item === page ? "border-[#00B0F0] bg-[#E9F8FD] text-[#008FC4]" : "border-[#E1EDF2] text-[#60798B] hover:bg-[#F2F8FB]"}`}
                          >
                            {item}
                          </button>
                        ))}
                        <button
                          disabled={loading || page === totalPages}
                          onClick={() => setPage(totalPages)}
                          className="hidden rounded-lg border border-[#E1EDF2] p-2 text-[#60798B] transition-colors hover:bg-[#F2F8FB] disabled:cursor-not-allowed disabled:opacity-40 sm:inline-flex"
                          aria-label="Last page"
                        >
                          <ChevronsRight size={16} />
                        </button>
                        <button 
                         disabled={loading || page === totalPages}
                         onClick={() => setPage((value) => value + 1)} 
                         className="rounded-lg border border-[#E1EDF2] p-2 text-[#60798B] transition-colors hover:bg-[#F2F8FB] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Next page">
                            <ChevronRight size={16} />
                        </button>
                    </nav>
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