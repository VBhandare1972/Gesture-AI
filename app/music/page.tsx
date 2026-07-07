"use client";

import React, { useEffect } from "react";
import { useApp, TRACKS, HINDI_TRACKS, ENGLISH_TRACKS } from "@/context/AppContext";

export default function MusicPage() {
  const {
    musicState,
    vizHeights,
    playMusic,
    pauseMusic,
    nextTrack,
    prevTrack,
    setMusicVolume,
    switchMusicMode,
    setMusicState,
  } = useApp();

  const activeTracks =
    musicState.mode === "hindi"
      ? HINDI_TRACKS
      : musicState.mode === "english"
      ? ENGLISH_TRACKS
      : TRACKS;

  const activeIdx =
    musicState.mode === "hindi"
      ? musicState.hindiIndex
      : musicState.mode === "english"
      ? musicState.englishIndex
      : musicState.trackIndex;

  const handleTrackSelect = (idx: number) => {
    if (musicState.mode === "hindi") {
      setMusicState((prev) => ({ ...prev, hindiIndex: idx }));
    } else if (musicState.mode === "english") {
      setMusicState((prev) => ({ ...prev, englishIndex: idx }));
    } else {
      setMusicState((prev) => ({ ...prev, trackIndex: idx }));
    }
    // Force trigger playback if selected
    setTimeout(() => {
      playMusic();
    }, 100);
  };

  const activeTrackName = activeTracks[activeIdx]?.name || "None";
  const activeTrackSub =
    musicState.mode === "hindi" || musicState.mode === "english"
      ? `${(activeTracks[activeIdx] as any)?.artist} · ${(activeTracks[activeIdx] as any)?.movie}`
      : (activeTracks[activeIdx] as any)?.sub;

  return (
    <section className="view active" id="view-music">
      {/* Header */}
      <div className="view-head" style={{ marginBottom: "16px", flexShrink: 0 }}>
        <div>
          <div className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>{" "}
            Module 03
          </div>
          <h1 className="view-title">Music Player</h1>
          <div className="view-sub">English hits or Hindi hits — voice or gesture controlled.</div>
        </div>

        {/* Mode tabs in header right */}
        <div className="music-tabs" style={{ display: "flex", gap: "6px", margin: 0 }}>
          <button
            className={`music-tab ${musicState.mode === "english" ? "active" : ""}`}
            onClick={() => switchMusicMode("english")}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "none",
              background: musicState.mode === "english" ? "var(--red)" : "rgba(255,255,255,0.05)",
              color: musicState.mode === "english" ? "#fff" : "var(--txt-mid)",
              fontWeight: 600,
              fontSize: "11px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            🎵 English Hits
          </button>
          <button
            className={`music-tab ${musicState.mode === "hindi" ? "active" : ""}`}
            onClick={() => switchMusicMode("hindi")}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "none",
              background: musicState.mode === "hindi" ? "var(--red)" : "rgba(255,255,255,0.05)",
              color: musicState.mode === "hindi" ? "#fff" : "var(--txt-mid)",
              fontWeight: 600,
              fontSize: "11px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            🎶 Hindi Hits
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="music-layout" style={{ flex: 1, minHeight: 0 }}>
        
        {/* LEFT PANEL — Track list (Narrower) */}
        <div className="panel music-list-col" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span className="tool-label" style={{ fontSize: "10.5px", letterSpacing: "1.5px", margin: 0 }}>
              TRACK LIST ({activeTracks.length})
            </span>
            <span style={{ fontSize: "10px", color: "var(--cream)" }} className="mono">
              {musicState.playing ? "PLAYING" : "PAUSED"}
            </span>
          </div>

          <div className="track-list" id="trackList" style={{ overflowY: "auto", flex: 1, paddingRight: "4px" }}>
            {activeTracks.map((t, idx) => {
              const sub =
                musicState.mode === "hindi" || musicState.mode === "english"
                  ? `${(t as any).artist}`
                  : (t as any).sub;
              const isActive = idx === activeIdx;
              return (
                <div
                  key={idx}
                  className={`track-row ${isActive ? "active" : ""}`}
                  onClick={() => handleTrackSelect(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background: isActive ? "rgba(132, 42, 59, 0.25)" : "rgba(70, 18, 32, 0.15)",
                    border: isActive ? "1px solid var(--peach)" : "1px solid rgba(254, 208, 187, 0.05)",
                    marginBottom: "6px",
                    transition: "all 0.2s ease"
                  }}
                >
                  <span className="mono" style={{ fontSize: "11px", color: isActive ? "var(--cream)" : "var(--txt-faint)", width: "16px" }}>
                    {isActive && musicState.playing ? "▶" : String(idx + 1).padStart(2, "0")}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12.5px", fontWeight: isActive ? 700 : 500, color: isActive ? "#fff" : "var(--txt-mid)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: "10.5px", color: "var(--txt-faint)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {sub}
                    </div>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL — Video Player (Wider) */}
        <div className={`panel music-player-col brackets ${musicState.playing ? "playing" : ""}`} style={{ height: "100%", overflowY: "auto" }}>
          


          <div style={{ marginBottom: "12px", textAlign: "left" }}>
            <div className="music-track" style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 2px" }}>
              {activeTrackName}
            </div>
            <div className="music-sub" style={{ fontSize: "12px", color: "var(--txt-mid)" }}>
              {activeTrackSub}
            </div>
          </div>

          {/* YouTube Video Frame Container */}
          <div
            className="yt-frame-wrap"
            id="ytFrameWrap"
            style={{
              display: musicState.mode === "hindi" || musicState.mode === "english" ? "block" : "none",
              margin: "0 auto 16px",
              width: "100%",
              flexGrow: 1,
              minHeight: "400px"
            }}
          >
            {/* Using a key to reset the DOM node structure properly and prevent React reconciliation errors */}
            <div key={musicState.mode} id="ytPlayer"></div>
          </div>

        </div>

      </div>
    </section>
  );
}