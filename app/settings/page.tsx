"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { settings, setSettings, showToast } = useApp();
  const { logout, user } = useAuth();
  const router = useRouter();
  
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignOut = async () => {
    await logout();
    router.push("/");
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0,2);
  };

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
    .account-card {
      background: linear-gradient(135deg, rgba(178,58,72,0.1), rgba(20,5,12,0.8));
      border: 1px solid rgba(254, 208, 187, 0.2);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 0 15px rgba(178,58,72,0.1);
      margin-bottom: 32px;
      position: relative;
      overflow: hidden;
    }
    .account-card::before {
      content: '';
      position: absolute;
      top: -50px; right: -50px;
      width: 150px; height: 150px;
      background: radial-gradient(circle, rgba(178,58,72,0.3) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    .signed-in-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--text-mid);
      margin-bottom: 16px;
    }
    .account-info-wrapper {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--red);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(178,58,72,0.5);
      border: 2px solid rgba(254, 208, 187, 0.3);
      overflow: hidden;
      flex-shrink: 0;
    }
    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .avatar-initials {
      font-family: var(--fB);
      font-size: 20px;
      color: #ffffff;
    }
    .account-details {
      flex: 1;
    }
    .account-name {
      font-family: var(--fB);
      font-size: 20px;
      color: var(--text-hi);
      margin-bottom: 4px;
      letter-spacing: 1px;
    }
    .account-email {
      font-size: 14px;
      color: rgba(254, 208, 187, 0.8);
    }
    .sign-out-btn {
      padding: 10px 20px;
      font-size: 13px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      box-shadow: 0 4px 15px rgba(178, 58, 72, 0.3);
      transition: all 0.3s;
    }
    .sign-out-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(178, 58, 72, 0.6);
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.8);
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .holographic-panel {
      max-width: 400px;
      width: 90%;
      background: rgba(20, 5, 12, 0.85);
      border: 1px solid rgba(254, 208, 187, 0.2);
      box-shadow: 0 20px 50px rgba(0,0,0,0.8), inset 0 0 20px rgba(178,58,72,0.2);
      animation: guideCardEntrance 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    
    @media (max-width: 600px) {
      .account-info-wrapper {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      .sign-out-btn {
        width: 100%;
        margin-top: 8px;
      }
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
        
        {/* Professional Account Section */}
        <div className="panel account-card">
          <div className="signed-in-label">Signed in as</div>
          <div className="account-info-wrapper">
            <div className="avatar">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="avatar-img" />
              ) : (
                <div className="avatar-initials">{getInitials(user?.displayName)}</div>
              )}
            </div>
            <div className="account-details">
              <div className="account-name">{user?.displayName || "Neural Linked User"}</div>
              <div className="account-email">{user?.email || "No email available"}</div>
            </div>
            <button className="btn btn-danger sign-out-btn" onClick={() => setShowConfirm(true)}>
              Sign Out
            </button>
          </div>
        </div>

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

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content panel holographic-panel">
            <h3 style={{ color: "var(--red)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "2px", fontSize: "18px" }}>Sign Out</h3>
            <p style={{ marginBottom: "24px", color: "var(--text-hi)", lineHeight: "1.5" }}>
              Are you sure you want to sign out of your account?
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleSignOut}>Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
