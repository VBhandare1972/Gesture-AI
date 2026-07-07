"use client";

import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="hud-footer">
      <div className="footer-content mono">
        <span>© {currentYear} GESTURE.AI</span>
        <span className="footer-status-pill">SYSTEM ONLINE</span>
        <span>VERSION 4.6</span>
      </div>
    </footer>
  );
}
