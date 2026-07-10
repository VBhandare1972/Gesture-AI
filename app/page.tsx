"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import ModuleIcon from "@/components/ModuleIcon";

const MODULES = [
  { id: 'draw', icon: 'draw', label: 'Air Draw', path: '/draw' },
  { id: 'music', icon: 'music', label: 'Music', path: '/music' },
  { id: 'weather', icon: 'weather', label: 'Weather', path: '/weather' },
  { id: 'games', icon: 'games', label: 'Games', path: '/games' },
  { id: 'notes', icon: 'notes', label: 'Notes', path: '/notes' },
  { id: 'calc', icon: 'calc', label: 'Calc', path: '/calc' },
  { id: 'settings', icon: 'settings', label: 'Settings', path: '/settings' },
];

const PARTICLES = [
  { id: 1, left: "8%", size: "6px", duration: "16s", delay: "0s", opacity: 0.35 },
  { id: 2, left: "22%", size: "12px", duration: "24s", delay: "2s", opacity: 0.2 },
  { id: 3, left: "38%", size: "5px", duration: "14s", delay: "5s", opacity: 0.4 },
  { id: 4, left: "50%", size: "10px", duration: "20s", delay: "1s", opacity: 0.25 },
  { id: 5, left: "68%", size: "8px", duration: "18s", delay: "4s", opacity: 0.3 },
  { id: 6, left: "82%", size: "14px", duration: "26s", delay: "7s", opacity: 0.15 },
  { id: 7, left: "15%", size: "7px", duration: "15s", delay: "3s", opacity: 0.38 },
  { id: 8, left: "28%", size: "9px", duration: "19s", delay: "6s", opacity: 0.22 },
  { id: 9, left: "44%", size: "4px", duration: "13s", delay: "9s", opacity: 0.45 },
  { id: 10, left: "60%", size: "11px", duration: "22s", delay: "2s", opacity: 0.18 },
  { id: 11, left: "74%", size: "8px", duration: "17s", delay: "8s", opacity: 0.32 },
  { id: 12, left: "90%", size: "13px", duration: "25s", delay: "0s", opacity: 0.12 },
];

