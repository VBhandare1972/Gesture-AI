"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export default function BootScreen() {
  const { booting } = useApp();

  const bootStyles = `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes dataStream {
      0% { transform: translateY(-200%); opacity: 0; }
      50% { opacity: 0.2; }
      100% { transform: translateY(200%); opacity: 0; }
    }
    .boot-animated-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(-45deg, var(--wine), var(--base), var(--rust), var(--wine));
      background-size: 400% 400%;
      animation: gradientShift 5s ease infinite;
      z-index: -1;
    }
    .boot-scanline {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 50%, rgba(254, 208, 187, 0.05) 51%, transparent 51%);
      background-size: 100% 4px;
      z-index: 0;
      pointer-events: none;
    }
    .boot-data-stream {
      position: absolute;
      width: 1px;
      height: 150px;
      background: linear-gradient(to bottom, transparent, var(--peach), transparent);
      animation: dataStream 2s linear infinite;
      z-index: 0;
    }
    .boot-content-wrapper {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .boot-text-light {
      font-family: var(--fM);
      font-size: 12px;
      letter-spacing: 3px;
      color: var(--text-hi);
      text-transform: uppercase;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .boot-bar-light {
      width: 220px;
      height: 4px;
      background: var(--panel-line);
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .boot-bar-light span {
      display: block;
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, var(--red-mid), var(--red));
      animation: bootFill 1.6s var(--ease) forwards;
    }
  `;

  return (
    <div id="bootScreen" className={booting ? "" : "hidden"} style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <style>{bootStyles}</style>
      <div className="boot-animated-bg"></div>
      <div className="boot-scanline"></div>
      
      {/* Falling data streams */}
      <div className="boot-data-stream" style={{ left: '15%', animationDelay: '0.2s', animationDuration: '1.5s' }}></div>
      <div className="boot-data-stream" style={{ left: '35%', animationDelay: '1.1s', animationDuration: '2.5s' }}></div>
      <div className="boot-data-stream" style={{ left: '65%', animationDelay: '0.5s', animationDuration: '1.8s' }}></div>
      <div className="boot-data-stream" style={{ left: '85%', animationDelay: '0.8s', animationDuration: '2.2s' }}></div>

      <div className="boot-content-wrapper">
        <div className="boot-ring">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeDasharray="8 10" opacity=".9"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="var(--red-mid)" strokeWidth="1.5" strokeDasharray="4 6" opacity=".8"/>
          </svg>
          <div className="core" style={{ color: "var(--text-hi)", textShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>JARVIS</div>
        </div>
        <div className="boot-text-light">Initializing Gesture.AI</div>
        <div className="boot-bar-light"><span></span></div>
      </div>
    </div>
  );
}
