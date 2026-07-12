"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export default function Onboarding() {
  const { onboardingOpen, setOnboardingOpen } = useApp();

  const onboardStyles = `
    @keyframes overlayFade {
      0% { opacity: 0; backdrop-filter: blur(0px); }
      100% { opacity: 1; backdrop-filter: blur(8px); }
    }
    @keyframes cardFadeIn {
      0% { opacity: 0; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes listItemFade {
      0% { opacity: 0; transform: translateX(-10px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    
    .onboard-overlay-animated {
      animation: overlayFade 0.4s ease-out forwards;
      background: rgba(17, 5, 14, 0.6) !important;
    }
    .onboard-card-animated {
      animation: cardFadeIn 0.5s ease-out 0.1s forwards;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.08) !important;
      background: rgba(30, 10, 18, 0.8) !important;
      backdrop-filter: blur(20px);
      border-radius: 16px !important;
      padding: 32px !important;
      opacity: 0;
    }
    .onboard-card-animated h2 {
      font-size: 22px !important;
      margin-bottom: 8px !important;
      font-weight: 600;
      color: var(--text-hi);
      text-shadow: none;
    }
    .onboard-card-animated p {
      font-size: 14px !important;
      margin-bottom: 24px !important;
      color: var(--text-mid);
      opacity: 0.9;
    }
    .onboard-list-animated div {
      opacity: 0;
      animation: listItemFade 0.4s ease-out forwards;
      padding: 12px;
      border-radius: 10px;
      transition: background 0.2s ease, border-color 0.2s ease;
      background: transparent;
      border: 1px solid transparent;
      margin-bottom: 6px;
      align-items: center;
    }
    .onboard-list-animated div:hover {
      background: rgba(255, 255, 255, 0.03);
      border-color: rgba(255, 255, 255, 0.08);
      transform: none;
      box-shadow: none;
    }
    .onboard-list-animated div:nth-child(1) { animation-delay: 0.2s; }
    .onboard-list-animated div:nth-child(2) { animation-delay: 0.3s; }
    .onboard-list-animated div:nth-child(3) { animation-delay: 0.4s; }
    
    .btn-enter-hud {
      margin-top: 20px;
      padding: 14px !important;
      font-size: 14px !important;
      letter-spacing: 1px !important;
      font-weight: 500;
      text-transform: uppercase;
      box-shadow: 0 4px 12px rgba(178, 58, 72, 0.3);
      transition: all 0.2s ease-out !important;
      opacity: 0;
      animation: cardFadeIn 0.4s ease-out 0.6s forwards;
      border-radius: 8px !important;
    }
    .btn-enter-hud:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(178, 58, 72, 0.5);
    }
  `;

  return (
    <div className={`onboard-overlay ${onboardingOpen ? "onboard-overlay-animated" : "hidden"}`} id="onboardOverlay">
      <style>{onboardStyles}</style>
      <div className="panel onboard-card brackets onboard-card-animated">
        <h2>Welcome, User</h2>
        <p>This HUD responds to your voice, your hand, or your mouse — whichever feels natural.</p>
        <div className="onboard-list onboard-list-animated">
          <div>
            <span className="oi">
              <svg viewBox="0 0 24 24">
                <path d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z"/>
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
              </svg>
            </span>
            <span>Tap the mic and speak — try &quot;open drawing&quot; or &quot;what&apos;s the weather today&quot;.</span>
          </div>
          <div>
            <span className="oi">
              <svg viewBox="0 0 24 24">
                <path d="M18 11V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>
                <path d="M14 4l4 4-8 8-4 4v-4l8-8z"/>
              </svg>
            </span>
            <span>Turn on the camera in Settings, then point &amp; pinch to navigate hands-free.</span>
          </div>
          <div>
            <span className="oi">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4l3 3"/>
              </svg>
            </span>
            <span>Or just click around — every feature works perfectly with mouse or touch.</span>
          </div>
        </div>
        <button
          className="btn btn-accent btn-enter-hud"
          id="onboardCloseBtn"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={() => setOnboardingOpen(false)}
        >
          Enter the HUD
        </button>
      </div>
    </div>
  );
}
