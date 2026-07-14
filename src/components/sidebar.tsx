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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300 luxury-shadow flex flex-col",
          isMobile
            ? cn("w-[260px]", mobileOpen ? "translate-x-0" : "-translate-x-full")
            : collapsed
              ? "w-[72px]"
              : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground flex-shrink-0">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0 overflow-hidden">
            <span className="text-lg font-bold gradient-text">FitElite</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Gym Management
            </span>
          </div>
          {isMobile && (
            <button onClick={closeMobile} className="ml-auto p-1 rounded-lg hover:bg-muted">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={isMobile ? closeMobile : undefined}
                title={collapsed ? item.title : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  collapsed && !isMobile && "justify-center px-0",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle - desktop only */}
        {!isMobile && (
          <div className="border-t border-border p-3">
            <button
              onClick={toggleSidebar}
              className="flex w-full items-center justify-center rounded-xl py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
