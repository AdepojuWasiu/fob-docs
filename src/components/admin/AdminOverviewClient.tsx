"use client";

import { useEffect, useState } from "react";
import { OverviewPage } from "@/components/admin/AdminPages";
import type { AdminRecord } from "@/lib/admin-data";

type OverviewData = {
  employees: number;
  guarantors: number;
  submitted: number;
  failed: number;
  activity: { label: string; count: number }[];
  recent: { id: string; type: string; name: string; submittedAt: string; status: AdminRecord["status"] }[];
};

export default function AdminOverviewClient() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/overview", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load dashboard overview");
        return response.json() as Promise<OverviewData>;
      })
      .then(setData)
      .catch((fetchError) => {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load dashboard overview");
      });
    return () => controller.abort();
  }, []);

  if (error) return <div className="rounded-2xl border border-[#F2D6D1] bg-white p-8 text-center text-sm text-[#C45B4E]">{error}</div>;
  if (!data) return <div className="space-y-6" aria-busy="true"><div className="h-32 animate-pulse rounded-2xl bg-white" /><div className="h-72 animate-pulse rounded-2xl bg-white" /></div>;
  return <OverviewPage data={data} />;
}
