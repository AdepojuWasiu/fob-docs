import { RecordsPage } from "@/components/admin/AdminPages";
import { guarantors } from "@/lib/admin-data";

export default function GuarantorsPage() {
  return <RecordsPage kind="guarantors" records={guarantors} />;
}
