"use client";

import * as React from "react";
import { useToast } from "@/components/ui/use-toast";
import { Toast, ToastViewport } from "@/components/ui/toast"; // Import ToastViewport

const Toaster = () => {
  const { toasts } = useToast();

  return (
    <>
      <ToastViewport />
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          open={toast.open}
          onOpenChange={(open) => {
            if (!open) {
              toast.onOpenChange?.(false); // Trigger dismiss logic
            }
          }}
          {...toast}
        />
      ))}
    </>
  );
};

export { Toaster };