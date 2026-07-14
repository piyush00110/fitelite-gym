"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/components/layout-provider";

export function Navbar() {
  const { isMobile, openMobile } = useLayout();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/50 bg-card/70 backdrop-blur-xl px-4 md:px-6">
      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      {isMobile && (
        <Button variant="ghost" size="icon" onClick={openMobile} className="hover:scale-110 active:scale-95 transition-transform">
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <div className="flex flex-1 items-center gap-4">
        <div className="relative max-w-md flex-1 group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-amber-500" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-muted/50 border-border/50 backdrop-blur-sm focus:bg-card focus:border-amber-500/50 focus:shadow-md focus:shadow-amber-500/10 transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <Button variant="ghost" size="icon" className="relative hover:scale-110 active:scale-95 transition-transform group">
          <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gradient-to-r from-red-500 to-rose-500 animate-glow" />
        </Button>

        <div className="flex items-center gap-2 md:gap-3 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm px-2 md:px-3 py-1.5 hover:shadow-md hover:border-amber-500/30 transition-all duration-300 cursor-pointer group">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white text-sm font-bold shadow-md shadow-amber-500/30 transition-transform group-hover:scale-110">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold">Admin</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}