import { notFound } from "next/navigation";
import AdminDetailPage from "@/components/admin/AdminDetailPage";
import { guarantors, getRecord } from "@/lib/admin-data";

export function generateStaticParams() {
  return guarantors.map((guarantor) => ({ id: guarantor.id }));
}

export default async function GuarantorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = getRecord("guarantors", id);
  if (!record) notFound();
  return <AdminDetailPage kind="guarantors" record={record} />;
}
