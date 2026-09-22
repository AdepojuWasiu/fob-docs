import AdminShell from "@/components/admin/AdminShell";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // if (!(await isAdminAuthenticated())) redirect("/admin/sign-in");
  return <AdminShell>{children}</AdminShell>;
}
