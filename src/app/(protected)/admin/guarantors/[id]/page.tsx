import AdminDetailClient from "@/components/admin/AdminDetailClient";

export default async function GuarantorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminDetailClient kind="guarantors" id={id} />;
}