export default function DashboardPage() {
  const {
    currentDate,
    getGreeting,
    settings,
    setSettings,
    voiceState,
    weatherState,
    cmdLogEntries,
    parseCommand,
    toggleCommandMic,
    showToast,
    musicState,
    playMusic,
    pauseMusic,
    setChatOpen
  } = useApp();

  const [cmdInput, setCmdInput] = useState("");

  const handleRunCommand = () => {
    if (!cmdInput.trim()) return;
    parseCommand(cmdInput, "TEXT");
    setCmdInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRunCommand();
    }
  };

  const cx = 330;
  const cy = 250;
  const radius = 210;

  return (
    <section className="view active" id="view-home">
      {/* Background Video Animation */}
      <div className="video-bg-wrap">
        <video
          autoPlay
          loop
          muted
          playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260603_132049_036591b8-6e92-4760-b94c-a7ea6eef315c.mp4"
        />
        <div className="video-bg-overlay"></div>
        {/* Floating Neural Particles / AI Bubbles */}
        <div className="neural-particles-container">
          {PARTICLES.map((p) => (
            <div
              key={p.id}
              className="neural-particle"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                animationDuration: p.duration,
                animationDelay: p.delay,
                opacity: p.opacity,
              }}
            />
          ))}
        </div>
      </div>

      <div className="home-hero">
        <div className="home-greet" id="homeGreet">
          {getGreeting()} <b>USER</b>
        </div>
        <div className="home-date" id="homeDate">
          {currentDate || "—"}
        </div>
      </div>

      <div className="orbit-wrap" id="orbitWrap">
        <div className="orbit-ring r2"></div>
        <div className="orbit-ring r1"></div>

        {/* Advanced Telemetry SVG Layer */}
        <svg className="telemetry-svg" viewBox="0 0 660 500" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          {/* Laser connection lines */}
          {MODULES.map((m, i) => {
            const angle = -Math.PI / 2 + i * ((2 * Math.PI) / MODULES.length);
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            return (
              <line
                key={`line-${m.id}`}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="rgba(254, 208, 187, 0.2)"
                strokeWidth="1.2"
                strokeDasharray="5 7"
                className="connector-line"
              />
            );
          })}

          {/* Outer ring sweep laser */}
          <circle cx="330" cy="250" r="210" fill="none" stroke="rgba(245, 218, 167, 0.05)" strokeWidth="3" />
          <circle cx="330" cy="250" r="210" fill="none" stroke="url(#laserGrad)" strokeWidth="2.5" strokeDasharray="30 200" className="laser-sweep" />
          
          {/* Inner data packet rings */}
          <circle cx="330" cy="250" r="140" fill="none" stroke="rgba(254, 208, 187, 0.12)" strokeWidth="1" strokeDasharray="5 15" className="telemetry-spin-fast" />
          <circle cx="330" cy="250" r="260" fill="none" stroke="rgba(254, 208, 187, 0.07)" strokeWidth="1.5" strokeDasharray="2 30" className="telemetry-spin-slow" />
          
          <defs>
            <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--cream)" stopOpacity="1" />
              <stop offset="30%" stopColor="var(--peach)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--rose)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div
          className="reactor-core"
          id="reactorCore"
          tabIndex={0}
          role="button"
          aria-label="System core"
          onClick={() => showToast("All systems nominal")}
        >
          <svg viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#D92B2B"
              strokeWidth="1.4"
              strokeDasharray="6 14"
              opacity=".6"
            />
          </svg>
          <span className="r-label">GESTURE.AI</span>
          <span className="r-status mono" id="reactorStatus">
            SYSTEMS 
          </span>
        </div>

        {MODULES.map((m, i) => {
          const angle = -Math.PI / 2 + i * ((2 * Math.PI) / MODULES.length);
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);

          return (
            <Link
              key={m.id}
              href={m.path}
              className="orbit-node"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                animationDelay: `${i * 55}ms`,
              }}
            >
              <span className="o-icon">
                <ModuleIcon name={m.icon} />
              </span>
              <span className="o-label">{m.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="node-grid" id="nodeGrid">
        {MODULES.map((m, i) => (
          <Link
            key={m.id}
            href={m.path}
            className="node-card"
            style={{ animationDelay: `${i * 55}ms` }}
          >
            <span className="o-icon">
              <ModuleIcon name={m.icon} width={24} height={24} />
            </span>
            <span className="o-label">{m.label}</span>
          </Link>
        ))}
      </div>

      

      {/* New Minimal Command & Control Center */}
      

      {/* Capabilities section */}
      <div className="section-head reveal" style={{ marginTop: '48px' }}>
        <br />
        <br />
        <br />

        <span className="idx">01</span>
        <h2>Interface Capabilities</h2>
        <span className="rule"></span>
      </div>

      <div className="capability-grid">
        <div className="cap-card reveal">
          <div className="gest-icon">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" strokeLinecap="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
            </svg>
          </div>
          <span className="tag">VOICE</span>
          <h3>Voice Navigation</h3>
          <p>Say &quot;open [page]&quot; (e.g., &quot;open draw&quot;, &quot;open music&quot;) to switch modules. JARVIS confirms all vocal inputs immediately.</p>
        </div>

        <div className="cap-card reveal">
          <div className="gest-icon">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 11V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>
              <path d="M14 4l4 4-8 8-4 4v-4l8-8z"/>
            </svg>
          </div>
          <span className="tag">GESTURE</span>
          <h3>Index Aiming</h3>
          <p>Point your index finger toward the webcam to position the holographic HUD cursor. Hovering selects elements automatically.</p>
        </div>

        <div className="cap-card reveal">
          <div className="gest-icon">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <span className="tag">GESTURE</span>
          <h3>Pinch Clicking</h3>
          <p>Pinch your thumb and index fingers together to click buttons, select options, or sketch on the Air Drawing board.</p>
        </div>

        <div className="cap-card reveal">
          <div className="gest-icon">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </div>
          <span className="tag">GESTURE</span>
          <h3>Open Palm Home</h3>
          <p>Raise an open palm to the webcam for 0.8 seconds to instantly close the current module and return to the main dashboard.</p>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="section-head reveal" style={{ marginTop: '48px' }}>
        <span className="idx">02</span>
        <h2>How to Interact (Quick Start Guide)</h2>
        <span className="rule"></span>
      </div>

      <div className="zigzag-guide-container">
        {/* Step 1 */}
        <div className="zigzag-step-row reveal">
          <div className="zigzag-media">
            <div className="step-img-wrap step-diag-sensor">
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(254, 208, 187, 0.12)" strokeWidth="1" />
                <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(254, 208, 187, 0.12)" strokeWidth="1" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(254, 208, 187, 0.2)" strokeWidth="1.5" strokeDasharray="4 8" />
                <circle cx="50" cy="50" r="28" fill="none" stroke="var(--peach)" strokeWidth="2" strokeDasharray="16 8" className="diag-spin-fast" />
                <circle cx="50" cy="50" r="16" fill="none" stroke="var(--cream)" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="6" fill="var(--cream)" />
              </svg>
            </div>
          </div>
          <div className="zigzag-info">
            <span className="zigzag-badge">STEP 01</span>
            <h3>Initialize Sensors</h3>
            <p>Click the &quot;CAM OFF&quot; indicator in the top navbar or toggle Gesture Tracking in settings to power on your camera sensor.</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="zigzag-step-row reverse reveal">
          <div className="zigzag-media">
            <div className="step-img-wrap step-diag-calib">
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                <rect x="10" y="10" width="80" height="80" rx="6" fill="none" stroke="rgba(254, 208, 187, 0.1)" strokeWidth="1.2" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(254, 208, 187, 0.15)" strokeWidth="1" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(254, 208, 187, 0.25)" strokeWidth="1.2" />
                <line x1="32" y1="50" x2="68" y2="50" stroke="var(--peach)" strokeWidth="1.5" />
                <line x1="50" y1="32" x2="50" y2="68" stroke="var(--peach)" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="4" fill="var(--cream)" className="diag-pulse" />
                <circle cx="50" cy="50" r="12" fill="none" stroke="var(--cream)" strokeWidth="1.5" strokeDasharray="4 4" className="diag-spin-slow" />
              </svg>
            </div>
          </div>
          <div className="zigzag-info">
            <span className="zigzag-badge">STEP 02</span>
            <h3>Calibrate Cursor</h3>
            <p>Position your hand in front of the lens and point your index finger to pilot the custom HUD cursor across active panels.</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="zigzag-step-row reveal">
          <div className="zigzag-media">
            <div className="step-img-wrap step-diag-action">
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(254, 208, 187, 0.1)" strokeWidth="1.2" />
                <circle cx="50" cy="50" r="24" fill="none" stroke="var(--rose)" strokeWidth="1.5" className="diag-ring-pulse-1" />
                <circle cx="50" cy="50" r="13" fill="none" stroke="var(--peach)" strokeWidth="2" className="diag-ring-pulse-2" />
                <polygon points="50,38 53,47 62,50 53,53 50,62 47,53 38,50 47,47" fill="var(--cream)" />
              </svg>
            </div>
          </div>
          <div className="zigzag-info">
            <span className="zigzag-badge">STEP 03</span>
            <h3>Trigger Actions</h3>
            <p>Bring your thumb and index finger together to pinch. Use this gesture to click buttons, type notes, or sketch in Air Draw.</p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="zigzag-step-row reverse reveal">
          <div className="zigzag-media">
            <div className="step-img-wrap step-diag-voice">
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(254, 208, 187, 0.15)" strokeWidth="1" />
                <rect x="25" y="42" width="6" height="16" fill="var(--rose)" rx="3" className="diag-eq-1" style={{ transformOrigin: "center" }} />
                <rect x="35" y="34" width="6" height="32" fill="var(--peach)" rx="3" className="diag-eq-2" style={{ transformOrigin: "center" }} />
                <rect x="47" y="25" width="6" height="50" fill="var(--cream)" rx="3" className="diag-eq-3" style={{ transformOrigin: "center" }} />
                <rect x="59" y="37" width="6" height="26" fill="var(--peach)" rx="3" className="diag-eq-2" style={{ transformOrigin: "center" }} />
                <rect x="69" y="44" width="6" height="12" fill="var(--rose)" rx="3" className="diag-eq-1" style={{ transformOrigin: "center" }} />
              </svg>
            </div>
          </div>
          <div className="zigzag-info">
            <span className="zigzag-badge">STEP 04</span>
            <h3>Speak Intent</h3>
            <p>Click the &quot;MIC OFF&quot; navbar indicator to wake recognition, then speak aloud to check weather or navigate modules.</p>
          </div>
        </div>
      </div>

      {/* About Us section */}
      <div className="section-head reveal" style={{ marginTop: '56px' }}>
        <span className="idx">03</span>
        <h2>About GESTURE.AI</h2>
        <span className="rule"></span>
      </div>

      <div className="about-hud-container reveal">
        <div className="about-hud-info">
          <span className="zz-eyebrow">SYSTEM OVERVIEW</span>
          <h3>Smart Interaction Hub</h3>
          <p className="about-para">
            GESTURE.AI is a smart assistant that lets you control this website using simple hand movements and voice commands. 
            By using your webcam, it tracks your hand in real time to let you point, click, draw, or navigate home without touching your mouse or keyboard. 
            Together with voice controls, GESTURE.AI gives you a completely hands-free, private, and high-tech experience.
          </p>
        </div>
        <div className="about-hud-media">
          <div className="about-image-frame">
            <img 
              src="/about_hud_mockup.png" 
              alt="Holographic Interface Visualizer" 
              className="about-image-glitch"
              style={{ width: "100%", height: "auto", display: "block", borderRadius: "8px" }}
            />
            {/* Holographic scanning overlay corners */}
            <div className="hud-corner top-left"></div>
            <div className="hud-corner top-right"></div>
            <div className="hud-corner bottom-left"></div>
            <div className="hud-corner bottom-right"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .control-center {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 20px;
          margin-top: 20px;
        }

        /* Neural Interface */
        .neural-interface {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .neural-interface::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 30% 20%, rgba(217, 43, 43, 0.03), transparent 60%);
          pointer-events: none;
        }

        .interface-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          position: relative;
        }

        .header-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #D92B2B, transparent);
          animation: glow-sweep 3s ease-in-out infinite;
        }

        @keyframes glow-sweep {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .interface-title {
          font-size: 0.7rem;
          font-weight: 700;
          color: #6B7280;
          letter-spacing: 2px;
          flex: 1;
        }

        .interface-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.6rem;
          color: #10B981;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .status-ring {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
          animation: pulse-ring 2s ease-in-out infinite;
        }

        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
        }

        .interface-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 16px 0;
        }

        .neural-node {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 12px;
          position: relative;
          transition: all 0.3s ease;
        }

        .neural-node:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(217, 43, 43, 0.2);
          transform: translateY(-2px);
        }

        .node-pulse {
          position: absolute;
          top: -1px;
          right: -1px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #D92B2B;
          animation: pulse-node 2s ease-in-out infinite;
        }

        @keyframes pulse-node {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        .node-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .node-icon {
          font-size: 1.2rem;
        }

        .node-label {
          font-size: 0.65rem;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .node-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #E5E7EB;
        }

        .node-bar {
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 2px;
        }

        .node-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #D92B2B, #F59E0B);
          border-radius: 2px;
          transition: width 1s ease;
        }

        /* Gesture Field Mini */
        .gesture-field-mini {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 14px;
          margin-top: 4px;
          text-align: center;
        }

        .field-label {
          font-size: 0.6rem;
          color: #6B7280;
          letter-spacing: 2px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 10px;
        }

        .field-visual {
          width: 80px;
          height: 80px;
          margin: 0 auto;
          background: radial-gradient(circle, rgba(217, 43, 43, 0.05), transparent);
          border-radius: 50%;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .tracking-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60%;
          height: 60%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(217, 43, 43, 0.15);
          border-radius: 50%;
          animation: ring-rotate 10s linear infinite;
        }

        @keyframes ring-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .tracking-dot {
          position: absolute;
          width: 5px;
          height: 5px;
          background: #D92B2B;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(217, 43, 43, 0.4);
          animation: dot-float 2s ease-in-out infinite;
          transform: translate(-50%, -50%);
        }

        @keyframes dot-float {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.8); }
        }

        .field-count {
          display: block;
          margin-top: 8px;
          font-size: 0.6rem;
          color: #6B7280;
          letter-spacing: 1px;
        }

        /* Command Core */
        .command-core {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .core-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .core-icon {
          font-size: 1.2rem;
          color: #D92B2B;
        }

        .core-title {
          font-size: 0.7rem;
          font-weight: 700;
          color: #6B7280;
          letter-spacing: 2px;
          flex: 1;
        }

        .core-badge {
          font-size: 0.5rem;
          padding: 2px 8px;
          background: rgba(217, 43, 43, 0.15);
          color: #D92B2B;
          border-radius: 10px;
          font-weight: 600;
        }

        .core-input-area {
          padding-top: 16px;
        }

        .input-line {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 4px 6px;
          transition: all 0.3s ease;
        }

        .input-line:focus-within {
          border-color: rgba(217, 43, 43, 0.3);
          box-shadow: 0 0 30px rgba(217, 43, 43, 0.05);
        }

        .line-prompt {
          color: #D92B2B;
          font-weight: 700;
          font-size: 1rem;
          padding: 0 6px;
        }

        .core-input {
          flex: 1;
          background: transparent;
          border: none;
          padding: 8px 4px;
          color: #E5E7EB;
          font-size: 0.85rem;
          outline: none;
          font-family: 'Courier New', monospace;
        }

        .core-input::placeholder {
          color: #4B5563;
        }

        .input-actions {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .voice-trigger {
          background: transparent;
          border: none;
          color: #6B7280;
          padding: 6px 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .voice-trigger:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #E5E7EB;
        }

        .voice-trigger.active {
          color: #D92B2B;
          animation: voice-pulse 0.8s ease-in-out infinite;
        }

        @keyframes voice-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .execute-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 14px;
          background: linear-gradient(135deg, #D92B2B, #991B1B);
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .execute-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(217, 43, 43, 0.3);
        }

        .execute-btn:active {
          transform: scale(0.95);
        }

        .core-output {
          margin-top: 14px;
        }

        .output-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.6rem;
          color: #6B7280;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .output-count {
          font-size: 0.5rem;
          padding: 2px 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .output-scroll {
          max-height: 130px;
          overflow-y: auto;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 8px;
          scrollbar-width: thin;
        }

        .output-scroll::-webkit-scrollbar {
          width: 3px;
        }

        .output-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .output-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2px;
        }

        .output-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 20px 0;
          color: #4B5563;
          font-size: 0.75rem;
        }

        .output-empty span:first-child {
          font-size: 1.5rem;
        }

        .empty-sub {
          font-size: 0.6rem;
          color: #374151;
        }

        .output-line {
          display: flex;
          gap: 8px;
          padding: 3px 6px;
          font-size: 0.7rem;
          border-radius: 3px;
          transition: all 0.2s ease;
          font-family: 'Courier New', monospace;
        }

        .output-line:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .line-time {
          color: #6B7280;
          min-width: 55px;
        }

        .line-user {
          color: #D92B2B;
          min-width: 40px;
          font-weight: 600;
        }

        .line-text {
          color: #9CA3AF;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .control-center {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .interface-grid {
            grid-template-columns: 1fr;
          }
          
          .input-line {
            flex-wrap: wrap;
          }
          
          .input-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </section>
  );
}