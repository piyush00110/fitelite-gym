"use client";

import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { LayoutProvider, useLayout } from "@/components/layout-provider";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, isMobile } = useLayout();
  const marginLeft = isMobile ? 0 : sidebarCollapsed ? 72 : 260;

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft }}
      >
        <Navbar />
        <main className="flex-1 p-4 md:p-6 bg-background">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </LayoutProvider>
  );
}
