"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export default function Onboarding() {
  const { onboardingOpen, setOnboardingOpen } = useApp();

  return (
    <div className={`onboard-overlay ${onboardingOpen ? "" : "hidden"}`} id="onboardOverlay">
      <div className="panel onboard-card brackets">
        <h2>Welcome, User</h2>
        <p>This HUD responds to your voice, your hand, or your mouse — whichever feels natural.</p>
        <div className="onboard-list">
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
          className="btn btn-accent"
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
