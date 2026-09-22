"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, FileCheck2, LogOut, Menu, ShieldCheck, Users, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";

const navigation = [
  { label: "Overview", href: "/admin", icon: BarChart3 },
  { label: "Employees", href: "/admin/employees", icon: Users },
  { label: "Guarantors", href: "/admin/guarantors", icon: ShieldCheck },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F2F8FB] text-[#19334A]">
      {
        mobileOpen && 
         <button 
           aria-label="Close navigation" 
           className="fixed inset-0 z-30 bg-[#19334A]/30 lg:hidden" 
           onClick={() => setMobileOpen(false)} 
          />
      }
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-[#E0ECF2] bg-white px-5 py-6 transition-transform lg:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center justify-between px-2">
          <Link href="/admin" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <Image src="/fob-logo.jpeg" alt="FOB" width={38} height={38} className="rounded-xl object-cover" />
            <div><p className="text-[15px] font-bold tracking-tight">FOB Docs</p><p className="text-[11px] text-[#7B92A3]">Admin workspace</p></div>
          </Link>
          <button className="rounded-lg p-2 text-[#7B92A3] hover:bg-[#F2F8FB] lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <div className="mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9AAEBB]">Workspace</div>
        <nav className="mt-3 space-y-1">
          {navigation.map(({ label, href, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors", active ? "bg-[#E9F8FD] text-[#008FC4]" : "text-[#60798B] hover:bg-[#F5FAFC] hover:text-[#19334A]")}><Icon size={18} strokeWidth={active ? 2.3 : 1.8} />{label}</Link>;
          })}
        </nav>
        <div className="mt-auto rounded-2xl bg-[#F2F8FB] p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#00B0F0]"><FileCheck2 size={18} /></div>
          <p className="text-xs font-semibold">Document centre</p>
          <p className="mt-1 text-[11px] leading-5 text-[#7B92A3]">Keep every submission organised and ready for review.</p>
        </div>
        <button className="mt-5 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#60798B] hover:bg-[#FFF4F2] hover:text-[#D65B4C]" onClick={async () => { await fetch("/api/admin/auth/sign-out", { method: "POST" }); router.push("/admin/sign-in"); router.refresh(); }}><LogOut size={18} />Log out</button>
      </aside>
      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#E0ECF2] bg-[#F2F8FB]/90 px-5 backdrop-blur md:px-10">
          <button className="rounded-xl bg-white p-2 text-[#19334A] shadow-sm lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <div className="hidden text-sm text-[#7B92A3] sm:block">FOB Docs <span className="mx-2 text-[#BCD0DA]">/</span> Admin</div>
          <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-xs font-semibold">Admin account</p><p className="text-[11px] text-[#7B92A3]">Operations team</p></div><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#19334A] text-xs font-bold text-white">AD</div></div>
        </header>
        <main className="mx-auto max-w-[1440px] px-5 py-7 md:px-10 md:py-4">{children}</main>
      </div>
    </div>
  );
}
