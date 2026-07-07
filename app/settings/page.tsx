"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export default function SettingsPage() {
  const { settings, setSettings, setStats, showToast } = useApp();

  const handleToggleVoiceOut = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, voiceOut: e.target.checked }));
  };

  const handleToggleGesture = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, gesture: e.target.checked }));
  };

  const handleSensitivity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, sensitivity: Number(e.target.value) }));
  };

  const handleToggleContinuous = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, continuous: e.target.checked }));
  };

  const handleTheme = (themeName: string) => {
    setSettings((prev) => ({ ...prev, theme: themeName }));
    showToast(`Accent set to ${themeName}`);
  };

  const handleReset = () => {
    setStats({ commands: 0, drawings: 0 });
    showToast("Stats reset complete");
  };

  return (
    <section className="view active" id="view-settings">
      <div className="view-head">
        <div>
          <div className="eyebrow">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>{" "}
            Module 08
          </div>
          <h1 className="view-title">Settings</h1>
          <div className="view-sub">Tune how the HUD listens, watches, and looks.</div>
        </div>
      </div>

      <div className="settings-grid">
        <div className="panel setting-row">
          <div className="s-info">
            <div className="s-title">Voice replies</div>
            <div className="s-sub">JARVIS speaks chat and command responses aloud.</div>
          </div>
          <label className="switch">
            <input type="checkbox" id="settingVoiceOut" checked={settings.voiceOut} onChange={handleToggleVoiceOut} />
            <span className="track">
              <span className="thumb"></span>
            </span>
          </label>
        </div>

        <div className="panel setting-row">
          <div className="s-info">
            <div className="s-title">Gesture camera</div>
            <div className="s-sub">Turns on webcam for hand-tracking navigation. Needs camera permission.</div>
          </div>
          <label className="switch">
            <input type="checkbox" id="settingGesture" checked={settings.gesture} onChange={handleToggleGesture} />
            <span className="track">
              <span className="thumb"></span>
            </span>
          </label>
        </div>

        <div className="panel setting-row">
          <div className="s-info">
            <div className="s-title">Gesture sensitivity</div>
            <div className="s-sub">How close fingers must pinch to trigger a select.</div>
          </div>
          <input
            type="range"
            id="settingSensitivity"
            min="1"
            max="10"
            value={settings.sensitivity}
            style={{ maxWidth: "150px" }}
            onChange={handleSensitivity}
          />
        </div>

        <div className="panel setting-row">
          <div className="s-info">
            <div className="s-title">Continuous listening</div>
            <div className="s-sub">Mic stays on for commands instead of one phrase at a time.</div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              id="settingContinuous"
              checked={settings.continuous}
              onChange={handleToggleContinuous}
            />
            <span className="track">
              <span className="thumb"></span>
            </span>
          </label>
        </div>

        <div className="panel setting-row">
          <div className="s-info">
            <div className="s-title">HUD accent color</div>
            <div className="s-sub">Reactor color theme.</div>
          </div>
          <div className="theme-dots">
            <div
              className={`theme-dot ${settings.theme === "cream" ? "active" : ""}`}
              data-theme="cream"
              style={{ background: "#D92B2B" }}
              onClick={() => handleTheme("cream")}
            ></div>
            <div
              className={`theme-dot ${settings.theme === "mauve" ? "active" : ""}`}
              data-theme="mauve"
              style={{ background: "#C0392B" }}
              onClick={() => handleTheme("mauve")}
            ></div>
            <div
              className={`theme-dot ${settings.theme === "wine" ? "active" : ""}`}
              data-theme="wine"
              style={{ background: "#E74C3C" }}
              onClick={() => handleTheme("wine")}
            ></div>
          </div>
        </div>

        <div className="panel" style={{ padding: "18px" }}>
          <div className="s-title" style={{ marginBottom: "10px" }}>
            Gesture Guide
          </div>
          <div className="gesture-guide mono">
            <div className="gg-row">
              <span className="gg-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </span>
              Point index finger to move cursor
            </div>
            <div className="gg-row">
              <span className="gg-icon">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </span>
              Pinch thumb + index to click or draw
            </div>
            <div className="gg-row">
              <span className="gg-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </span>
              Open palm held 0.8s — jump home
            </div>
            <div className="gg-row">
              <span className="gg-icon">
                <svg viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
              Peace sign held 0.8s — next module
            </div>
          </div>
        </div>

        <div className="panel setting-row">
          <div className="s-info">
            <div className="s-title">Reset session stats</div>
            <div className="s-sub">Clears command, note and stroke counters.</div>
          </div>
          <button className="btn btn-ghost btn-sm" id="resetStatsBtn" onClick={handleReset}>
            Reset
          </button>
        </div>

        <div className="panel" style={{ padding: "18px" }}>
          <div className="s-title" style={{ marginBottom: "6px" }}>
            About
          </div>
          <div className="s-sub">
            GESTURE.AI is a self-contained holographic dashboard — voice via Web Speech API, hand tracking via
            on-device MediaPipe Hands, weather via Open-Meteo. Nothing leaves your browser except chat messages sent to
            the assistant.
          </div>
        </div>
      </div>
    </section>
  );
}
