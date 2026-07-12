"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";

export default function GamesPage() {
  const { lastGesture, speak } = useApp();
  const [activeTab, setActiveTab] = useState<"guess" | "hill">("guess");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Guessing game states
  const [targetNumber, setTargetNumber] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [currentGuess, setCurrentGuess] = useState(5);
  const [guessHistory, setGuessHistory] = useState<string[]>([]);
  const [guessResult, setGuessResult] = useState("");
  const [guessScore, setGuessScore] = useState({ tries: 0, wins: 0 });
  const [isScanning, setIsScanning] = useState(false);

  const handleGuessSubmit = (guessVal: number) => {
    if (isScanning) return;
    setIsScanning(true);
    setGuessResult("ANALYZING NEURAL PATTERNS...");
    
    setTimeout(() => {
      setIsScanning(false);
      setGuessScore((prev) => ({ ...prev, tries: prev.tries + 1 }));
      if (guessVal === targetNumber) {
        setGuessResult(`CORRECT. TARGET ACQUIRED: ${targetNumber}`);
        speak(`Excellent! You guessed it right. The number was indeed ${targetNumber}.`);
        setGuessScore((prev) => ({ ...prev, wins: prev.wins + 1 }));
        setGuessHistory((prev) => [`Tried ${guessVal} - WON! 🎉`, ...prev]);
        setTimeout(() => {
          setTargetNumber(Math.floor(Math.random() * 10) + 1);
          setCurrentGuess(5);
          setGuessResult("NEW TARGET SEQUENCE GENERATED.");
        }, 3000);
      } else if (guessVal < targetNumber) {
        setGuessResult("TOO LOW. UPWARD CALIBRATION REQUIRED.");
        speak("Too low.");
        setGuessHistory((prev) => [`Tried ${guessVal} - Too Low`, ...prev]);
      } else {
        setGuessResult("TOO HIGH. DOWNWARD CALIBRATION REQUIRED.");
        speak("Too high.");
        setGuessHistory((prev) => [`Tried ${guessVal} - Too High`, ...prev]);
      }
    }, 1200);
  };

  // JARVIS Flight Dashboard Game States
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameScore, setGameScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lastActionText, setLastActionText] = useState("AWAITING COMMAND");

  // Keep refs of state parameters for requestAnimationFrame loops
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);
  const gameOverRef = useRef(false);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  // Expose real-time gestures to requestAnimationFrame loop via mutable ref
  const lastGestureRef = useRef<string | null>(null);
  useEffect(() => {
    lastGestureRef.current = lastGesture;
    if (lastGesture) {
      const g = lastGesture.toLowerCase();
      // Handle in-game commands
      if (isPlayingRef.current && !isPausedRef.current && !gameOverRef.current) {
        if (g.includes("point") || g.includes("pointing") || g.includes("one")) {
          setLastActionText("THRUST INITIATED (1 FINGER)");
        } else if (g.includes("fist")) {
          setLastActionText("BRAKE ENGAGED (FIST)");
        } else if (g.includes("pinch")) {
          setLastActionText("JUMP THRUSTER (PINCH)");
        }
      }
      // Handle out-of-game gesture triggers
      if (g.includes("thumb") || g.includes("resume") || g.includes("good")) {
        if (isPausedRef.current) {
          handleGameControl("resume");
        }
      }
    }
  }, [lastGesture]);

  // Mutable physics simulation variables
  const simRef = useRef({
    carX: 70,
    carY: 220,
    carVelX: 0,
    carVelY: 0,
    angle: 0,
    distance: 0,
    fuel: 100
  });

  const getTerrainHeight = (x: number) => {
    // Generate futuristic neon grid hills and valleys using sine waves
    return 290 + Math.sin(x * 0.004) * 45 + Math.cos(x * 0.012) * 20;
  };

  const handleAction = (action: "gas" | "brake" | "jump") => {
    if (!isPlayingRef.current || isPausedRef.current || gameOverRef.current) return;
    const sim = simRef.current;
    if (action === "gas") {
      sim.carVelX = Math.min(2.5, sim.carVelX + 0.06);
      sim.fuel = Math.max(0, sim.fuel - 0.18);
    } else if (action === "brake") {
      sim.carVelX = Math.max(0, sim.carVelX - 0.35);
    } else if (action === "jump") {
      const groundY = getTerrainHeight(sim.distance + sim.carX);
      if (sim.carY >= groundY - 12) {
        sim.carVelY = -7.0;
        triggerJumpBeep();
      }
    }
  };

  // Sound Synthesizers for futuristic JARVIS sound effects
  const triggerJumpBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(330, now); // E4
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  };

  const triggerCoinBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(783.99, now); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.08); // C6
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {}
  };

  const triggerFuelBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {}
  };

  // Game action triggers dispatch controller
  const handleGameControl = (action: "start" | "pause" | "resume" | "restart" | "exit") => {
    if (action === "start") {
      simRef.current = {
        carX: 70,
        carY: 220,
        carVelX: 1.5,
        carVelY: 0,
        angle: 0,
        distance: 0,
        fuel: 100
      };
      setGameOver(false);
      setIsPaused(false);
      setIsPlaying(true);
      setLastActionText("SYSTEM INITIATED");
      speak("JARVIS system checks complete. Drive safely.");
    } else if (action === "pause") {
      setIsPaused(true);
      setLastActionText("GAME PAUSED");
      speak("Game paused.");
    } else if (action === "resume") {
      setIsPaused(false);
      setLastActionText("GAME RESUMED");
      speak("Game resumed.");
    } else if (action === "restart") {
      simRef.current = {
        carX: 70,
        carY: 220,
        carVelX: 1.5,
        carVelY: 0,
        angle: 0,
        distance: 0,
        fuel: 100
      };
      setGameOver(false);
      setIsPaused(false);
      setIsPlaying(true);
      setLastActionText("REBOOTING ENGINE");
      speak("System rebooted.");
    } else if (action === "exit") {
      setIsPlaying(false);
      setIsPaused(false);
      setGameOver(false);
      setLastActionText("DISCONNECTED");
      speak("Exiting terminal.");
    }
  };

  // Listen for voice commands dispatched via dispatchEvent
  useEffect(() => {
    const handleVoiceCommand = (e: Event) => {
      const customEvent = e as CustomEvent;
      const action = customEvent.detail.action;
      if (action) {
        handleGameControl(action);
      }
    };
    window.addEventListener("jarvis-game-control", handleVoiceCommand);
    return () => window.removeEventListener("jarvis-game-control", handleVoiceCommand);
  }, []);

  // Process game rendering loop
  useEffect(() => {
    if (activeTab !== "hill" || !isPlaying || gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Define mutable tracking variables for dynamic collectibles & particles
    const sim = simRef.current;
    
    // Seed initial coordinates relative to start line
    let coinsList: { x: number; collected: boolean }[] = [];
    let particlesList: { x: number; y: number; vx: number; vy: number; color: string; life: number }[] = [];
    let bubbleList: { x: number; y: number; radius: number; speed: number }[] = [];

    // Pre-populate background bubbles
    for (let b = 0; b < 15; b++) {
      bubbleList.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 3 + Math.random() * 8,
        speed: 0.3 + Math.random() * 0.6
      });
    }

    // Pre-populate coordinates
    for (let offset = 450; offset < 5000; offset += 350) {
      coinsList.push({ x: offset, collected: false });
      coinsList.push({ x: offset + 55, collected: false });
    }

    const updateGame = () => {
      // Allow physics variables updates to freeze but execute the draw scene pipeline
      const sim = simRef.current;
      const playerForwardX = sim.distance + canvas.width;

      if (!isPausedRef.current) {
        // Seed items dynamically as distance grows
        const lastCoin = coinsList[coinsList.length - 1];
        if (lastCoin && lastCoin.x < playerForwardX + 1200) {
          const nextStartOffset = lastCoin.x + 350;
          for (let offset = nextStartOffset; offset < nextStartOffset + 2000; offset += 350) {
            coinsList.push({ x: offset, collected: false });
            coinsList.push({ x: offset + 55, collected: false });
          }
        }

        // Check camera gesture inputs
        if (lastGestureRef.current) {
          const activeGesture = lastGestureRef.current.toLowerCase();
          if (activeGesture.includes("point") || activeGesture.includes("pointing") || activeGesture.includes("one")) {
            handleAction("gas");
          } else if (activeGesture.includes("fist")) {
            handleAction("brake");
          } else if (activeGesture.includes("pinch")) {
            handleAction("jump");
          }
        }

        // Physics variables update
        sim.carVelX *= 0.988; // air drag
        sim.carVelY += 0.20; // gravity
        sim.distance += sim.carVelX;
        sim.carY += sim.carVelY;



        const groundY = getTerrainHeight(sim.distance + sim.carX);

        // Terrain limits collision check
        if (sim.carY >= groundY) {
          sim.carY = groundY;
          sim.carVelY = 0;
          const nextGroundY = getTerrainHeight(sim.distance + sim.carX + 20);
          sim.angle = Math.atan2(nextGroundY - groundY, 20);
        } else {
          sim.angle += 0.012; // slow air rotation
        }

        // Slope check crash condition
        if (Math.abs(sim.angle) > 1.35) {
          setGameOver(true);
          speak("Stabilizer failure! Crash detected.");
          setIsPlaying(false);
        }

        // Hit testing collections
        coinsList.forEach(coin => {
          const coinY = getTerrainHeight(coin.x) - 18;
          if (!coin.collected && Math.abs((sim.distance + sim.carX) - coin.x) < 26 && Math.abs(sim.carY - coinY) < 32) {
            coin.collected = true;
            triggerCoinBeep();
            setGameScore((prev) => prev + 50);

            // Spawn cyan digital sparkles on coin pickup
            for (let p = 0; p < 8; p++) {
              particlesList.push({
                x: coin.x,
                y: coinY,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5 - 2,
                color: "rgba(0, 243, 255, 0.8)", // Cyber Cyan glow
                life: 25
              });
            }
          }
        });

        // Update active particles positions
        particlesList.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.08; // light gravity on digital sparkles
          p.life--;
        });
        particlesList = particlesList.filter(p => p.life > 0);

        // Distance score increment
        setGameScore((prev) => prev + Math.floor(sim.carVelX / 12));
      }

      // Draw loop operations
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Sky (Bright Cartoon Sky)
      ctx.fillStyle = "#a1e5ff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Sun
      ctx.beginPath();
      ctx.fillStyle = "#ffe54c";
      ctx.arc(45, 45, 20, 0, Math.PI * 2);
      ctx.fill();

      // Draw Cartoon Puffy Clouds
      ctx.fillStyle = "#ffffff";
      const drawCloud = (cx: number, cy: number) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 15, 0, Math.PI * 2);
        ctx.arc(cx + 15, cy - 8, 18, 0, Math.PI * 2);
        ctx.arc(cx + 30, cy, 15, 0, Math.PI * 2);
        ctx.fill();
      };
      const cloudOffset = (sim.distance * 0.08) % (canvas.width + 120);
      drawCloud(canvas.width - cloudOffset, 40);
      drawCloud(canvas.width - cloudOffset + 240, 60);

      // Draw floating background bubbles
      bubbleList.forEach(b => {
        // Move bubbles upward
        if (!isPausedRef.current) {
          b.y -= b.speed;
          if (b.y < -20) {
            b.y = canvas.height + 20;
            b.x = Math.random() * canvas.width;
          }
        }
        // Draw bubble circles with white reflection highlights
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // reflection highlight dot
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Parallax Faraway Pine Trees (Green Triangles)
      ctx.fillStyle = "#4a8505";
      for (let i = 0; i < canvas.width; i += 90) {
        const treeX = i - (sim.distance * 0.25) % 130;
        const groundHeight = getTerrainHeight(sim.distance + treeX);
        ctx.beginPath();
        ctx.moveTo(treeX, groundHeight);
        ctx.lineTo(treeX - 12, groundHeight - 25);
        ctx.lineTo(treeX + 12, groundHeight - 25);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(treeX, groundHeight - 12);
        ctx.lineTo(treeX - 10, groundHeight - 32);
        ctx.lineTo(treeX + 10, groundHeight - 32);
        ctx.fill();
      }

      // Draw Soil Hill Layer (Orange-brown soil underneath)
      ctx.beginPath();
      ctx.fillStyle = "#8a5734";
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x < canvas.width; x += 5) {
        const h = getTerrainHeight(sim.distance + x);
        ctx.lineTo(x, h);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fill();

      // Draw Grass Top Layer (Bright Lime Green Grass)
      ctx.beginPath();
      ctx.strokeStyle = "#5aa50b";
      ctx.lineWidth = 8;
      for (let x = 0; x < canvas.width; x += 5) {
        const h = getTerrainHeight(sim.distance + x);
        if (x === 0) ctx.moveTo(x, h);
        else ctx.lineTo(x, h);
      }
      ctx.stroke();

      // Draw Collectible Coins (Holographic Gold rings)
      coinsList.forEach(coin => {
        const screenX = coin.x - sim.distance;
        const coinY = getTerrainHeight(coin.x) - 18;
        if (screenX > -20 && screenX < canvas.width + 20 && !coin.collected) {
          ctx.beginPath();
          ctx.fillStyle = "#fcd116";
          ctx.arc(screenX, coinY, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#d4af37";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          
          // Inner detail
          ctx.beginPath();
          ctx.arc(screenX, coinY, 4, 0, Math.PI * 2);
          ctx.stroke();
        }
      });



      // Draw Sparkles / Explosion Particles
      particlesList.forEach(p => {
        const screenX = p.x - sim.distance;
        if (screenX > -10 && screenX < canvas.width + 10) {
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.arc(screenX, p.y, Math.max(1, p.life / 6), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Vehicle HUD status widgets (Speedometer dials and dashboard metrics)
      const drawHUDGauge = (gx: number, gy: number, label: string, val: number, maxVal: number, color = "#00f3ff") => {
        // Holographic dial arcs
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,0,0,0.15)";
        ctx.lineWidth = 3;
        ctx.arc(gx, gy, 26, -Math.PI * 0.8, Math.PI * 0.8);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = color;
        const percent = Math.min(1, Math.max(0, val / maxVal));
        ctx.arc(gx, gy, 26, -Math.PI * 0.8, -Math.PI * 0.8 + (percent * Math.PI * 1.6));
        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.font = "bold 8px monospace";
        ctx.textAlign = "center";
        ctx.fillText(label, gx, gy + 5);
        ctx.fillText(String(Math.floor(val)), gx, gy - 4);
      };

      drawHUDGauge(canvas.width - 90, 50, "THRUST", sim.carVelX * 20, 150, "#c0392b");

      // Vehicle Chassis graphics (Futuristic Iron Man themed Flight Vehicle with Bouncing 3D-Suspension)
      ctx.save();
      
      // Calculate real-time suspension compression based on car vertical velocity
      const suspensionCompression = Math.max(-5, Math.min(6, sim.carVelY * 0.9));
      
      ctx.translate(sim.carX, sim.carY - 14 + suspensionCompression * 0.4);
      
      const dynamicTilt = sim.angle + (sim.carVelY * 0.05);
      ctx.rotate(dynamicTilt);

      // Render 3.5D Cel-Shaded Suspension Springs (Iron Man Gold Springs connecting body to wheels)
      const drawSuspensionSpring = (sx: number, sy: number) => {
        ctx.strokeStyle = "var(--peach)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        // Zig-zag springs
        ctx.moveTo(sx, sy - 8);
        ctx.lineTo(sx - 3, sy - 4);
        ctx.lineTo(sx + 3, sy);
        ctx.lineTo(sx - 3, sy + 4);
        ctx.lineTo(sx, sy + 8);
        ctx.stroke();
      };
      
      drawSuspensionSpring(-12, 0);
      drawSuspensionSpring(12, 0);

      // Jeep Red Chassis Body
      ctx.fillStyle = "#d35400"; // Orange-red bottom
      ctx.fillRect(-18, -2, 36, 4);
      ctx.fillStyle = "#c0392b"; // Jeep red body
      ctx.fillRect(-18, -8, 36, 6);
      
      // Draw windshield frame
      ctx.strokeStyle = "#2c3e50";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(6, -8);
      ctx.lineTo(12, -18);
      ctx.stroke();

      // Draw Bill Newton (Driver wearing Green Cap)
      // Body (blue shirt)
      ctx.fillStyle = "#3498db";
      ctx.fillRect(-6, -15, 8, 8);
      // Head
      ctx.beginPath();
      ctx.fillStyle = "#fddcac"; // skin tone
      ctx.arc(-2, -19, 5, 0, Math.PI * 2);
      ctx.fill();
      // Green Cap
      ctx.fillStyle = "#27ae60";
      ctx.fillRect(-7, -25, 10, 3); // bill
      ctx.beginPath();
      ctx.arc(-3, -22, 4, Math.PI, 0);
      ctx.fill();

      // Rollbar
      ctx.strokeStyle = "#34495e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-15, -8);
      ctx.lineTo(-11, -17);
      ctx.lineTo(-2, -8);
      ctx.stroke();

      // Back engine thruster fire effects (plasma tail)
      if (sim.carVelX > 1.2) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(254, 208, 187, 0.8)";
        ctx.moveTo(-20, -2);
        ctx.lineTo(-35 - (Math.random() * 12), 0);
        ctx.lineTo(-20, 2);
        ctx.fill();
      }

      // Digital blue spokes wheels (bouncing dynamically with suspension compression)
      const rotationAngle = (sim.distance * 0.05) % (Math.PI * 2);
      const drawDigitalWheel = (wx: number, wy: number) => {
        ctx.save();
        ctx.translate(wx, wy + suspensionCompression * 0.6);
        ctx.rotate(rotationAngle);
        
        // Tire outer ring
        ctx.beginPath();
        ctx.fillStyle = "#2c3e50";
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();

        // Rim inner ring
        ctx.beginPath();
        ctx.fillStyle = "#f1c40f";
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        // Rim spokes detail
        ctx.strokeStyle = "#34495e";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-8, 0); ctx.lineTo(8, 0);
        ctx.moveTo(0, -8); ctx.lineTo(0, 8);
        ctx.stroke();

        ctx.restore();
      };
      
      drawDigitalWheel(-12, 4);
      drawDigitalWheel(12, 4);

      ctx.restore();

      // Draw Glassmorphism Pause Overlay on top of visible canvas scene
      if (isPausedRef.current) {
        // Frosted glassmorphism background overlay (no black screen)
        ctx.fillStyle = "rgba(17, 5, 14, 0.4)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Double overlay to simulate glass reflections
        ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
        ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);

        // Draw Holographic Glass Border
        ctx.strokeStyle = "rgba(254, 208, 187, 0.15)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        // Draw Classic Pause Symbol (two vertical bars)
        ctx.fillStyle = "rgba(254, 208, 187, 0.85)";
        ctx.fillRect(canvas.width / 2 - 14, canvas.height / 2 - 35, 8, 25);
        ctx.fillRect(canvas.width / 2 + 6, canvas.height / 2 - 35, 8, 25);

        // Suspension/Status Text
        ctx.fillStyle = "var(--peach)";
        ctx.font = "bold 14px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME PAUSED", canvas.width / 2, canvas.height / 2 + 15);
      }

      animationFrameId = requestAnimationFrame(updateGame);
    };

    updateGame();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab, isPlaying, gameOver]);

  if (!mounted) return null;

  return (
    <section className="view active" id="view-games">
      <div className="view-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
        <div>
          
          <h1 className="view-title">Games</h1>
          <div className="view-sub">Play JARVIS mini-games with gesture controls.</div>
        </div>

        {/* Switch tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
          <button
            className={`btn ${activeTab === "guess" ? "btn-accent" : "btn-ghost"}`}
            onClick={() => setActiveTab("guess")}
          >
            JARVIS Mind Reader
          </button>
          <button
            className={`btn ${activeTab === "hill" ? "btn-accent" : "btn-ghost"}`}
            onClick={() => setActiveTab("hill")}
          >
            JARVIS Hill Climb
          </button>
        </div>
      </div>

      {activeTab === "guess" ? (
        <div className="cap-card reveal" style={{ textAlign: "center", margin: "0 auto", maxWidth: "600px" }}>
          <div className="game-hud-bg-matrix"></div>
          <div className="game-hud-scanlines"></div>
          
          
         
          
          <h3>JARVIS Mind Reader</h3>
          <div className="jarvis-scanning-video-wrap">
            <div className="jarvis-video-ring-outer"></div>
            <div className="jarvis-video-ring-inner"></div>
            <div className="jarvis-video-radar-sweep"></div>
            <div className="jarvis-video-status-text">SYSTEM SCANNING ACTIVE...</div>
          </div>
          <p style={{ fontSize: "12px", color: "var(--txt-mid)", marginBottom: "20px" }}>
            JARVIS has chosen a number from 1 to 10. Can you guess it?
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", margin: "32px 0" }}>
            <button
              className="btn btn-ghost"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "50px", height: "50px", borderRadius: "14px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}
              onClick={() => !isScanning && setCurrentGuess((prev) => Math.max(1, prev - 1))}
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" width="24" height="24">
                <path d="M20 12H4" />
              </svg>
            </button>

            <div style={{ background: "rgba(0,0,0,0.6)", border: "1px solid var(--peach)", borderRadius: "20px", width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(254, 208, 187, 0.2)" }}>
              <span className="guess-number-display" style={{ fontSize: "56px", fontWeight: "700", color: "#fff", transition: "all 0.3s ease", opacity: isScanning ? 0.4 : 1, transform: isScanning ? "scale(0.9)" : "scale(1)", textShadow: "0 0 10px rgba(255,255,255,0.5)" }}>
                {currentGuess}
              </span>
            </div>

            <button
              className="btn btn-ghost"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "50px", height: "50px", borderRadius: "14px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}
              onClick={() => !isScanning && setCurrentGuess((prev) => Math.min(10, prev + 1))}
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" width="24" height="24">
                <path d="M12 4v16M4 12h16" />
              </svg>
            </button>
          </div>

          <div style={{ color: "var(--peach)", fontSize: "14px", fontWeight: "600", minHeight: "40px", marginBottom: "20px", transition: "opacity 0.2s", opacity: isScanning ? 0.7 : 1, animation: isScanning ? "pulse 1s infinite" : "none" }}>
            {guessResult}
          </div>

          <button
            className="btn btn-accent"
            onClick={() => handleGuessSubmit(currentGuess)}
            style={{ padding: "14px 32px", borderRadius: "16px", opacity: isScanning ? 0.6 : 1, pointerEvents: isScanning ? "none" : "auto", fontSize: "14px", letterSpacing: "1px" }}
          >
            {isScanning ? "SCANNING..." : "SUBMIT GUESS"}
          </button>

          <div className="rps-score" style={{ marginTop: "24px" }}>
            <span>
              TRIES <b style={{ color: "var(--peach)" }}>{guessScore.tries}</b>
            </span>
            <span>
              WINS <b style={{ color: "#4ade80" }}>{guessScore.wins}</b>
            </span>
          </div>

          {guessHistory.length > 0 && (
            <div style={{ marginTop: "24px", textAlign: "left", background: "rgba(0,0,0,0.2)", borderRadius: "12px", padding: "12px" }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--txt-faint)", marginBottom: "8px" }}>
                Guess History
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "12px", maxHeight: "100px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
                {guessHistory.slice(0, 5).map((hist, idx) => (
                  <li key={idx} style={{ color: hist.includes("WON") ? "#4ade80" : "var(--txt-mid)" }}>
                    {hist}
                  </li>
                ))}
              </ul>
            </div>
          )}


        </div>
      ) : (
        <div className="panel brackets game-panel-match" style={{ padding: "24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div className="game-hud-bg-matrix"></div>
          <div className="game-hud-scanlines"></div>
          
          


          {/* Game Menu (Top) */}
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
            <button className="btn btn-ghost" style={{ fontSize: "13px", borderRadius: "8px", padding: "12px 20px" }} onClick={() => handleGameControl("restart")}>
              RESTART
            </button>
            <button className="btn btn-ghost" style={{ fontSize: "13px", borderRadius: "8px", padding: "12px 20px" }} onClick={() => handleGameControl(isPaused ? "resume" : "pause")}>
              {isPaused ? "RESUME" : "PAUSE"}
            </button>
            <button className="btn btn-accent" style={{ fontSize: "13px", borderRadius: "8px", padding: "12px 20px" }} onClick={() => handleGameControl("exit")}>
              EXIT GAME
            </button>
          </div>

          {/* Flex wrapper for canvas and side buttons */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "24px", flexWrap: "wrap", width: "100%" }}>

            {/* Sizable Canvas container overlaying GESTURE.AI project theme */}
            <div style={{ position: "relative", display: "inline-block", border: "1px solid rgba(254, 208, 187, 0.15)", borderRadius: "16px", overflow: "hidden", background: "#11050e", width: "100%", maxWidth: "800px", flex: "1 1 800px" }}>
              <canvas ref={canvasRef} width="800" height="380" style={{ width: "100%", height: "auto", display: "block" }} />
              {(!isPlaying || gameOver) && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(17,5,14,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
                  <div style={{ fontSize: "18px", color: "var(--peach)", fontWeight: "700", marginBottom: "12px", letterSpacing: "1.5px" }}>
                    {gameOver ? "CRASH DETECTED!" : "READY TO DRIVE"}
                  </div>
                  <button className="btn btn-accent" onClick={() => handleGameControl("start")}>
                    {gameOver ? "RESTART GAME" : "START GAME"}
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Manual Play Controls (Below Canvas) */}
          <div style={{ display: "flex", justifyContent: "center", padding: "16px 0", width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "row", gap: "8px", background: "rgba(0,0,0,0.3)", padding: "8px 16px", borderRadius: "12px" }}>
              <button className="btn btn-ghost" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", borderRadius: "8px", userSelect: "none" }} onPointerDown={() => lastGestureRef.current = "fist"} onPointerUp={() => lastGestureRef.current = ""} onPointerLeave={() => lastGestureRef.current = ""}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" width="20" height="20">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="btn btn-ghost" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", borderRadius: "8px", userSelect: "none" }} onPointerDown={() => lastGestureRef.current = "pinch"} onPointerUp={() => lastGestureRef.current = ""} onPointerLeave={() => lastGestureRef.current = ""}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" width="20" height="20">
                  <rect x="5" y="5" width="14" height="14" rx="2" ry="2" />
                </svg>
              </button>
              <button className="btn btn-ghost" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", borderRadius: "8px", userSelect: "none" }} onPointerDown={() => lastGestureRef.current = "one"} onPointerUp={() => lastGestureRef.current = ""} onPointerLeave={() => lastGestureRef.current = ""}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" width="20" height="20">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>



        </div>
      )}

      {/* Standalone Gesture Info Box */}
      {activeTab === "hill" && (
        <div className="cap-card" style={{ marginTop: "24px", maxWidth: "800px", marginLeft: "auto", marginRight: "auto", padding: "20px" }}>
          <div style={{ fontSize: "11px", color: "var(--txt-faint)", textAlign: "center", marginBottom: "12px", letterSpacing: "2px", fontWeight: "600", textTransform: "uppercase" }}>
            Gesture Drive Controls
          </div>
          <div style={{ fontSize: "12px", color: "var(--txt-mid)", textAlign: "center", marginBottom: "16px", lineHeight: "1.6" }}>
            Enable your camera and position your hand clearly in frame. <br/>
            Hold up your hand to the screen and use the following gestures to control the vehicle using AI tracking.
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", flex: "1 1 140px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>☝️</div>
                <div style={{ fontSize: "12px", color: "var(--txt-mid)", marginBottom: "4px" }}>1 Finger:</div>
                <b style={{ fontSize: "15px", color: "var(--txt-bright)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>Gas</b>
              </div>
              <div style={{ fontSize: "10px", color: "var(--txt-faint)", marginTop: "auto" }}>Accelerate forward</div>
            </div>
            
            <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", flex: "1 1 140px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>✊</div>
                <div style={{ fontSize: "12px", color: "var(--txt-mid)", marginBottom: "4px" }}>Fist:</div>
                <b style={{ fontSize: "15px", color: "var(--txt-bright)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>Brake</b>
              </div>
              <div style={{ fontSize: "10px", color: "var(--txt-faint)", marginTop: "auto" }}>Slow down</div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", flex: "1 1 140px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>🤏</div>
                <div style={{ fontSize: "12px", color: "var(--txt-mid)", marginBottom: "4px" }}>Pinch:</div>
                <b style={{ fontSize: "15px", color: "var(--txt-bright)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>Jump</b>
              </div>
              <div style={{ fontSize: "10px", color: "var(--txt-faint)", marginTop: "auto" }}>Leap over obstacles</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
