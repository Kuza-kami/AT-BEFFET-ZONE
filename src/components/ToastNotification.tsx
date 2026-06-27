import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, Info, AlertTriangle, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
}

export function ToastNotification() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; type?: "success" | "info" | "warning" }>;
      if (customEvent.detail && customEvent.detail.message) {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: ToastMessage = {
          id,
          message: customEvent.detail.message,
          type: customEvent.detail.type || "success"
        };
        
        setToasts((prev) => [...prev, newToast]);

        // Auto-remove after 4 seconds
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
      }
    };

    window.addEventListener("show-toast", handleToastEvent);
    return () => {
      window.removeEventListener("show-toast", handleToastEvent);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((t) => {
          let Icon = Info;
          let accentColor = "border-l-[#0f4cc2]";
          let iconColor = "text-[#0f4cc2]";
          
          if (t.type === "success") {
            Icon = CheckCircle;
            accentColor = "border-l-[#e62419]"; // red accent matching our primary color
            iconColor = "text-[#e62419]";
          } else if (t.type === "warning") {
            Icon = AlertTriangle;
            accentColor = "border-l-[#ffbd12]"; // yellow accent matching secondary brand
            iconColor = "text-[#ffbd12]";
          }

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-start gap-3 bg-white border-2 border-[#111111] p-4 ${accentColor} border-l-[6px] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] relative`}
            >
              <div className="shrink-0 mt-0.5">
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div className="flex-grow pr-4">
                <p className="text-xs font-sans font-bold text-gray-900 leading-snug">
                  {t.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Helper to trigger a toast programmatically
export function triggerToast(message: string, type: "success" | "info" | "warning" = "success") {
  window.dispatchEvent(
    new CustomEvent("show-toast", {
      detail: { message, type }
    })
  );
}
