"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BootScreen from "./BootScreen";
import Onboarding from "./Onboarding";
import GestureHUD from "./GestureHUD";
import ToastStack from "./ToastStack";
import FloatingChat from "./FloatingChat";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { voiceState } = useApp();

  return (
    <>
      <div className="grid-overlay"></div>
      <div className="scanline"></div>
      <div className="noise-vignette"></div>

      <BootScreen />
      <Onboarding />
      <Navbar />
      
      <main id="views">
        {children}
      </main>

      <Footer />

      {/* Floating HUD elements */}
      <GestureHUD />
      
      {/* Floating AI assistant panel */}
      <FloatingChat />

      {/* Toast notifications */}
      <ToastStack />

      {/* Mic Caption */}
      <div className={`mic-caption ${voiceState.captionVisible && voiceState.interimTranscript ? 'show' : ''}`} id="micCaption">
        {voiceState.interimTranscript}
      </div>
    </>
  );
}
