"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";

const SWATCH_COLORS = [
  "#D92B2B", // Cyber Red
  "#FF6D00", // Neon Orange
  "#FFEA00", // Laser Yellow
  "#AEEA00", // Radioactive Lime
  "#00E676", // Matrix Green
  "#00E5FF", // Electric Cyan
  "#2979FF", // Holographic Blue
  "#651FFF", // Deep Indigo
  "#D500F9", // Neon Magenta
  "#FF1744", // Hot Pink
  "#F5DAA7", // Custom Cream / Gold
  "#FFFFFF"  // Pure White
];

interface Point {
  x: number;
  y: number;
}

type ShapeType = "Heart" | "Star" | "Circle" | "Triangle" | "Rectangle" | "Diamond" | "Arrow" | "Pentagon" | "Hexagon" | "Lightning" | "Line";

interface Stroke {
  color: string;
  size: number;
  points: Point[];
  shape?: ShapeType;
  rotation?: number; // radians
}

const SHAPES: { name: ShapeType; icon: React.ReactNode }[] = [
  { name: "Heart",     icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z"/></svg> },
  { name: "Star",      icon: <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg> },
  { name: "Circle",   icon: <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg> },
  { name: "Triangle", icon: <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,3 22,21 2,21"/></svg> },
  { name: "Rectangle",icon: <svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="5" width="20" height="14" rx="2"/></svg> },
  { name: "Diamond",  icon: <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,12 12,22 2,12"/></svg> },
  { name: "Arrow",    icon: <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,12 16,12 16,22 8,22 8,12 2,12"/></svg> },
  { name: "Pentagon", icon: <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,9 18,21 6,21 2,9"/></svg> },
  { name: "Hexagon",  icon: <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 20,7 20,17 12,22 4,17 4,7"/></svg> },
  { name: "Lightning",icon: <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="13,2 5,14 12,14 11,22 19,10 12,10"/></svg> },
  { name: "Line",      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/></svg> },
];

export default function DrawingPage() {
  const { setStats, showToast } = useApp();

  const [color, setColor] = useState("#D92B2B");
  const [size, setSize] = useState(6);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [drawStatusText, setDrawStatusText] = useState("Point to aim · Pinch to draw");
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [draggingShapeIndex, setDraggingShapeIndex] = useState<number | null>(null);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const strokesRef = useRef<Stroke[]>([]);
  const isDrawingRef = useRef(false);
  const colorRef = useRef("#D92B2B");
  const sizeRef = useRef(6);
  const draggingShapeIndexRef = useRef<number | null>(null);
  const selectedShapeIndexRef = useRef<number | null>(null);
  const resizingShapeIndexRef = useRef<number | null>(null);
  const rotatingShapeIndexRef = useRef<number | null>(null);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    selectedShapeIndexRef.current = selectedShapeIndex;
  }, [selectedShapeIndex]);

  useEffect(() => {
    strokesRef.current = strokes;
  }, [strokes]);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const wrap = canvas.parentElement;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctxRef.current = ctx;

    redrawAllStrokes(ctx, rect.width, rect.height);
  };

  const redrawAllStrokes = (ctx = ctxRef.current, w?: number, h?: number) => {
    if (!ctx) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!w || !h) {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.width / dpr;
      h = canvas.height / dpr;
    }

    ctx.fillStyle = "#1A0808";
    ctx.fillRect(0, 0, w, h);

    strokesRef.current.forEach((stroke, strokeIdx) => {
      if (stroke.shape) {
        const cx = stroke.points[0]?.x || 100;
        const cy = stroke.points[0]?.y || 100;
        const sSize = stroke.size * 10;
        const rotation = stroke.rotation || 0;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.translate(-cx, -cy);

        ctx.fillStyle = stroke.color;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (stroke.shape === "Heart") {
          ctx.moveTo(cx, cy + sSize * 0.3);
          ctx.bezierCurveTo(cx - sSize * 0.5, cy - sSize * 0.4, cx - sSize * 0.9, cy + sSize * 0.15, cx, cy + sSize * 0.9);
          ctx.bezierCurveTo(cx + sSize * 0.9, cy + sSize * 0.15, cx + sSize * 0.5, cy - sSize * 0.4, cx, cy + sSize * 0.3);
        } else if (stroke.shape === "Star") {
          const spikes = 5;
          const outerRad = sSize * 0.6;
          const innerRad = sSize * 0.25;
          let rot = Math.PI / 2 * 3;
          let x = cx;
          let y = cy;
          const step = Math.PI / spikes;
          ctx.moveTo(cx, cy - outerRad);
          for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRad;
            y = cy + Math.sin(rot) * outerRad;
            ctx.lineTo(x, y);
            rot += step;
            x = cx + Math.cos(rot) * innerRad;
            y = cy + Math.sin(rot) * innerRad;
            ctx.lineTo(x, y);
            rot += step;
          }
          ctx.closePath();
        } else if (stroke.shape === "Circle") {
          ctx.arc(cx, cy, sSize * 0.5, 0, Math.PI * 2);
        } else if (stroke.shape === "Triangle") {
          ctx.moveTo(cx, cy - sSize * 0.5);
          ctx.lineTo(cx + sSize * 0.6, cy + sSize * 0.5);
          ctx.lineTo(cx - sSize * 0.6, cy + sSize * 0.5);
          ctx.closePath();
        } else if (stroke.shape === "Rectangle") {
          ctx.roundRect(cx - sSize * 0.6, cy - sSize * 0.38, sSize * 1.2, sSize * 0.75, sSize * 0.06);
        } else if (stroke.shape === "Diamond") {
          ctx.moveTo(cx, cy - sSize * 0.6);
          ctx.lineTo(cx + sSize * 0.6, cy);
          ctx.lineTo(cx, cy + sSize * 0.6);
          ctx.lineTo(cx - sSize * 0.6, cy);
          ctx.closePath();
        } else if (stroke.shape === "Arrow") {
          const aw = sSize * 0.5;
          const ah = sSize * 0.35;
          ctx.moveTo(cx, cy - sSize * 0.5);
          ctx.lineTo(cx + aw, cy);
          ctx.lineTo(cx + aw * 0.45, cy);
          ctx.lineTo(cx + aw * 0.45, cy + ah);
          ctx.lineTo(cx - aw * 0.45, cy + ah);
          ctx.lineTo(cx - aw * 0.45, cy);
          ctx.lineTo(cx - aw, cy);
          ctx.closePath();
        } else if (stroke.shape === "Pentagon") {
          const pSides = 5;
          for (let i = 0; i < pSides; i++) {
            const angle = (i * 2 * Math.PI) / pSides - Math.PI / 2;
            const px = cx + sSize * 0.55 * Math.cos(angle);
            const py = cy + sSize * 0.55 * Math.sin(angle);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
        } else if (stroke.shape === "Hexagon") {
          const hSides = 6;
          for (let i = 0; i < hSides; i++) {
            const angle = (i * 2 * Math.PI) / hSides - Math.PI / 6;
            const hx2 = cx + sSize * 0.55 * Math.cos(angle);
            const hy2 = cy + sSize * 0.55 * Math.sin(angle);
            i === 0 ? ctx.moveTo(hx2, hy2) : ctx.lineTo(hx2, hy2);
          }
          ctx.closePath();
        } else if (stroke.shape === "Lightning") {
          const lw = sSize * 0.35;
          ctx.moveTo(cx + lw * 0.3, cy - sSize * 0.6);
          ctx.lineTo(cx - lw * 0.5, cy - sSize * 0.05);
          ctx.lineTo(cx + lw * 0.15, cy - sSize * 0.05);
          ctx.lineTo(cx - lw * 0.3, cy + sSize * 0.6);
          ctx.lineTo(cx + lw * 0.5, cy + sSize * 0.05);
          ctx.lineTo(cx - lw * 0.15, cy + sSize * 0.05);
          ctx.closePath();
        } else if (stroke.shape === "Line") {
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = Math.max(3, stroke.size * 0.8);
          ctx.lineCap = "round";
          ctx.moveTo(cx - sSize * 0.7, cy);
          ctx.lineTo(cx + sSize * 0.7, cy);
          ctx.stroke();
          if (strokeIdx === selectedShapeIndexRef.current) {
            ctx.strokeStyle = "rgba(254, 208, 187, 0.8)";
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(cx - sSize * 0.7 - 6, cy - 14, sSize * 1.4 + 12, 28);
            ctx.setLineDash([]);
            ctx.fillStyle = "#F5DAA7";
            ctx.strokeStyle = "#842A3B";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx + sSize * 0.7 + 6, cy + 14, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
          ctx.restore();
          return;
        }
        ctx.fill();
        ctx.stroke();

        if (strokeIdx === selectedShapeIndexRef.current) {
          // Dashed bounding box
          ctx.strokeStyle = "rgba(254, 208, 187, 0.75)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 4]);
          ctx.strokeRect(cx - sSize / 2 - 8, cy - sSize / 2 - 8, sSize + 16, sSize + 16);
          ctx.setLineDash([]);

          // ── RESIZE handle — bottom-right (gold square with ↘ arrows) ──
          const rhx = cx + sSize / 2 + 8;
          const rhy = cy + sSize / 2 + 8;
          const rhr = 12;
          ctx.shadowColor = "#F5DAA7";
          ctx.shadowBlur = 10;
          ctx.fillStyle = "#C8973A";
          ctx.strokeStyle = "#F5DAA7";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(rhx - rhr, rhy - rhr, rhr * 2, rhr * 2, 4);
          ctx.fill();
          ctx.stroke();
          ctx.shadowBlur = 0;
          // ↘ resize arrows inside
          ctx.strokeStyle = "#1a0808";
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          // horizontal arrow tip
          ctx.moveTo(rhx - 4, rhy + 1); ctx.lineTo(rhx + 4, rhy + 1); ctx.lineTo(rhx + 2, rhy - 2);
          ctx.moveTo(rhx + 4, rhy + 1); ctx.lineTo(rhx + 2, rhy + 4);
          // vertical arrow tip
          ctx.moveTo(rhx + 1, rhy - 4); ctx.lineTo(rhx + 1, rhy + 4);
          ctx.stroke();

          // ── ROTATE handle — top-center (cyan circle with ↺ arc arrow) ──
          const rotX = cx;
          const rotY = cy - sSize / 2 - 22;
          const rotR = 12;
          ctx.shadowColor = "#00E5FF";
          ctx.shadowBlur = 12;
          ctx.fillStyle = "#007a8c";
          ctx.strokeStyle = "#00E5FF";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(rotX, rotY, rotR, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.shadowBlur = 0;
          // connector line
          ctx.strokeStyle = "rgba(0,229,255,0.45)";
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(rotX, rotY + rotR);
          ctx.lineTo(rotX, cy - sSize / 2 - 8);
          ctx.stroke();
          ctx.setLineDash([]);
          // ↺ circular arrow icon inside
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.arc(rotX, rotY, 5, -Math.PI * 0.8, Math.PI * 0.7);
          ctx.stroke();
          // arrowhead on arc end
          ctx.beginPath();
          ctx.moveTo(rotX + 4, rotY + 2);
          ctx.lineTo(rotX + 5, rotY + 5);
          ctx.lineTo(rotX + 2, rotY + 4);
          ctx.stroke();

          // ── DELETE handle — top-right (red square with ✕) ──
          const dhx = cx + sSize / 2 + 8;
          const dhy = cy - sSize / 2 - 8;
          const dhr = 11;
          ctx.shadowColor = "#FF4455";
          ctx.shadowBlur = 12;
          ctx.fillStyle = "rgba(190, 20, 35, 0.95)";
          ctx.strokeStyle = "#FF4455";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(dhx - dhr, dhy - dhr, dhr * 2, dhr * 2, 4);
          ctx.fill();
          ctx.stroke();
          ctx.shadowBlur = 0;
          // ✕ icon inside
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(dhx - 5, dhy - 5); ctx.lineTo(dhx + 5, dhy + 5);
          ctx.moveTo(dhx + 5, dhy - 5); ctx.lineTo(dhx - 5, dhy + 5);
          ctx.stroke();
        }

        ctx.restore();
      }

      if (stroke.points.length < 2) {
        if (stroke.points.length === 1) {
          ctx.fillStyle = stroke.color;
          ctx.beginPath();
          ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        return;
      }
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    });
  };

  const strokeStart = (pt: Point) => {
    isDrawingRef.current = true;
    const newStroke: Stroke = {
      color: colorRef.current,
      size: sizeRef.current,
      points: [pt],
    };
    setStrokes((prev) => [...prev, newStroke]);
  };

  const strokeMove = (pt: Point) => {
    if (!isDrawingRef.current) return;
    setStrokes((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          points: [...updated[updated.length - 1].points, pt],
        };
      }
      return updated;
    });
  };

  const strokeEnd = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    setStats((prev) => ({ ...prev, drawings: prev.drawings + 1 }));
  };

  useEffect(() => {
    redrawAllStrokes();
  }, [strokes]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const pos = getPos(e);
    setCursorPos(pos);
    setCursorVisible(true);

    // 0. Check if we clicked on the DELETE handle (top-right red square) of selected shape
    if (selectedShapeIndexRef.current !== null) {
      const selectedStroke = strokesRef.current[selectedShapeIndexRef.current];
      if (selectedStroke && selectedStroke.points.length > 0) {
        const cx = selectedStroke.points[0].x;
        const cy = selectedStroke.points[0].y;
        const sSize = selectedStroke.size * 10;
        const dhx = cx + sSize / 2 + 8;
        const dhy = cy - sSize / 2 - 8;
        if (Math.abs(pos.x - dhx) < 18 && Math.abs(pos.y - dhy) < 18) {
          const idxToDel = selectedShapeIndexRef.current;
          setStrokes((prev) => prev.filter((_, i) => i !== idxToDel));
          setSelectedShapeIndex(null);
          selectedShapeIndexRef.current = null;
          showToast("Shape deleted");
          return;
        }
      }
    }

    // 1. Check if we clicked on the ROTATE handle of the currently selected shape
    if (selectedShapeIndexRef.current !== null) {
      const selectedStroke = strokesRef.current[selectedShapeIndexRef.current];
      if (selectedStroke && selectedStroke.points.length > 0) {
        const cx = selectedStroke.points[0].x;
        const cy = selectedStroke.points[0].y;
        const sSize = selectedStroke.size * 10;
        const rotHandleX = cx;
        const rotHandleY = cy - sSize / 2 - 22;
        const distToRotHandle = Math.hypot(pos.x - rotHandleX, pos.y - rotHandleY);
        if (distToRotHandle < 18) {
          rotatingShapeIndexRef.current = selectedShapeIndexRef.current;
          setIsRotating(true);
          showToast("Rotating shape...");
          return;
        }
      }
    }

    // 2. Check if we clicked on the RESIZE handle of the currently selected shape
    if (selectedShapeIndexRef.current !== null) {
      const selectedStroke = strokesRef.current[selectedShapeIndexRef.current];
      if (selectedStroke && selectedStroke.points.length > 0) {
        const cx = selectedStroke.points[0].x;
        const cy = selectedStroke.points[0].y;
        const sSize = selectedStroke.size * 10;
        const hx = cx + sSize / 2 + 8;
        const hy = cy + sSize / 2 + 8;
        const distToHandle = Math.hypot(pos.x - hx, pos.y - hy);
        if (distToHandle < 18) {
          resizingShapeIndexRef.current = selectedShapeIndexRef.current;
          showToast("Resizing shape...");
          return;
        }
      }
    }

    // 2. Check if we clicked on any existing shape to select or drag it
    let foundIdx = -1;
    for (let i = strokesRef.current.length - 1; i >= 0; i--) {
      const stroke = strokesRef.current[i];
      if (stroke.shape && stroke.points.length > 0) {
        const cx = stroke.points[0].x;
        const cy = stroke.points[0].y;
        const sSize = stroke.size * 10;
        const threshold = sSize / 2 + 15;
        const dist = Math.hypot(pos.x - cx, pos.y - cy);
        if (dist < threshold) {
          foundIdx = i;
          break;
        }
      }
    }

    if (foundIdx !== -1) {
      draggingShapeIndexRef.current = foundIdx;
      setDraggingShapeIndex(foundIdx);
      setSelectedShapeIndex(foundIdx);
      showToast("Moving shape...");
    } else {
      setSelectedShapeIndex(null);
      strokeStart(pos);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pos = getPos(e);
    setCursorPos(pos);
    setCursorVisible(true);

    if (resizingShapeIndexRef.current !== null) {
      const idx = resizingShapeIndexRef.current;
      const stroke = strokesRef.current[idx];
      if (stroke && stroke.points.length > 0) {
        const cx = stroke.points[0].x;
        const cy = stroke.points[0].y;
        const distance = Math.hypot(pos.x - cx, pos.y - cy);
        const newSize = Math.max(2, Math.round((distance * 2) / 10));
        setStrokes((prev) => {
          const updated = [...prev];
          if (updated[idx]) updated[idx] = { ...updated[idx], size: newSize };
          return updated;
        });
      }
    } else if (rotatingShapeIndexRef.current !== null) {
      const idx = rotatingShapeIndexRef.current;
      const stroke = strokesRef.current[idx];
      if (stroke && stroke.points.length > 0) {
        const cx = stroke.points[0].x;
        const cy = stroke.points[0].y;
        const angle = Math.atan2(pos.y - cy, pos.x - cx) + Math.PI / 2;
        setStrokes((prev) => {
          const updated = [...prev];
          if (updated[idx]) updated[idx] = { ...updated[idx], rotation: angle };
          return updated;
        });
      }
    } else if (draggingShapeIndexRef.current !== null) {
      const idx = draggingShapeIndexRef.current;
      setStrokes((prev) => {
        const updated = [...prev];
        if (updated[idx]) {
          updated[idx] = {
            ...updated[idx],
            points: [pos]
          };
        }
        return updated;
      });
    } else if (isDrawingRef.current) {
      strokeMove(pos);
    }
  };

  const handlePointerUp = () => {
    if (resizingShapeIndexRef.current !== null) {
      resizingShapeIndexRef.current = null;
    } else if (rotatingShapeIndexRef.current !== null) {
      rotatingShapeIndexRef.current = null;
      setIsRotating(false);
    } else if (draggingShapeIndexRef.current !== null) {
      draggingShapeIndexRef.current = null;
      setDraggingShapeIndex(null);
    } else {
      strokeEnd();
    }
  };

  const handlePointerLeave = () => {
    setCursorVisible(false);
  };

  useEffect(() => {
    const handleGestureDraw = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { x, y, pinching } = customEvent.detail;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

      setDrawStatusText(pinching ? "Drawing..." : "Point to aim · Pinch to draw");

      if (!inside) {
        if (isDrawingRef.current) strokeEnd();
        setCursorVisible(false);
        return;
      }

      const lx = x - rect.left;
      const ly = y - rect.top;

      setCursorPos({ x: lx, y: ly });
      setCursorVisible(true);

      if (pinching) {
        if (draggingShapeIndexRef.current !== null) {
          const idx = draggingShapeIndexRef.current;
          setStrokes((prev) => {
            const updated = [...prev];
            if (updated[idx]) {
              updated[idx] = {
                ...updated[idx],
                points: [{ x: lx, y: ly }]
              };
            }
            return updated;
          });
        } else if (!isDrawingRef.current) {
          let foundIdx = -1;
          for (let i = strokesRef.current.length - 1; i >= 0; i--) {
            const stroke = strokesRef.current[i];
            if (stroke.shape && stroke.points.length > 0) {
              const cx = stroke.points[0].x;
              const cy = stroke.points[0].y;
              const sSize = stroke.size * 10;
              const threshold = sSize / 2 + 15;
              const dist = Math.hypot(lx - cx, ly - cy);
              if (dist < threshold) {
                foundIdx = i;
                break;
              }
            }
          }
          if (foundIdx !== -1) {
            draggingShapeIndexRef.current = foundIdx;
            setDraggingShapeIndex(foundIdx);
          } else {
            strokeStart({ x: lx, y: ly });
          }
        } else {
          strokeMove({ x: lx, y: ly });
        }
      } else {
        if (draggingShapeIndexRef.current !== null) {
          draggingShapeIndexRef.current = null;
          setDraggingShapeIndex(null);
        }
        if (isDrawingRef.current) {
          strokeEnd();
        }
      }
    };

    const handleGestureDrawEnd = () => {
      if (draggingShapeIndexRef.current !== null) {
        draggingShapeIndexRef.current = null;
        setDraggingShapeIndex(null);
      } else {
        strokeEnd();
      }
    };

    window.addEventListener("gesture-draw", handleGestureDraw);
    window.addEventListener("gesture-draw-end", handleGestureDrawEnd);

    return () => {
      window.removeEventListener("gesture-draw", handleGestureDraw);
      window.removeEventListener("gesture-draw-end", handleGestureDrawEnd);
    };
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const shape = e.dataTransfer.getData("shape") as "Heart" | "Star" | "Circle" | "Triangle" | "";
    if (!shape) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const lx = e.clientX - rect.left;
    const ly = e.clientY - rect.top;
    const newStroke: Stroke = {
      color: colorRef.current,
      size: sizeRef.current,
      points: [{ x: lx, y: ly }],
      shape: shape
    };
    setStrokes((prev) => [...prev, newStroke]);
    showToast(`Placed and filled shape: ${shape}`);
  };

  const handleUndo = () => {
    setStrokes((prev) => prev.slice(0, -1));
  };

  const handleDeleteSelected = () => {
    if (selectedShapeIndex === null) return;
    setStrokes((prev) => prev.filter((_, i) => i !== selectedShapeIndex));
    setSelectedShapeIndex(null);
    selectedShapeIndexRef.current = null;
    showToast("Shape deleted");
  };

  // Keyboard Delete / Backspace to remove selected shape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedShapeIndexRef.current !== null) {
        e.preventDefault();
        setStrokes((prev) => prev.filter((_, i) => i !== selectedShapeIndexRef.current));
        setSelectedShapeIndex(null);
        selectedShapeIndexRef.current = null;
        showToast("Shape deleted");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleClear = () => {
    setIsClearing(true);
    setTimeout(() => {
      setStrokes([]);
      setIsClearing(false);
      showToast("Canvas cleared");
    }, 280);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "gesture-ai-drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("Drawing saved");
  };

  return (
    <section className="view active" id="view-draw">
      <div className="view-head">
        <div>
          <div className="eyebrow">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            </svg>{" "}
            Module 02
          </div>
          <h1 className="view-title">Air Drawing</h1>
          <div className="view-sub">Point your index finger and pinch to draw — or use mouse / touch.</div>
        </div>
      </div>
      {/* Colors option in above horizontal line with action buttons on the right */}
      <div className="panel draw-top-bar" style={{ marginBottom: "16px", padding: "12px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <span className="tool-label" style={{ margin: 0, whiteSpace: "nowrap" }}>Color Palette</span>
          <div className="swatches horizontal-swatches" style={{ display: "flex", gap: "7px", flexWrap: "wrap", flex: 1 }}>
            {SWATCH_COLORS.map((c) => (
              <button
                key={c}
                className={`swatch ${color === c ? "active" : ""}`}
                style={{ background: c, width: "24px", height: "24px", borderRadius: "50%", border: color === c ? "2px solid var(--cream)" : "1px solid rgba(254,208,187,0.2)" }}
                aria-label={`Color ${c}`}
                onClick={() => setColor(c)}
              ></button>
            ))}
          </div>

          {/* Action buttons right of palette */}
          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
            <button
              className="btn btn-ghost draw-action-btn"
              id="drawUndoBtn"
              onClick={handleUndo}
              title="Undo"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-4.51" />
              </svg>
              Undo
            </button>
            <button
              className="btn btn-ghost draw-action-btn"
              id="drawEraseBtn"
              onClick={() => { setColor("#1A0808"); showToast("Eraser active"); }}
              title="Erase"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 20H7L3 16l10-10 7 7-3.5 3.5" />
                <path d="M6.0 11.0 l7 7" />
              </svg>
              Erase
            </button>
            <button
              className="btn btn-ghost draw-action-btn"
              id="drawClearBtn"
              onClick={handleClear}
              title="Clear canvas"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
              Clear
            </button>
            <button
              className="btn btn-accent draw-action-btn"
              id="drawSaveBtn"
              onClick={handleSave}
              title="Save image"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="draw-layout">
        <div className={`panel draw-canvas-wrap brackets ${isClearing ? 'clearing-flash' : ''}`} style={{ position: "relative", overflow: "hidden" }}>
          <canvas
            ref={canvasRef}
            id="drawCanvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          ></canvas>
          
          {/* Custom Brush Pointer Cursor */}
          <div
            className={`brush-pointer ${cursorVisible ? "show" : ""} ${isDrawingRef.current ? "pinched" : ""}`}
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderColor: color === "#fff" || color === "#fed0bb" ? "#000" : "#fff",
            }}
          >
            <span className="brush-crosshair"></span>
          </div>

          <div className="draw-status mono" id="drawStatus">
            {drawStatusText}
          </div>

          {/* delete is now a canvas handle - no HTML overlay needed */}
        </div>

        {/* Right side toolbar with vertical shapes option */}
        <div className="panel draw-toolbar">
          <div>
            <span className="tool-label" style={{ display: "flex", justifyItems: "center", justifyContent: "space-between" }}>
              <span>Brush Size</span>
              <span className="mono" style={{ fontSize: "10.5px", color: "var(--cream)" }}>{size}px</span>
            </span>
            <input
              type="range"
              id="brushSize"
              min="2"
              max="40"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </div>

          {/* Shapes right side vertical order */}
          <div className="shapes-vertical-panel" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <span className="tool-label">Shapes</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto", maxHeight: "340px" }}>
              {SHAPES.map(({ name: shapeName, icon }) => (
                <button
                  key={shapeName}
                  className="btn btn-ghost shape-btn"
                  draggable={true}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("shape", shapeName);
                  }}
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (!canvas) return;
                    const dpr = window.devicePixelRatio || 1;
                    const w = canvas.width / dpr;
                    const h = canvas.height / dpr;
                    const newStroke: Stroke = {
                      color: colorRef.current,
                      size: sizeRef.current,
                      points: [{ x: w / 2, y: h / 2 }],
                      shape: shapeName
                    };
                    setStrokes((prev) => [...prev, newStroke]);
                    showToast(`Placed: ${shapeName}`);
                  }}
                  style={{ 
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "7px 10px", 
                    fontSize: "12px", 
                    cursor: "grab", 
                    width: "100%",
                    border: "1px dashed var(--panel-line)",
                    background: "rgba(70, 18, 32, 0.4)",
                    color: "var(--cream)"
                  }}
                >
                  <span style={{ width: "18px", height: "18px", display: "inline-flex", flexShrink: 0 }}>
                    {icon}
                  </span>
                  {shapeName}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
