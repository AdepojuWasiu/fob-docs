"use client";

import { useEffect, useState } from "react";
import AdminDetailPage from "@/components/admin/AdminDetailPage";
import type { AdminRecord, RecordKind } from "@/lib/admin-data";

export default function AdminDetailClient({ kind, id }: { kind: RecordKind; id: string }) {
  const [record, setRecord] = useState<AdminRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ kind });
    fetch(`/api/admin/records/${encodeURIComponent(id)}?${params}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(response.status === 404 ? "Record not found" : "Unable to load record");
        return response.json() as Promise<{ record: AdminRecord }>;
      })
      .then((result) => setRecord(result.record))
      .catch((fetchError) => {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load record");
      });
    return () => controller.abort();
  }, [id, kind]);

  if (error) return <div className="rounded-2xl border border-[#F2D6D1] bg-white p-8 text-center text-sm text-[#C45B4E]">{error}</div>;
  if (!record) return <div className="space-y-6" aria-busy="true"><div className="h-24 animate-pulse rounded-2xl bg-white" /><div className="h-[520px] animate-pulse rounded-2xl bg-white" /></div>;
  return <AdminDetailPage kind={kind} record={record} />;
}
