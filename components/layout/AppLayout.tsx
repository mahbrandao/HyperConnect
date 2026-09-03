"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ElementType, ReactNode } from "react";
import Logo from "@/components/ui/Logo";
import { useUser } from "@/hooks/useUser";
import type { Team } from "@/interfaces/user";
import { LayoutDashboard, FolderKanban, CalendarDays, FileText, Bell, ChevronDown, Users, LogOut } from "lucide-react";

type NavItem = { href: string; label: string; icon: ElementType; exact?: boolean };

const navByTeam: Record<Team, NavItem[]> = {
  gerente: [
    { href: "/app", label: "Visão Geral", icon: LayoutDashboard, exact: true },
    { href: "/app/projects", label: "Projetos", icon: FolderKanban },
    { href: "/app/agenda", label: "Agenda", icon: CalendarDays },
    { href: "/app/documents", label: "Documentos", icon: FileText },
    { href: "/app/employees", label: "Funcionários", icon: Users },
  ],
  admin: [
    { href: "/app", label: "Visão Geral", icon: LayoutDashboard, exact: true },
    { href: "/app/documents", label: "Documentos", icon: FileText },
    { href: "/app/projects", label: "Projetos", icon: FolderKanban },
    { href: "/app/agenda", label: "Agenda", icon: CalendarDays },
  ],
  vendas: [
    { href: "/app", label: "Visão Geral", icon: LayoutDashboard, exact: true },
    { href: "/app/projects", label: "Projetos", icon: FolderKanban },
    { href: "/app/agenda", label: "Agenda", icon: CalendarDays },
  ],
  instalacao: [
    { href: "/app", label: "Visão Geral", icon: LayoutDashboard, exact: true },
    { href: "/app/projects", label: "Projetos", icon: FolderKanban },
    { href: "/app/agenda", label: "Agenda", icon: CalendarDays },
  ],
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const navItems = navByTeam[user.team];

  return <div className="flex h-screen w-full overflow-hidden bg-[#0c0c0c]">
    <aside className="w-52 flex-shrink-0 bg-[#111] border-r border-[#222] flex flex-col">
      <div className="p-5 border-b border-[#222]"><Logo size="sm" /></div>
      <div className="px-4 py-2.5 border-b border-[#1a1a1a]"><span className="text-[10px] font-semibold text-[#f5c518] uppercase tracking-widest">{user.teamLabel}</span></div>
      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
          return <Link key={href} href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-[#f5c518] text-black" : "text-[#888] hover:text-white hover:bg-[#1a1a1a]"}`}><Icon size={16} />{label}</Link>;
        })}
      </nav>
      <div className="p-3 border-t border-[#222]"><button onClick={() => router.push("/")} className="w-full flex items-center gap-2 px-3 py-2 text-[#555] hover:text-white text-sm transition-colors rounded-lg hover:bg-[#1a1a1a]"><LogOut size={15} />Sair</button></div>
    </aside>
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="h-14 border-b border-[#222] flex items-center justify-end px-6 gap-4 bg-[#0c0c0c]">
        <button className="relative text-[#888] hover:text-white transition-colors"><Bell size={18} /><span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#f5c518] rounded-full" /></button>
        <button onClick={() => router.push("/")} className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222] transition-colors">
          <div className="w-6 h-6 rounded-full bg-[#f5c518] flex items-center justify-center text-black text-xs font-bold">{user.avatar}</div>
          <div className="text-left"><div className="text-xs font-semibold text-white leading-none">{user.name}</div><div className="text-[10px] text-[#888] leading-none mt-0.5">{user.teamLabel}</div></div><ChevronDown size={14} className="text-[#888]" />
        </button>
      </header>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  </div>;
}
