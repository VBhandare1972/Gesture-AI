"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function Navbar() {
  const pathname = usePathname();
  const { voiceState, settings, currentTime, toggleCommandMic, setSettings } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Close drawer if clicked outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        drawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target as Node)
      ) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [drawerOpen]);

  const navLinks = [
    {
      path: "/",
      label: "Dashboard",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      path: "/draw",
      label: "Air Drawing",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      ),
    },
    {
      path: "/music",
      label: "Music",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      ),
    },
    {
      path: "/weather",
      label: "Weather",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        </svg>
      ),
    },
    {
      path: "/games",
      label: "Games",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="6" y1="12" x2="10" y2="12" />
          <line x1="8" y1="10" x2="8" y2="14" />
          <line x1="15" y1="13" x2="15.01" y2="13" />
          <line x1="18" y1="11" x2="18.01" y2="11" />
          <rect x="2" y="6" width="20" height="12" rx="2" />
        </svg>
      ),
    },
    {
      path: "/notes",
      label: "Notes",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      path: "/calc",
      label: "Calculator",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="8" y1="10" x2="10" y2="10" />
          <line x1="14" y1="10" x2="16" y2="10" />
          <line x1="8" y1="14" x2="10" y2="14" />
          <line x1="14" y1="14" x2="16" y2="14" />
          <line x1="8" y1="18" x2="16" y2="18" />
        </svg>
      ),
    },
    {
      path: "/settings",
      label: "Settings",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <header className="navbar">
        <div className="nav-left">
          <div className="brand-logo">
            <div className="brand-core-container">
              <svg viewBox="0 0 100 100" className="brand-jarvis-svg">
                {/* Outer rotating ring with dashes */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--cream)" strokeWidth="2" strokeDasharray="12 28" className="j-ring-1" />
                {/* Middle counter-rotating segmented ring */}
                <circle cx="50" cy="50" r="36" fill="none" stroke="var(--peach)" strokeWidth="2.5" strokeDasharray="24 12 6 12" className="j-ring-2" />
                {/* Inner dashed ring */}
                <circle cx="50" cy="50" r="26" fill="none" stroke="var(--rose)" strokeWidth="1.5" strokeDasharray="4 6" className="j-ring-3" />
                {/* Stylized Iron Man Mask Faceplate */}
                <path d="M38,34 L62,34 L65,43 L60,61 L50,68 L40,61 L35,43 Z" fill="none" stroke="var(--rose)" strokeWidth="2" strokeLinejoin="round" />
                <path d="M35,43 L42,47 L44,57 L50,60 L56,57 L58,47 L65,43" fill="none" stroke="var(--peach)" strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M38,40 L45,43 L55,43 L62,40" fill="none" stroke="var(--rose)" strokeWidth="1.2" />
                <line x1="41" y1="46" x2="46" y2="47" stroke="var(--cream)" strokeWidth="2.2" strokeLinecap="round" className="j-eyes" />
                <line x1="54" y1="47" x2="59" y2="46" stroke="var(--cream)" strokeWidth="2.2" strokeLinecap="round" className="j-eyes" />
                <line x1="45" y1="58" x2="55" y2="58" stroke="var(--peach)" strokeWidth="1.2" />
                {/* Crosshairs */}
                <line x1="50" y1="12" x2="50" y2="22" stroke="var(--cream)" strokeWidth="1.2" />
                <line x1="50" y1="78" x2="50" y2="88" stroke="var(--cream)" strokeWidth="1.2" />
                <line x1="12" y1="50" x2="22" y2="50" stroke="var(--cream)" strokeWidth="1.2" />
                <line x1="78" y1="50" x2="88" y2="50" stroke="var(--cream)" strokeWidth="1.2" />
              </svg>
            </div>
            <span className="logo-text" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '2px', color: 'var(--text-hi)' }}>
                GESTURE<b style={{ color: 'var(--cream)' }}>.AI</b>
              </span>
              <small style={{ fontFamily: 'var(--fM)', fontSize: '8px', letterSpacing: '1.5px', color: 'var(--text-dim)', fontWeight: 400 }}>
                AI INtelligent System 
              </small>
            </span>
          </div>
        </div>

        <nav className="nav-links" id="navLinks">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link key={link.path} href={link.path} className={`nav-link ${isActive ? "active" : ""}`}>
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="nav-right">
          <button 
            className={`status-pill ${voiceState.listening ? "on" : ""}`} 
            id="micStatusPill"
            onClick={toggleCommandMic}
            title={voiceState.listening ? "Mute Microphone" : "Unmute Microphone"}
            style={{ cursor: "pointer", border: "none", background: "none", fontFamily: "inherit" }}
            suppressHydrationWarning
          >
            <span className="dot"></span>
            <span>{voiceState.listening ? "MIC ON" : "MIC OFF"}</span>
          </button>
          <button 
            className={`status-pill ${settings.gesture ? "on" : ""}`} 
            id="camStatusPill"
            onClick={() => setSettings(prev => ({ ...prev, gesture: !prev.gesture }))}
            title={settings.gesture ? "Disable Gesture Camera" : "Enable Gesture Camera"}
            style={{ cursor: "pointer", border: "none", background: "none", fontFamily: "inherit" }}
            suppressHydrationWarning
          >
            <span className="dot"></span>
            <span>{settings.gesture ? "CAM ON" : "CAM OFF"}</span>
          </button>
          <div className="clock mono" id="clock">
            {currentTime || "00:00:00"}
          </div>
          <button
            className="hamburger"
            id="hamburgerBtn"
            aria-label="Open menu"
            ref={hamburgerRef}
            onClick={() => setDrawerOpen(!drawerOpen)}
            suppressHydrationWarning
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div className={`mobile-drawer ${drawerOpen ? "open" : ""}`} id="mobileDrawer" ref={drawerRef}>
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              href={link.path}
              className={`nav-link ${isActive ? "active" : ""}`}
              onClick={() => setDrawerOpen(false)}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </>
  );
}
