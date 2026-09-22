import { RecordsPage } from "@/components/admin/AdminPages";
import { getAdminRecords } from "@/lib/admin-data-server";

export default async function EmployeesPage() {
  return <RecordsPage kind="employees" records={await getAdminRecords("employees")} />;
}
