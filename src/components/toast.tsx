"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-xl animate-slide-in-right",
              t.type === "success" && "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400",
              t.type === "error" && "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400",
              t.type === "info" && "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
            )}
          >
            {t.type === "success" && <CheckCircle className="h-5 w-5 flex-shrink-0" />}
            {t.type === "error" && <XCircle className="h-5 w-5 flex-shrink-0" />}
            {t.type === "info" && <Info className="h-5 w-5 flex-shrink-0" />}
            <span className="text-sm font-medium flex-1">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
