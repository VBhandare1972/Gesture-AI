"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export default function ToastStack() {
  const { toasts } = useApp();

  return (
    <div className="hud-toast-stack" id="toastStack">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`hud-toast ${toast.fade ? "fade" : ""}`}
        >
          {toast.msg}
        </div>
      ))}
    </div>
  );
}
