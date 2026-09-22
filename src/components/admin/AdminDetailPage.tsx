"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Download, Eye, FileArchive, FileText, Image as ImageIcon, X } from "lucide-react";
import { AdminDocument, AdminRecord, RecordKind } from "@/lib/admin-data";
import { getCompleteDocuments, getDetailSections } from "@/components/admin/AdminPages";

const statusStyles: Record<AdminRecord["status"], string> = {
  Verified: "bg-[#EAF8F0] text-[#258253]",
  Pending: "bg-[#FFF6DE] text-[#A06B00]",
  Review: "bg-[#FFF0EE] text-[#C45B4E]",
};

const kindLabel = (kind: RecordKind) => kind === "employees" ? "employees" : "guarantors";

function FileIcon({ type }: { type: AdminDocument["type"] }) {
  return type === "image" ? <ImageIcon size={19} /> : <FileText size={19} />;
}

export default function AdminDetailPage({ kind, record }: { kind: RecordKind; record: AdminRecord }) {
  const [preview, setPreview] = useState<AdminDocument | null>(null);
  const [downloading, setDownloading] = useState(false);
  const documents = getCompleteDocuments(kind, record);
  const sections = getDetailSections(kind, record);

  const downloadFile = (file: AdminDocument) => {
    const anchor = document.createElement("a");
    anchor.href = file.url;
    anchor.download = file.name;
    anchor.click();
  };

  const downloadAll = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`/api/admin/download/zip?submissionId=${encodeURIComponent(record.id)}`);
      if (!response.ok) throw new Error("Unable to prepare ZIP download");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${record.name.replaceAll(" ", "-").toLowerCase()}-documents.zip`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to download files");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <Link href={`/admin/${kind}`} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#608091] hover:text-[#0099D0]">
        <ArrowLeft size={16} />Back to {kindLabel(kind)}
      </Link>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyles[record.status]}`}>{record.status}</span>
            <span className="text-xs text-[#91A5B1]">{record.id}</span>
          </div>
          <h1 className="break-words text-2xl font-bold tracking-[-0.03em] sm:text-[30px]">{record.name}</h1>
          <p className="mt-2 break-words text-sm text-[#7891A0]">{record.role} · {record.department} · submitted {record.submittedAt}</p>
        </div>
        <button onClick={downloadAll} disabled={downloading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00B0F0] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(0,176,240,0.2)] disabled:opacity-60 md:w-auto">
          <Download size={17} />{downloading ? "Preparing ZIP..." : "Download all files"}
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <section className="rounded-2xl border border-[#E0ECF2] bg-white p-6">
          <h2 className="text-base font-bold">{kind === "employees" ? "Employee information" : "Guarantor information"}</h2>
          <p className="mt-1 text-xs text-[#7891A0]">Submitted details for this record</p>
          <div className="mt-6 space-y-7">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-[#19334A]">{section.title}</h3>
                <div className="mt-3 h-px w-full bg-[#DCEAF0]" />
                <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  {section.fields.map((field) => (
                    <div key={`${section.title}-${field.label}`}>
                      <p className="text-[11px] font-medium text-[#91A5B1]">{field.label}</p>
                      <p className="mt-1 text-sm font-semibold leading-5 text-[#315268]">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#E0ECF2] bg-white p-6">
          <div className="flex items-start justify-between">
            <div><h2 className="text-base font-bold">Submitted documents</h2><p className="mt-1 text-xs text-[#7891A0]">{documents.length} files attached to this record</p></div>
            <FileArchive size={19} className="text-[#00B0F0]" />
          </div>
          <div className="mt-6 space-y-3">
            {documents.map((file) => (
              <div key={file.id} className="flex items-center gap-3 rounded-xl border border-[#EAF1F4] p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E9F8FD] text-[#0099D0]"><FileIcon type={file.type} /></div>
                <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-[#315268]">{file.name}</p><p className="mt-1 text-[11px] text-[#91A5B1]">{file.category} · {file.size}</p></div>
                <button onClick={() => setPreview(file)} className="rounded-lg p-2 text-[#7891A0] hover:bg-[#E9F8FD] hover:text-[#0099D0]" aria-label={`View ${file.name}`}><Eye size={16} /></button>
                <button onClick={() => downloadFile(file)} className="rounded-lg p-2 text-[#7891A0] hover:bg-[#E9F8FD] hover:text-[#0099D0]" aria-label={`Download ${file.name}`}><Download size={16} /></button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {preview && 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#19334A]/55 p-4 backdrop-blur-sm" 
                onClick={() => setPreview(null)}>
          <div className="w-full max-w-[680px] overflow-hidden rounded-2xl bg-white shadow-2xl" 
                onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#EAF1F4] px-5 py-4">
                <div>
                    <p className="text-sm font-bold">{preview.name}</p>
                    <p className="mt-1 text-[11px] text-[#91A5B1]">{preview.category} · {preview.size}</p>
                </div>
                <button onClick={() => setPreview(null)} className="rounded-lg p-2 text-[#7891A0] hover:bg-[#F2F8FB]" aria-label="Close preview">
                    <X size={18} />
                </button>
            </div>
            <div className="flex min-h-[300px] items-center justify-center bg-[#F2F8FB] p-8">
                {
                preview.type === "image" && preview.url.startsWith("/") ? 
                <img src={preview.url} alt={preview.name} className="max-h-[380px] max-w-full rounded-xl object-contain shadow-sm" /> 
                :   <div className="w-full max-w-[400px] rounded-xl border border-[#DCEAF0] bg-white p-8 text-center">
                        <FileText size={42} className="mx-auto text-[#00B0F0]" />
                        <p className="mt-4 text-sm font-bold">Document preview</p>
                        <p className="mt-2 text-xs leading-5 text-[#7891A0]">This mock PDF is ready to download. In production, the submitted file will render here.</p>
                    </div>
                }
            </div>
            <div className="flex justify-end border-t border-[#EAF1F4] px-5 py-4">
                <button onClick={() => downloadFile(preview)} className="inline-flex items-center gap-2 rounded-xl bg-[#00B0F0] px-4 py-2.5 text-xs font-bold text-white">
                    <Download size={15} />Download file
                </button>
            </div>
          </div>
        </div>
      }
    </>
  );
}