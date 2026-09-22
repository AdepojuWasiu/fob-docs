import { OverviewPage } from "@/components/admin/AdminPages";
import { getAdminOverview } from "@/lib/admin-data-server";

export default async function AdminOverview() {
  return <OverviewPage data={await getAdminOverview()} />;
}
