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
        <div className="gesture-foot">Point to aim · Pinch to select</div>
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
