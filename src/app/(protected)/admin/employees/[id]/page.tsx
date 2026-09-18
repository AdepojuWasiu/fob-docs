import { notFound } from "next/navigation";
import AdminDetailPage from "@/components/admin/AdminDetailPage";
import { employees, getRecord } from "@/lib/admin-data";

export function generateStaticParams() {
  return employees.map((employee) => ({ id: employee.id }));
}

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = getRecord("employees", id);
  if (!record) notFound();
  return <AdminDetailPage kind="employees" record={record} />;
}
