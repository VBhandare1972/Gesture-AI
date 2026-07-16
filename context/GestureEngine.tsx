"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Landmark { x: number; y: number; z: number; }
interface HistoryFrame { wrist: { x: number; y: number }; gesture: string; time: number; }
interface GestureCursor { x: number; y: number; show: boolean; pinched: boolean; }
interface Ripple { id: number; x: number; y: number; }

export interface GestureEngineResult {
  gestureLabel: string;
  gestureCursor: GestureCursor;
  ripples: Ripple[];
  gestureConfidencePct: number;
  recentGestures: string[];
  enableGestureCamera: (videoEl: HTMLVideoElement, canvasEl: HTMLCanvasElement) => Promise<void>;
  disableGestureCamera: () => void;
  stopCameraOnly: () => void;
  lastGesture: string | null;
}

const VIEW_ORDER = ["/", "/draw", "/music", "/weather", "/games", "/notes", "/calc", "/settings"];

const GESTURE_LABELS: Record<string, string> = {
  pinch:        "Pinch -- Click",
  double_pinch: "Double Pinch -- Double Click",
  long_press:   "Long Press",
  drag:         "Drag",
  point:        "Point -- Aim",
  peace:        "Peace -- Next Page",
  open_palm:    "Open Palm -- Home",
  fist:         "Fist -- Scroll",
  three_fingers:"Three Fingers -- Chat",
  swipe_left:   "Swipe Left -- Back",
  swipe_right:  "Swipe Right -- Forward",
  swipe_up:     "Swipe Up",
  swipe_down:   "Swipe Down",
  other:        "Tracking...",
};

const COOLDOWNS: Record<string, number> = {
  click:         700,
  double_click:  400,
  long_press:   1500,
  swipe_left:    900,
  swipe_right:   900,
  swipe_up:      900,
  swipe_down:    900,
  scroll:         80,
  navigate_home: 1200,
  navigate_next: 1000,
  open_chat:     1500,
};

