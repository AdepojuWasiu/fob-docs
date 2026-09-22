import { notFound } from "next/navigation";
import AdminDetailPage from "@/components/admin/AdminDetailPage";
import { getAdminRecord } from "@/lib/admin-data-server";

export default async function GuarantorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getAdminRecord("guarantors", id);
  if (!record) notFound();
  return <AdminDetailPage kind="guarantors" record={record} />;
}
