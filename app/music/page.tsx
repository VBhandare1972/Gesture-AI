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

  // Resume playback if already playing when returning to /music
  useEffect(() => {
    if (musicState.playing) {
      playMusic();
    }
  }, []);

  const browsingTracks =
    musicState.mode === "hindi"
      ? HINDI_TRACKS
      : musicState.mode === "english"
      ? ENGLISH_TRACKS
      : TRACKS;

  const browsingIdx =
    musicState.mode === "hindi"
      ? musicState.hindiIndex
      : musicState.mode === "english"
      ? musicState.englishIndex
      : musicState.trackIndex;

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

  const activeTrack = activeTracks[activeIdx];
  const activeTrackName = activeTrack?.name || "None";
  const activeTrackSub =
    musicState.playingMode === "hindi" || musicState.playingMode === "english"
      ? `${(activeTrack as any)?.artist || ""} · ${(activeTrack as any)?.movie || ""}`
      : (activeTrack as any)?.sub || "";

  return (
    <section className="view active" id="view-music">
      {/* Header */}
      <div className="view-head" style={{ marginBottom: "16px", flexShrink: 0 }}>
        <div>
          
          <h1 className="view-title">Music Player</h1>
          <div className="view-sub">English hits or Hindi hits — voice or gesture controlled.</div>
        </div>

        <div className="music-tabs">
          <button
            className={`music-tab ${musicState.mode === "english" ? "active" : ""}`}
            onClick={() => switchMusicMode("english")}
            suppressHydrationWarning
          >
            🎵 English Hits
          </button>
          <button
            className={`music-tab ${musicState.mode === "hindi" ? "active" : ""}`}
            onClick={() => switchMusicMode("hindi")}
            suppressHydrationWarning
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
              TRACK LIST ({browsingTracks.length})
            </span>
            <span style={{ fontSize: "10px", color: "var(--cream)" }} className="mono">
              {musicState.playing ? "PLAYING" : "PAUSED"}
            </span>
          </div>

          <div className="track-list" id="trackList" style={{ overflowY: "auto", flex: 1, paddingRight: "4px" }}>
            {browsingTracks.map((t, idx) => {
              const sub =
                musicState.mode === "hindi" || musicState.mode === "english"
                  ? `${(t as any).artist}`
                  : (t as any).sub;
              const isSelectedBrowsing = idx === browsingIdx;
              const isCurrentlyPlaying = musicState.playingMode === musicState.mode && idx === activeIdx;
              const isActive = isCurrentlyPlaying || isSelectedBrowsing;
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
        <div className={`panel music-player-col brackets ${musicState.playing ? "playing" : ""}`} style={{ height: "100%", overflowY: "hidden" }}>
          


          <div style={{ marginBottom: "12px", textAlign: "left" }}>
            <div className="music-track" style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 2px" }}>
              {activeTrackName}
            </div>
            <div className="music-sub" style={{ fontSize: "12px", color: "var(--txt-mid)" }}>
              {activeTrackSub}
            </div>
          </div>

          {/* YouTube Video Frame Container Placeholder */}
          <div
            className="yt-frame-wrap"
            id="ytFrameWrapPlaceholder"
            style={{
              display: musicState.mode === "hindi" || musicState.mode === "english" ? "flex" : "none",
              margin: "0 auto 16px",
              width: "100%",
              flexGrow: 1,
              minHeight: "400px",
              position: "relative",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          ></div>

        </div>

      </div>
    </section>
  );
}