export function useGestureEngine(
  sensitivity: number,
  pathname: string,
  showToast: (msg: string) => void,
  playNext?: () => void,
  playPrev?: () => void,
  setChatOpen?: (open: boolean) => void,
): GestureEngineResult {
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const [gestureLabel, setGestureLabel] = useState("No hand detected");
  const [gestureCursor, setGestureCursor] = useState<GestureCursor>({ x: 0, y: 0, show: false, pinched: false });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [gestureConfidencePct, setGestureConfidencePct] = useState(0);
  const [recentGestures, setRecentGestures] = useState<string[]>([]);
  const [lastGesture, setLastGesture] = useState<string | null>(null);

  const cameraRef = useRef<any>(null);
  const handsRef = useRef<any>(null);
  const smoothedLM = useRef<Landmark[] | null>(null);
  const historyBuf = useRef<HistoryFrame[]>([]);
  const HISTORY_SIZE = 20;
  const confidenceRef = useRef<{ gesture: string; count: number }>({ gesture: "", count: 0 });
  const cooldownMap = useRef<Map<string, number>>(new Map());
  const lastPinchTime = useRef<number>(0);
  const pinchHoldStart = useRef<number | null>(null);
  const longPressTriggered = useRef(false);
  const dragState = useRef<{ active: boolean; el: Element | null; lastX: number; lastY: number }>({ active: false, el: null, lastX: 0, lastY: 0 });
  const hoverRef = useRef<{ el: Element | null; startTime: number | null }>({ el: null, startTime: null });
  const lastScrollY = useRef<number | null>(null);
  const recentGesturesRef = useRef<string[]>([]);

  const sensitivityRef = useRef(sensitivity);
  sensitivityRef.current = sensitivity;

  const canTrigger = useCallback((action: string) => {
    const now = Date.now();
    const last = cooldownMap.current.get(action) ?? 0;
    return now - last > (COOLDOWNS[action] ?? 700);
  }, []);

  const markTriggered = useCallback((action: string) => {
    cooldownMap.current.set(action, Date.now());
  }, []);

  const addRecentGesture = useCallback((g: string) => {
    recentGesturesRef.current = [g, ...recentGesturesRef.current].slice(0, 4);
    setRecentGestures([...recentGesturesRef.current]);
  }, []);

  const getThresholds = useCallback(() => {
    const s = sensitivityRef.current;
    return {
      pinchThreshold: 0.03 + (s / 10) * 0.05,
      emaAlpha:       0.45 + (s / 10) * 0.40,
      confirmFrames:  Math.max(2, 6 - Math.floor(s / 2.5)),
      swipeVelocity:  0.50 - (s / 10) * 0.25,
      scrollSpeed:    600 + (s / 10) * 800,
      hoverDwellMs:   1800 - (s / 10) * 900,
    };
  }, []);

  const smoothLandmarks = useCallback((raw: Landmark[]): Landmark[] => {
    const alpha = getThresholds().emaAlpha;
    if (!smoothedLM.current || smoothedLM.current.length !== raw.length) {
      smoothedLM.current = raw.map(r => ({ ...r }));
      return smoothedLM.current;
    }
    smoothedLM.current = raw.map((r, i) => ({
      x: alpha * r.x + (1 - alpha) * smoothedLM.current![i].x,
      y: alpha * r.y + (1 - alpha) * smoothedLM.current![i].y,
      z: alpha * r.z + (1 - alpha) * smoothedLM.current![i].z,
    }));
    return smoothedLM.current;
  }, [getThresholds]);

  const detectSwipe = useCallback((): string | null => {
    const hist = historyBuf.current;
    if (hist.length < 8) return null;
    const recent = hist.slice(-8);
    const dt = recent[7].time - recent[0].time;
    if (dt < 50) return null;
    const dx = recent[7].wrist.x - recent[0].wrist.x;
    const dy = recent[7].wrist.y - recent[0].wrist.y;
    const vx = (dx / dt) * 1000;
    const vy = (dy / dt) * 1000;
    const thresh = getThresholds().swipeVelocity;
    if (Math.abs(vx) > Math.abs(vy) && Math.abs(vx) > thresh) {
      return vx > 0 ? "swipe_left" : "swipe_right";
    }
    if (Math.abs(vy) > Math.abs(vx) && Math.abs(vy) > thresh) {
      return vy > 0 ? "swipe_down" : "swipe_up";
    }
    return null;
  }, [getThresholds]);

  const spawnRipple = useCallback((x: number, y: number) => {
    const id = Date.now();
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 550);
  }, []);

  const clickAt = useCallback((x: number, y: number) => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    if (el && typeof el.click === "function") {
      spawnRipple(x, y);
      el.click();
    }
  }, [spawnRipple]);

  const showToastRef = useRef(showToast);
  showToastRef.current = showToast;
  const playNextRef = useRef(playNext);
  playNextRef.current = playNext;
  const playPrevRef = useRef(playPrev);
  playPrevRef.current = playPrev;
  const setChatOpenRef = useRef(setChatOpen);
  setChatOpenRef.current = setChatOpen;

  const onHandResults = useCallback((results: any, canvasEl: HTMLCanvasElement) => {
    if (!canvasEl) return;
    if (canvasEl.width !== canvasEl.clientWidth) {
      canvasEl.width = canvasEl.clientWidth || 220;
      canvasEl.height = canvasEl.clientHeight || 165;
    }
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    const now = Date.now();
    const currentPath = pathnameRef.current;
    const thresh = getThresholds();

    if (!results.multiHandLandmarks?.length) {
      smoothedLM.current = null;
      historyBuf.current = [];
      confidenceRef.current = { gesture: "", count: 0 };
      pinchHoldStart.current = null;
      longPressTriggered.current = false;
      lastScrollY.current = null;
      hoverRef.current = { el: null, startTime: null };
      if (dragState.current.active && dragState.current.el) {
        (dragState.current.el as HTMLElement).dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
        dragState.current = { active: false, el: null, lastX: 0, lastY: 0 };
      }
      setGestureLabel("No hand detected");
      setGestureCursor(prev => ({ ...prev, show: false }));
      setGestureConfidencePct(0);
      if (currentPath === "/draw") window.dispatchEvent(new CustomEvent("gesture-draw-end"));
      ctx.restore();
      return;
    }

    const rawLM: Landmark[] = results.multiHandLandmarks[0];
    const lm = smoothLandmarks(rawLM);

    try {
      if ((window as any).drawConnectors)
        (window as any).drawConnectors(ctx, lm, (window as any).HAND_CONNECTIONS, { color: "#b23a48", lineWidth: 2 });
      if ((window as any).drawLandmarks)
        (window as any).drawLandmarks(ctx, lm, { color: "#fed0bb", lineWidth: 1, radius: 2.2 });
    } catch (_) {}

    const wrist = lm[0];
    const dist = (a: Landmark, b: Landmark) => Math.hypot(a.x - b.x, a.y - b.y);
    const extended = (tip: number, pip: number) => dist(lm[tip], wrist) > dist(lm[pip], wrist) * 1.1;

    const indexExt  = extended(8, 6);
    const middleExt = extended(12, 10);
    const ringExt   = extended(16, 14);
    const pinkyExt  = extended(20, 18);
    const thumbExt  = dist(lm[4], lm[17]) > dist(lm[2], lm[17]) * 1.05;
    const extCount  = [thumbExt, indexExt, middleExt, ringExt, pinkyExt].filter(Boolean).length;

    const thumbUp   = thumbExt && lm[4].y < lm[2].y && !indexExt && !middleExt;
    const thumbDown = thumbExt && lm[4].y > lm[2].y && !indexExt && !middleExt;

    const pinchDist = dist(lm[4], lm[8]);
    const pinching  = pinchDist < thresh.pinchThreshold;

    let rawGesture = "other";
    if (pinching)                                           rawGesture = "pinch";
    else if (indexExt && middleExt && ringExt && !pinkyExt) rawGesture = "three_fingers";
    else if (indexExt && !middleExt && !ringExt && !pinkyExt) rawGesture = "point";
    else if (indexExt && middleExt && !ringExt && !pinkyExt)  rawGesture = "peace";
    else if (extCount >= 4)                                  rawGesture = "open_palm";
    else if (extCount <= 1 && !indexExt)                     rawGesture = "fist";

    const conf = confidenceRef.current;
    if (rawGesture === conf.gesture) {
      conf.count = Math.min(conf.count + 1, thresh.confirmFrames);
    } else {
      conf.gesture = rawGesture;
      conf.count = 1;
    }
    const confirmed = conf.count >= thresh.confirmFrames;
    setGestureConfidencePct(Math.round((conf.count / thresh.confirmFrames) * 100));

    const vx = (1 - lm[8].x) * window.innerWidth;
    const vy = lm[8].y * window.innerHeight;
    setGestureCursor({ x: vx, y: vy, show: true, pinched: pinching });

    historyBuf.current.push({ wrist: { x: lm[0].x, y: lm[0].y }, gesture: rawGesture, time: now });
    if (historyBuf.current.length > HISTORY_SIZE) historyBuf.current.shift();

    if (currentPath === "/draw") {
      window.dispatchEvent(new CustomEvent("gesture-draw", { detail: { x: vx, y: vy, pinching } }));
    }

    setGestureLabel(GESTURE_LABELS[rawGesture] ?? "Tracking...");
    setLastGesture(GESTURE_LABELS[rawGesture] ?? null);

    if (!confirmed) { ctx.restore(); return; }

    // Swipe
    if (rawGesture === "fist" || rawGesture === "point") {
      const swipe = detectSwipe();
      if (swipe && canTrigger(swipe)) {
        markTriggered(swipe);
        addRecentGesture(swipe);
        historyBuf.current = [];
        switch (swipe) {
          case "swipe_left":
            window.history.back();
            showToastRef.current("Gesture: Back");
            break;
          case "swipe_right":
            window.history.forward();
            showToastRef.current("Gesture: Forward");
            break;
          case "swipe_up":
            if (currentPath === "/music" && playPrevRef.current) {
              playPrevRef.current();
              showToastRef.current("Gesture: Previous track");
            } else {
              window.scrollBy({ top: -300, behavior: "smooth" });
              showToastRef.current("Gesture: Scroll up");
            }
            break;
          case "swipe_down":
            if (currentPath === "/music" && playNextRef.current) {
              playNextRef.current();
              showToastRef.current("Gesture: Next track");
            } else {
              window.scrollBy({ top: 300, behavior: "smooth" });
              showToastRef.current("Gesture: Scroll down");
            }
            break;
        }
        ctx.restore(); return;
      }
    }

    // Open palm ? home
    if (rawGesture === "open_palm" && canTrigger("navigate_home") && currentPath !== "/") {
      markTriggered("navigate_home");
      router.push("/");
      showToastRef.current("Gesture: Home");
      addRecentGesture("open_palm");
    }

    // Peace ? next module
    if (rawGesture === "peace" && canTrigger("navigate_next")) {
      markTriggered("navigate_next");
      const i = VIEW_ORDER.indexOf(currentPath);
      router.push(VIEW_ORDER[(i + 1) % VIEW_ORDER.length]);
      showToastRef.current("Gesture: Next module");
      addRecentGesture("peace");
    }

    // Three fingers ? chat
    if (rawGesture === "three_fingers" && canTrigger("open_chat") && setChatOpenRef.current) {
      markTriggered("open_chat");
      setChatOpenRef.current(true);
      showToastRef.current("Gesture: Open chat");
      addRecentGesture("three_fingers");
    }



    // Fist scroll
    if (rawGesture === "fist" && canTrigger("scroll")) {
      if (lastScrollY.current !== null) {
        const dy = (lm[0].y - lastScrollY.current) * thresh.scrollSpeed;
        if (Math.abs(dy) > 1) {
          window.scrollBy({ top: dy, behavior: "auto" });
          markTriggered("scroll");
        }
      }
      lastScrollY.current = lm[0].y;
    } else {
      lastScrollY.current = null;
    }

    // Pinch click / double / long / drag
    if (rawGesture === "pinch" && currentPath !== "/draw") {
      if (pinchHoldStart.current === null) {
        pinchHoldStart.current = now;
        longPressTriggered.current = false;
      }
      const holdMs = now - pinchHoldStart.current;

      if (holdMs > COOLDOWNS.long_press && !longPressTriggered.current && canTrigger("long_press")) {
        longPressTriggered.current = true;
        markTriggered("long_press");
        spawnRipple(vx, vy);
        showToastRef.current("Gesture: Long press");
        addRecentGesture("long_press");
        const el = document.elementFromPoint(vx, vy) as HTMLElement | null;
        if (el) el.dispatchEvent(new PointerEvent("contextmenu", { bubbles: true, clientX: vx, clientY: vy }));
        ctx.restore(); return;
      }

      if (holdMs > 350 && !longPressTriggered.current) {
        if (!dragState.current.active) {
          const el = document.elementFromPoint(vx, vy);
          if (el) {
            dragState.current = { active: true, el, lastX: vx, lastY: vy };
            el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: vx, clientY: vy }));
          }
        } else {
          const moved = Math.hypot(vx - dragState.current.lastX, vy - dragState.current.lastY);
          if (moved > 5 && dragState.current.el) {
            dragState.current.el.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: vx, clientY: vy }));
            dragState.current.lastX = vx;
            dragState.current.lastY = vy;
          }
        }
        ctx.restore(); return;
      }
    } else {
      if (pinchHoldStart.current !== null && !longPressTriggered.current) {
        const holdMs = now - pinchHoldStart.current;
        if (dragState.current.active && dragState.current.el) {
          dragState.current.el.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: vx, clientY: vy }));
          dragState.current = { active: false, el: null, lastX: 0, lastY: 0 };
        } else if (holdMs < 350 && currentPath !== "/draw") {
          const timeSinceLast = now - lastPinchTime.current;
          if (timeSinceLast < COOLDOWNS.double_click && canTrigger("double_click")) {
            markTriggered("double_click");
            spawnRipple(vx, vy);
            const el = document.elementFromPoint(vx, vy) as HTMLElement | null;
            if (el) { el.click(); el.click(); }
            showToastRef.current("Gesture: Double Click");
            addRecentGesture("double_pinch");
          } else if (canTrigger("click")) {
            markTriggered("click");
            lastPinchTime.current = now;
            clickAt(vx, vy);
            addRecentGesture("pinch");
          }
        }
      }
      pinchHoldStart.current = null;
      longPressTriggered.current = false;
      if (dragState.current.active && dragState.current.el) {
        dragState.current.el.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: vx, clientY: vy }));
        dragState.current = { active: false, el: null, lastX: 0, lastY: 0 };
      }
    }

    // Hover
    if (rawGesture === "point") {
      const el = document.elementFromPoint(vx, vy);
      if (el) {
        if (el !== hoverRef.current.el) {
          hoverRef.current = { el, startTime: now };
        } else if (hoverRef.current.startTime !== null) {
          const dwell = now - hoverRef.current.startTime;
          if (dwell > thresh.hoverDwellMs) {
            el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
            el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
            hoverRef.current.startTime = Infinity;
          }
        }
      }
    } else {
      hoverRef.current = { el: null, startTime: null };
    }

    ctx.restore();
  }, [smoothLandmarks, detectSwipe, getThresholds, canTrigger, markTriggered,
      spawnRipple, clickAt, router, addRecentGesture]);

  const loadScript = (src: string): Promise<void> =>
    new Promise((resolve, reject) => {
      if (typeof window === "undefined") { resolve(); return; }
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement("script");
      s.src = src; s.crossOrigin = "anonymous";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed: " + src));
      document.body.appendChild(s);
    });

  const loadMediapipe = async () => {
    if ((window as any).Hands && (window as any).Camera && (window as any).drawConnectors) return;
    await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
    await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js");
    await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");
  };

  const enableGestureCamera = useCallback(async (videoEl: HTMLVideoElement, canvasEl: HTMLCanvasElement) => {
    try {
      await loadMediapipe();
      if (!(window as any).Hands || !(window as any).Camera) {
        showToastRef.current("MediaPipe failed to load properly");
        return;
      }
      const hands = new (window as any).Hands({
        locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
      });
      hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.65, minTrackingConfidence: 0.60 });
      hands.onResults((results: any) => onHandResults(results, canvasEl));
      const camera = new (window as any).Camera(videoEl, {
        onFrame: async () => { if (videoEl) await hands.send({ image: videoEl }); },
        width: 320, height: 240,
      });
      await camera.start();
      cameraRef.current = camera;
      handsRef.current = hands;
      showToastRef.current("Gesture camera online");
    } catch (err) {
      console.error(err);
      showToastRef.current("Camera unavailable -- check permissions");
    }
  }, [onHandResults]);

  const stopCameraOnly = useCallback(() => {
    if (cameraRef.current) { try { cameraRef.current.stop(); } catch (_) {} cameraRef.current = null; }
    handsRef.current = null;
    smoothedLM.current = null;
    historyBuf.current = [];
    setGestureCursor(prev => ({ ...prev, show: false }));
    setGestureConfidencePct(0);
  }, []);

  const disableGestureCamera = useCallback(() => stopCameraOnly(), [stopCameraOnly]);

  return { gestureLabel, gestureCursor, ripples, gestureConfidencePct, recentGestures, enableGestureCamera, disableGestureCamera, stopCameraOnly, lastGesture };
}
