import { RecordsPage } from "@/components/admin/AdminPages";
import { getAdminRecords } from "@/lib/admin-data-server";

export default async function GuarantorsPage() {
  return <RecordsPage kind="guarantors" records={await getAdminRecords("guarantors")} />;
}
