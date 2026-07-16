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
    @keyframes slideInLeft {
      0% { opacity: 0; transform: translateX(-24px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(16px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes glowPulse {
      0%, 100% { box-shadow: 0 0 6px rgba(178,58,72,0.3); }
      50% { box-shadow: 0 0 14px rgba(178,58,72,0.7), 0 0 24px rgba(178,58,72,0.3); }
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
    .gesture-section {
      opacity: 0;
      animation: fadeInUp 0.5s ease forwards;
      margin-bottom: 8px;
    }
    .gesture-category-label {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 10px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--red);
      margin-bottom: 6px;
      padding: 10px 0 6px;
    }
    .gesture-category-label::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, rgba(178,58,72,0.4), transparent);
    }
    .gesture-list-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      border-radius: 10px;
      background: rgba(20, 10, 15, 0.6);
      border: 1px solid rgba(254, 208, 187, 0.15);
      margin-bottom: 8px;
      opacity: 0;
      animation: slideInLeft 0.4s ease forwards;
      transition: all 0.25s ease;
      cursor: default;
    }
    .gesture-list-item:hover {
      background: rgba(178, 58, 72, 0.15);
      border-color: rgba(254, 208, 187, 0.4);
      transform: translateX(6px);
      box-shadow: 0 4px 15px rgba(178, 58, 72, 0.2);
    }
    .gesture-list-item:hover .gesture-emoji {
      transform: scale(1.1) rotate(-3deg);
      background: rgba(178, 58, 72, 0.3);
    }
    .gesture-emoji {
      font-size: 24px;
      width: 46px;
      height: 46px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      border: 1px solid rgba(254, 208, 187, 0.2);
      flex-shrink: 0;
      transition: all 0.25s ease;
    }
    .gesture-info { flex: 1; min-width: 0; }
    .gesture-name {
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.5px;
      margin-bottom: 3px;
    }
    .gesture-desc {
      font-size: 12.5px;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.45;
    }
    .gesture-badge {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 20px;
      flex-shrink: 0;
      animation: glowPulse 2.5s ease-in-out infinite;
    }
    .badge-hold { background: rgba(178,58,72,0.2); color: #e07080; border: 1px solid rgba(178,58,72,0.35); }
    .badge-swipe { background: rgba(80,120,220,0.15); color: #80aaee; border: 1px solid rgba(80,120,220,0.3); }
    .badge-pinch { background: rgba(100,180,80,0.12); color: #80cc70; border: 1px solid rgba(100,180,80,0.25); }
    .badge-double { background: rgba(200,150,30,0.15); color: #e0b850; border: 1px solid rgba(200,150,30,0.3); }
    .badge-drag { background: rgba(160,80,200,0.15); color: #cc90ee; border: 1px solid rgba(160,80,200,0.3); }
    .badge-dwell { background: rgba(30,180,200,0.12); color: #60d0e0; border: 1px solid rgba(30,180,200,0.25); }
    .badge-move { background: rgba(220,120,40,0.15); color: #e09050; border: 1px solid rgba(220,120,40,0.3); }
    .badge-zoom { background: rgba(40,200,120,0.12); color: #50e090; border: 1px solid rgba(40,200,120,0.25); }
    .badge-chat { background: rgba(220,80,160,0.12); color: #e070c0; border: 1px solid rgba(220,80,160,0.25); }
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
            <div className="s-sub">Controls pinch threshold, smoothing, swipe speed, scroll rate, and confirmation frames simultaneously.</div>
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



        <div className="gesture-section" style={{ marginTop: "48px", marginBottom: "24px", animationDelay: "0.1s" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ fontSize: "14px", letterSpacing: "3px", textTransform: "uppercase", color: "var(--txt-faint)", marginBottom: "6px" }}>Gesture Control Reference</div>
            <div style={{ fontSize: "11px", color: "rgba(254,208,187,0.35)", letterSpacing: "1px" }}>Enable camera above &middot; Green confidence bar = gesture confirmed</div>
          </div>

          {/* Navigation */}
          <div className="gesture-category-label" style={{ animationDelay: "0.15s" }}>Navigation</div>

          <div className="gesture-list-item" style={{ animationDelay: "0.18s" }}>
            <div className="gesture-emoji">🖐️</div>
            <div className="gesture-info">
              <div className="gesture-name">Open Palm</div>
              <div className="gesture-desc">All 4+ fingers extended &mdash; navigates to the Home dashboard</div>
            </div>
            <span className="gesture-badge badge-hold">HOLD</span>
          </div>

          <div className="gesture-list-item" style={{ animationDelay: "0.22s" }}>
            <div className="gesture-emoji">✌️</div>
            <div className="gesture-info">
              <div className="gesture-name">Peace Sign</div>
              <div className="gesture-desc">Index + middle extended &mdash; cycles to the next module</div>
            </div>
            <span className="gesture-badge badge-hold">HOLD</span>
          </div>

          <div className="gesture-list-item" style={{ animationDelay: "0.26s" }}>
            <div className="gesture-emoji">👊</div>
            <div className="gesture-info">
              <div className="gesture-name">Fist Left</div>
              <div className="gesture-desc">Closed fist + fast left motion &mdash; browser back / previous page</div>
            </div>
            <span className="gesture-badge badge-swipe">SWIPE</span>
          </div>

          <div className="gesture-list-item" style={{ animationDelay: "0.30s" }}>
            <div className="gesture-emoji">👊</div>
            <div className="gesture-info">
              <div className="gesture-name">Fist Right</div>
              <div className="gesture-desc">Closed fist + fast right motion &mdash; browser forward / next page</div>
            </div>
            <span className="gesture-badge badge-swipe">SWIPE</span>
          </div>

          {/* Click & Interaction */}
          <div className="gesture-category-label" style={{ animationDelay: "0.34s", marginTop: "16px" }}>Click &amp; Interaction</div>

          <div className="gesture-list-item" style={{ animationDelay: "0.37s" }}>
            <div className="gesture-emoji">🤏</div>
            <div className="gesture-info">
              <div className="gesture-name">Pinch</div>
              <div className="gesture-desc">Thumb + index tip close &mdash; single click on element under cursor</div>
            </div>
            <span className="gesture-badge badge-pinch">CLICK</span>
          </div>

          <div className="gesture-list-item" style={{ animationDelay: "0.41s" }}>
            <div className="gesture-emoji">🤏</div>
            <div className="gesture-info">
              <div className="gesture-name">Double Pinch</div>
              <div className="gesture-desc">Two quick pinches under 400ms &mdash; double-click on element</div>
            </div>
            <span className="gesture-badge badge-double">DOUBLE</span>
          </div>

          <div className="gesture-list-item" style={{ animationDelay: "0.45s" }}>
            <div className="gesture-emoji">⏱️</div>
            <div className="gesture-info">
              <div className="gesture-name">Long Press</div>
              <div className="gesture-desc">Hold pinch 1.5s without moving &mdash; triggers context menu</div>
            </div>
            <span className="gesture-badge badge-hold">HOLD</span>
          </div>

          <div className="gesture-list-item" style={{ animationDelay: "0.49s" }}>
            <div className="gesture-emoji">✋</div>
            <div className="gesture-info">
              <div className="gesture-name">Drag &amp; Drop</div>
              <div className="gesture-desc">Pinch + hold 350ms then move &mdash; release pinch to drop</div>
            </div>
            <span className="gesture-badge badge-drag">DRAG</span>
          </div>

          <div className="gesture-list-item" style={{ animationDelay: "0.53s" }}>
            <div className="gesture-emoji">☝️</div>
            <div className="gesture-info">
              <div className="gesture-name">Point &amp; Hover</div>
              <div className="gesture-desc">Index finger only &mdash; moves cursor, dwell over element to hover</div>
            </div>
            <span className="gesture-badge badge-dwell">DWELL</span>
          </div>

          <div className="gesture-category-label" style={{ animationDelay: "0.57s", marginTop: "16px" }}>Scroll</div>

          <div className="gesture-list-item" style={{ animationDelay: "0.60s" }}>
            <div className="gesture-emoji">✊</div>
            <div className="gesture-info">
              <div className="gesture-name">Fist Scroll</div>
              <div className="gesture-desc">Closed fist + slow vertical movement &mdash; smooth page scroll</div>
            </div>
            <span className="gesture-badge badge-move">MOVE</span>
          </div>

          <div className="gesture-list-item" style={{ animationDelay: "0.64s" }}>
            <div className="gesture-emoji">☝️</div>
            <div className="gesture-info">
              <div className="gesture-name">Swipe Up</div>
              <div className="gesture-desc">Point + fast upward motion &mdash; scroll up or previous music track</div>
            </div>
            <span className="gesture-badge badge-swipe">SWIPE</span>
          </div>

          <div className="gesture-list-item" style={{ animationDelay: "0.68s" }}>
            <div className="gesture-emoji">☝️</div>
            <div className="gesture-info">
              <div className="gesture-name">Swipe Down</div>
              <div className="gesture-desc">Point + fast downward motion &mdash; scroll down or next music track</div>
            </div>
            <span className="gesture-badge badge-swipe">SWIPE</span>
          </div>

          {/* Shortcuts */}
          <div className="gesture-category-label" style={{ animationDelay: "0.80s", marginTop: "16px" }}>Shortcuts</div>

          <div className="gesture-list-item" style={{ animationDelay: "0.83s" }}>
            <div className="gesture-emoji">🤟</div>
            <div className="gesture-info">
              <div className="gesture-name">Three Fingers</div>
              <div className="gesture-desc">Index + middle + ring extended &mdash; opens JARVIS AI chat panel</div>
            </div>
            <span className="gesture-badge badge-chat">CHAT</span>
          </div>

          {/* Sensitivity tip */}
          <div style={{ background: "rgba(178,58,72,0.06)", border: "1px solid rgba(178,58,72,0.18)", borderRadius: "12px", padding: "16px 20px", marginTop: "24px", opacity: 0, animation: "fadeInUp 0.5s ease 0.9s forwards" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", color: "var(--red)", marginBottom: "8px" }}>Sensitivity Slider Controls 5 Parameters</div>
            <div style={{ fontSize: "12px", color: "rgba(254,208,187,0.6)", lineHeight: "1.7" }}>
              Pinch threshold &bull; EMA smoothing &bull; Confirmation frames &bull; Swipe velocity &bull; Scroll speed &bull; Hover dwell time.
              <br/><span style={{ color: "rgba(254,208,187,0.4)" }}>Low = deliberate &nbsp;&bull;&nbsp; High = fast &amp; reactive</span>
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
