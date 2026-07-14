"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

interface LayoutContextType {
  sidebarCollapsed: boolean;
  mobileOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  openMobile: () => void;
  closeMobile: () => void;
}

const LayoutContext = createContext<LayoutContextType>({
  sidebarCollapsed: false,
  mobileOpen: false,
  isMobile: false,
  toggleSidebar: () => {},
  openMobile: () => {},
  closeMobile: () => {},
});

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileOpen((p) => !p);
    } else {
      setSidebarCollapsed((p) => !p);
    }
  }, [isMobile]);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <LayoutContext.Provider
      value={{ sidebarCollapsed, mobileOpen, isMobile, toggleSidebar, openMobile, closeMobile }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}
