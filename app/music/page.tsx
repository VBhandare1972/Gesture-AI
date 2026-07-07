"use client";

import React from "react";
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
    if (musicState.playing) {
      setTimeout(() => playMusic(), 100);
    }
  };

  const getStatusLabel = () => {
    if (musicState.playing) return "NOW PLAYING";
    return "PAUSED";
  };

  const activeTrackName = activeTracks[activeIdx]?.name || "None";
  const activeTrackSub =
    musicState.mode === "hindi" || musicState.mode === "english"
      ? `${(activeTracks[activeIdx] as any)?.artist} · ${(activeTracks[activeIdx] as any)?.movie}`
      : (activeTracks[activeIdx] as any)?.sub;

  return (
    <section className="view active" id="view-music">
      <div className="view-head">
        <div>
          <div className="eyebrow">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>{" "}
            Module 03
          </div>
          <h1 className="view-title">Music</h1>
          <div className="view-sub">English hits or Hindi hits — voice or gesture controlled.</div>
        </div>
      </div>

      <div className={`panel music-panel brackets ${musicState.playing ? "playing" : ""}`} style={{ maxWidth: "480px", margin: "0 auto" }}>
        <div className="music-tabs">
          <button
            className={`music-tab ${musicState.mode === "english" ? "active" : ""}`}
            onClick={() => switchMusicMode("english")}
          >
            English Hits
          </button>
          <button
            className={`music-tab ${musicState.mode === "hindi" ? "active" : ""}`}
            onClick={() => switchMusicMode("hindi")}
          >
            Hindi Hits
          </button>
        </div>

        <div className="music-sub" id="musicNowPlaying">
          {getStatusLabel()}
        </div>
        <div className="music-track" id="musicTrackName">
          {activeTrackName}
        </div>
        <div className="music-sub" id="musicTrackSub" style={{ fontSize: "11.5px", color: "var(--text-mid)", marginTop: "4px" }}>
          {activeTrackSub}
        </div>
        <div className="music-sub" id="musicTrackTime">
          {musicState.trackTime}
        </div>

        <div
          className={`yt-frame-wrap ${musicState.playing ? "playing" : ""}`}
          id="ytFrameWrap"
          style={{ display: musicState.mode === "hindi" || musicState.mode === "english" ? "block" : "none" }}
        >
          <div id="ytPlayer"></div>
        </div>
        
        {(musicState.mode === "hindi" || musicState.mode === "english") && (
          <div className="yt-disclaimer mono" id="ytDisclaimer">
            Streaming via YouTube
          </div>
        )}

        <div className="viz-wrap" id="vizWrap">
          {vizHeights.map((h, i) => (
            <div key={i} className="viz-bar" style={{ height: `${h}px` }}></div>
          ))}
        </div>

        <div className="music-controls">
          <button className="btn btn-icon btn-ghost" id="musicPrevBtn" onClick={prevTrack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1="5" y1="19" x2="5" y2="5" />
            </svg>
          </button>
          <button
            className="btn btn-accent play-btn"
            id="musicPlayBtn"
            onClick={musicState.playing ? pauseMusic : playMusic}
          >
            {musicState.playing ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>
          <button className="btn btn-icon btn-ghost" id="musicNextBtn" onClick={nextTrack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" />
            </svg>
          </button>
        </div>

        <div className="vol-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          </svg>
          <input
            type="range"
            id="musicVolume"
            min="0"
            max="100"
            value={musicState.volume}
            onChange={(e) => setMusicVolume(Number(e.target.value))}
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </div>

        <div className="track-list" id="trackList">
          {activeTracks.map((t, idx) => {
            const sub =
              musicState.mode === "hindi" || musicState.mode === "english"
                ? `${(t as any).artist} · ${(t as any).movie}`
                : (t as any).sub;
            return (
              <div
                key={idx}
                className={`track-row ${idx === activeIdx ? "active" : ""}`}
                onClick={() => handleTrackSelect(idx)}
              >
                <span>
                  {t.name}{" "}
                  <span style={{ color: "var(--txt-faint)", fontSize: "10px" }}>— {sub}</span>
                </span>
                <span>{idx === activeIdx && musicState.playing ? "▶" : ""}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
