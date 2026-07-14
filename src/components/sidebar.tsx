"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLayout } from "@/components/layout-provider";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  QrCode,
  Receipt,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Members", href: "/members", icon: Users },
  { title: "Plans", href: "/plans", icon: CreditCard },
  { title: "Check-In", href: "/checkins", icon: QrCode },
  { title: "Payments", href: "/payments", icon: Receipt },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, mobileOpen, isMobile, toggleSidebar, closeMobile } = useLayout();
  const collapsed = isMobile ? false : sidebarCollapsed;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-border/50 bg-card/90 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] luxury-shadow flex flex-col",
          isMobile
            ? cn("w-[280px]", mobileOpen ? "translate-x-0" : "-translate-x-full")
            : collapsed
              ? "w-[76px]"
              : "w-[270px]"
        )}
      >
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-60" />

        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border/50 px-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex-shrink-0 shadow-lg shadow-amber-500/30 transition-transform duration-300 hover:scale-110 hover:shadow-xl hover:shadow-amber-500/40">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0 overflow-hidden">
            <span className="text-lg font-bold gradient-text-gold tracking-tight">FitElite</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium">
              Gym Management
            </span>
          </div>
          {isMobile && (
            <button
              onClick={closeMobile}
              className="ml-auto p-2 rounded-xl hover:bg-muted/80 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 p-3">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={isMobile ? closeMobile : undefined}
                title={collapsed ? item.title : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 group relative",
                  collapsed && !isMobile && "justify-center px-0",
                  isActive
                    ? "bg-gradient-to-r from-amber-500/15 to-amber-600/10 text-amber-700 dark:text-amber-400 shadow-sm border border-amber-500/20"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:shadow-sm"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-amber-500 to-amber-600 rounded-r-full" />
                )}
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-all duration-300",
                  isActive ? "text-amber-600 dark:text-amber-400 scale-110" : "group-hover:scale-110"
                )} />
                {!collapsed && <span className="transition-all duration-300">{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle - desktop only */}
        {!isMobile && (
          <div className="border-t border-border/50 p-3">
            <button
              onClick={toggleSidebar}
              className="flex w-full items-center justify-center rounded-xl py-2.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all duration-300 hover:shadow-sm group"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
              ) : (
                <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}