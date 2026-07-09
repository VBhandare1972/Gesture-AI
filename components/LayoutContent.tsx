"use client";

import React from "react";
import { useApp, HINDI_TRACKS, ENGLISH_TRACKS, TRACKS } from "@/context/AppContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BootScreen from "./BootScreen";
import Onboarding from "./Onboarding";
import GestureHUD from "./GestureHUD";
import ToastStack from "./ToastStack";
import FloatingChat from "./FloatingChat";

import { usePathname } from "next/navigation";
import Link from "next/link";

// Off-screen style: proper 640x360 so browsers never throttle the iframe
const OFFSCREEN_STYLE: React.CSSProperties = {
  position: "fixed",
  top: "-500px",
  left: "0",
  width: "640px",
  height: "360px",
  opacity: 0,
  pointerEvents: "none",
  zIndex: -1,
  borderRadius: "0",
  overflow: "hidden",
};

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { voiceState, musicState, playMusic, pauseMusic, prevTrack, nextTrack } = useApp();
  const pathname = usePathname();

  const isMusicPage = pathname === "/music";
  const hasActiveMusic = musicState.playing || musicState.trackTime !== "00:00";

  // Active playing track metadata (uses playingMode, not browsing mode)
  const activeTracks =
    musicState.playingMode === "hindi"
      ? HINDI_TRACKS
      : musicState.playingMode === "english"
      ? ENGLISH_TRACKS
      : TRACKS;

  const activeIdx =
    musicState.playingMode === "hindi"
      ? musicState.playingHindiIndex
      : musicState.playingMode === "english"
      ? musicState.playingEnglishIndex
      : musicState.playingTrackIndex;

  const activeTrack = activeTracks[activeIdx];
  const activeTrackName = activeTrack?.name || "No Track";
  const activeTrackSub =
    musicState.playingMode === "hindi" || musicState.playingMode === "english"
      ? `${(activeTrack as any)?.artist || ""}`
      : (activeTrack as any)?.sub || "";

  // Progress bar percentage
  const getProgressPercent = () => {
    if (!musicState.trackTime) return 0;
    const parts = musicState.trackTime.split("/");
    if (parts.length < 2) return 0;
    const parseSecs = (s: string) => {
      const bits = s.trim().split(":");
      return bits.length < 2 ? 0 : parseInt(bits[0], 10) * 60 + parseInt(bits[1], 10);
    };
    const cur = parseSecs(parts[0]);
    const dur = parseSecs(parts[1]);
    return dur ? (cur / dur) * 100 : 0;
  };
  const progressPercent = getProgressPercent();

  // ─── YouTube anchor positioning ──────────────────────────────────────────────
  // The anchor div (#ytPlayerGlobalAnchor) is ALWAYS in the React tree — never
  // moved via DOM manipulation. We just update its CSS position via state.
  // On /music  →  overlay exactly on the placeholder using ResizeObserver.
  // Elsewhere  →  park off-screen at -500px (proper size, never throttled).
  const [anchorStyle, setAnchorStyle] = React.useState<React.CSSProperties>(OFFSCREEN_STYLE);

  React.useEffect(() => {
    if (!isMusicPage) {
      setAnchorStyle(OFFSCREEN_STYLE);
      return;
    }

    const updatePosition = () => {
      const placeholder = document.getElementById("ytFrameWrapPlaceholder");
      if (!placeholder) return;
      const rect = placeholder.getBoundingClientRect();
      setAnchorStyle({
        position: "fixed",
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        opacity: 1,
        pointerEvents: "auto",
        zIndex: 99,
        borderRadius: "8px",
        overflow: "hidden",
      });
    };

    updatePosition();
    const timer = setTimeout(updatePosition, 200);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, { passive: true });

    let obs: ResizeObserver | null = null;
    const ph = document.getElementById("ytFrameWrapPlaceholder");
    if (ph && typeof ResizeObserver !== "undefined") {
      obs = new ResizeObserver(updatePosition);
      obs.observe(ph);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
      obs?.disconnect();
    };
  }, [isMusicPage, pathname]);

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

      {/* Persistent PiP Music Widget — visible on all pages except /music */}
      {!isMusicPage && hasActiveMusic && activeTrack && (
        <div className="persistent-music-pip">
          <div className="pip-header">
            <div className={`pip-mini-viz ${musicState.playing ? "active" : ""}`}>
              <div className="pip-viz-bar"></div>
              <div className="pip-viz-bar"></div>
              <div className="pip-viz-bar"></div>
            </div>
            <div className="pip-left">
              <Link href="/music" className="pip-track">{activeTrackName}</Link>
              <div className="pip-sub">{activeTrackSub}</div>
            </div>
            <button
              className="pip-close-btn"
              onClick={() => {
                const w = window as any;
                w._ytPlayerPromiseReset?.();
                if (w.stopAudio) w.stopAudio(); else pauseMusic();
              }}
              title="Stop Playback"
              suppressHydrationWarning
            >×</button>
          </div>

          <div className="pip-progress-container">
            <div className="pip-progress-bar">
              <div className="pip-progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="pip-time-label">{musicState.trackTime}</div>
          </div>

          <div className="pip-action-row">
            <div className="pip-controls" style={{ margin: "0 auto" }}>
              <button className="pip-btn" onClick={prevTrack} title="Previous" suppressHydrationWarning>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" />
                </svg>
              </button>
              <button
                className="pip-play-btn"
                onClick={musicState.playing ? pauseMusic : playMusic}
                title={musicState.playing ? "Pause" : "Play"}
                suppressHydrationWarning
              >
                {musicState.playing ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="4" x2="18" y2="20"></line>
                    <line x1="6" y1="4" x2="6" y2="20"></line>
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>
              <button className="pip-btn" onClick={nextTrack} title="Next" suppressHydrationWarning>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating HUD + Chat + Toasts */}
      <GestureHUD />
      <FloatingChat />
      <ToastStack />

      {/* Mic Caption */}
      <div
        className={`mic-caption ${voiceState.captionVisible && voiceState.interimTranscript ? "show" : ""}`}
        id="micCaption"
      >
        {voiceState.interimTranscript}
      </div>

      {/*
        Global YouTube Player anchor — NEVER moved via DOM manipulation.
        React always knows where it is. We just reposition it via CSS state:
          - On /music  → overlay on the placeholder slot (ResizeObserver tracked)
          - Elsewhere  → parked off-screen at -500px (640×360, not throttled)
      */}
      <div id="ytPlayerGlobalAnchor" style={anchorStyle}>
        <div id="globalYtPlayerContainer" style={{ width: "100%", height: "100%" }}>
          <div id="ytPlayer" style={{ width: "100%", height: "100%" }}></div>
        </div>
      </div>
    </>
  );
}
