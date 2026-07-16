"use client";

import React, { useRef, useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

export default function GestureHUD() {
  const {
    settings,
    gestureHUDMinimized,
    setGestureHUDMinimized,
    gestureLabel,
    gestureCursor,
    ripples,
    gestureConfidencePct,
    recentGestures,
    enableGestureCamera,
    disableGestureCamera,
    stopCameraOnly
  } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  // Position offset state for dragging
  const [position, setPosition] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartOffset = useRef({ x: 0, y: 0 });

  // Sync gesture camera state
  useEffect(() => {
    if (settings.gesture && videoRef.current && canvasRef.current) {
      enableGestureCamera(videoRef.current, canvasRef.current);
    } else {
      stopCameraOnly();
    }
    return () => {
      stopCameraOnly();
    };
  }, [settings.gesture]);

  // Dragging handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("#gestureHudMin")) return; // minimize button
    setIsDragging(true);
    if (hudRef.current) {
      const hudRect = hudRef.current.getBoundingClientRect();
      dragStartOffset.current = {
        x: e.clientX - hudRect.left,
        y: e.clientY - hudRect.top
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStartOffset.current.x,
        y: e.clientY - dragStartOffset.current.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const hudStyle: React.CSSProperties = {};
  if (position.x !== null && position.y !== null) {
    hudStyle.left = `${position.x}px`;
    hudStyle.top = `${position.y}px`;
    hudStyle.right = "auto";
    hudStyle.bottom = "auto";
  }

  const confColor = gestureConfidencePct >= 100 ? "#4ade80" : gestureConfidencePct >= 50 ? "#fed0bb" : "#b23a48";

  // Render overlay elements
  return (
    <>
      {/* GESTURE HUD WINDOW */}
      <div
        ref={hudRef}
        className={`gesture-hud ${!settings.gesture ? "hidden-hud" : ""} ${gestureHUDMinimized ? "minimized" : ""}`}
        id="gestureHud"
        style={hudStyle}
      >
        <div className="gesture-hud-header" id="gestureHudHeader" onMouseDown={handleMouseDown} style={{ cursor: "grab" }}>
          <span>● GESTURE TRACKING</span>
          <button
            id="gestureHudMin"
            title="Minimize"
            onClick={() => setGestureHUDMinimized(!gestureHUDMinimized)}
          >
            {gestureHUDMinimized ? "+" : "—"}
          </button>
        </div>
        <div className="gesture-video-wrap">
          <video ref={videoRef} id="inputVideo" playsInline muted></video>
          <canvas ref={canvasRef} id="gestureCanvas"></canvas>
        </div>
        <div className="gesture-label mono" id="gestureLabel" style={{ position: "static", borderRadius: 0 }}>
          {gestureLabel}
        </div>

        {/* Confidence Bar */}
        <div style={{ padding: "6px 10px 4px", background: "#f8f9fa", borderBottom: "1px solid #ffccd5" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
            <span style={{ fontSize: "9px", color: "#590d22", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}>Confidence</span>
            <span style={{ fontSize: "9px", color: gestureConfidencePct >= 100 ? "#2b9348" : gestureConfidencePct >= 50 ? "#c9184a" : "#800f2f", fontWeight: 700 }}>{gestureConfidencePct}%</span>
          </div>
          <div style={{ height: "4px", background: "#ffe5ec", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${gestureConfidencePct}%`, background: gestureConfidencePct >= 100 ? "#2b9348" : gestureConfidencePct >= 50 ? "#ff4d6d" : "#ff7096", borderRadius: "2px", transition: "width 0.1s ease" }} />
          </div>
        </div>

        {/* Recent Gesture History Strip */}
        {recentGestures.length > 0 && (
          <div style={{ padding: "6px 8px", display: "flex", gap: "4px", flexWrap: "wrap", background: "#ffffff", borderBottom: "1px solid #ffccd5" }}>
            {recentGestures.map((g, i) => (
              <span key={i} style={{
                fontSize: "8px", padding: "2px 6px", borderRadius: "8px",
                background: "#ffe5ec", border: "1px solid #ffb6c1",
                color: "#c9184a", opacity: 1 - i * 0.25,
                fontWeight: "bold",
                whiteSpace: "nowrap", maxWidth: "90px",
                overflow: "hidden", textOverflow: "ellipsis"
              }}>
                {g}
              </span>
            ))}
          </div>
        )}

        <div className="gesture-foot">Pinch · Swipe · Palm · Fist · Peace</div>
      </div>

      {/* FLOATING CUSTOM CURSOR */}
      <div
        className={`gesture-cursor ${gestureCursor.show ? "show" : ""} ${gestureCursor.pinched ? "pinched" : ""}`}
        id="gestureCursor"
        style={{
          left: `${gestureCursor.x}px`,
          top: `${gestureCursor.y}px`
        }}
      ></div>

      {/* CLICK RIPPLES */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="click-ripple"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`
          }}
        ></div>
      ))}
    </>
  );
}
