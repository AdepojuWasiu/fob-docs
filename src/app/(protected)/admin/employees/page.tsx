import { RecordsPage } from "@/components/admin/AdminPages";
import { employees } from "@/lib/admin-data";

export default function EmployeesPage() {
  return <RecordsPage kind="employees" records={employees} />;
}
