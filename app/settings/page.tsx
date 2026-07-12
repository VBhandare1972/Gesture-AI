"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export default function SettingsPage() {
  const { settings, setSettings, showToast } = useApp();

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

  const customStyles = `
    @keyframes guideCardEntrance {
      0% { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(5px); }
      70% { opacity: 1; transform: translateY(-3px) scale(1.02); filter: blur(0); }
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }
    .guide-card-animated {
      opacity: 0;
      animation: guideCardEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .guide-card-animated:hover {
      transform: translateY(-5px) scale(1.03);
      box-shadow: 0 15px 35px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(254, 208, 187, 0.4);
      z-index: 10;
    }
    .guide-card-animated:hover .gest-icon {
      transform: scale(1.2) rotate(5deg);
      text-shadow: 0 0 20px rgba(254, 208, 187, 0.6);
    }
    .gest-icon {
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
  `;

  return (
    <section className="view active" id="view-settings">
      <style>{customStyles}</style>
      <div className="view-head">
        <div>
          
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



        <div style={{ marginTop: "48px", marginBottom: "24px" }}>
          <div className="s-title" style={{ marginBottom: "24px", textAlign: "center", fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--txt-faint)" }}>
            Gesture Navigation Guide
          </div>
          <div className="capability-grid">
            
            <div className="cap-card guide-card-animated" style={{ animationDelay: "0.1s" }}>
              <div className="gest-icon" style={{ fontSize: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                ☝️
              </div>
              <span className="tag">GESTURE</span>
              <h3>1 Finger</h3>
              <p>Point index finger to move cursor.</p>
            </div>

            <div className="cap-card guide-card-animated" style={{ animationDelay: "0.2s" }}>
              <div className="gest-icon" style={{ fontSize: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                🤏
              </div>
              <span className="tag">GESTURE</span>
              <h3>Pinch</h3>
              <p>Thumb + index to click or draw.</p>
            </div>

            <div className="cap-card guide-card-animated" style={{ animationDelay: "0.3s" }}>
              <div className="gest-icon" style={{ fontSize: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                🖐️
              </div>
              <span className="tag">GESTURE</span>
              <h3>Open Palm</h3>
              <p>Hold for 0.8s to jump home.</p>
            </div>

            <div className="cap-card guide-card-animated" style={{ animationDelay: "0.4s" }}>
              <div className="gest-icon" style={{ fontSize: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                ✌️
              </div>
              <span className="tag">GESTURE</span>
              <h3>Peace Sign</h3>
              <p>Hold for 0.8s for next module.</p>
            </div>

          </div>
        </div>


        
      </div>
    </section>
  );
}
