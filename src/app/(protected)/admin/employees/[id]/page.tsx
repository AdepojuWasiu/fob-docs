import AdminDetailClient from "@/components/admin/AdminDetailClient";

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminDetailClient kind="employees" id={id} />;
}
