"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export default function BootScreen() {
  const { booting } = useApp();

  return (
    <div id="bootScreen" className={booting ? "" : "hidden"}>
      <div className="boot-ring">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="var(--red)" strokeWidth="2" strokeDasharray="8 10" opacity=".7"/>
          <circle cx="50" cy="50" r="30" fill="none" stroke="var(--red-mid)" strokeWidth="1.5" strokeDasharray="4 6" opacity=".5"/>
        </svg>
        <div className="core">JARVIS</div>
      </div>
      <div className="boot-text">Initializing Gesture.AI</div>
      <div className="boot-bar"><span></span></div>
    </div>
  );
}
