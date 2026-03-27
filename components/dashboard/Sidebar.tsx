"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Film, 
  Plus, 
  Folder, 
  PlaySquare, 
  BookOpen, 
  CreditCard, 
  Settings, 
  Zap, 
  UserCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";

const routes = [
  {
    label: "Series",
    icon: Folder,
    href: "/dashboard/series",
  },
  {
    label: "Videos",
    icon: PlaySquare,
    href: "/dashboard/videos",
  },
  {
    label: "Guides",
    icon: BookOpen,
    href: "/dashboard/guides",
  },
  {
    label: "Billing",
    icon: CreditCard,
    href: "/dashboard/billing",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-slate-950/50 backdrop-blur-xl border-r border-white/5 shrink-0 w-64 md:w-72">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Film className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">reelio</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Create Button */}
        <div className="px-4 py-6">
          <button className="w-full flex items-center justify-center gap-2 bg-white text-slate-950 px-4 py-3 rounded-xl font-semibold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-slate-200 transition-colors">
            <Plus className="w-5 h-5" />
            Create new series
          </button>
        </div>

        {/* Navigation */}
        <div className="px-3 space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href || pathname?.startsWith(`${route.href}/`);
            return (
              <Link 
                key={route.href} 
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-base font-medium", // Slightly larger text (text-base instead of text-sm)
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <route.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500")} />
                {route.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <Link 
          href="/dashboard/upgrade"
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-base font-medium"
        >
          <Zap className="w-5 h-5 text-amber-500" />
          Upgrade
        </Link>
        <Link 
          href="/dashboard/profile"
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-base font-medium"
        >
          <UserCircle className="w-5 h-5 text-slate-500" />
          Profile Settings
        </Link>
      </div>
    </div>
  );
};
