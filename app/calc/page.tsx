"use client";

import React, { useState, useEffect, useRef } from "react";

export default function CalculatorPage() {
  const [exprStr, setExprStr] = useState("");
  const [displayStr, setDisplayStr] = useState("0");
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [evalExpr, setEvalExpr] = useState("");

  const exprStrRef = useRef("");
  const justEvaluatedRef = useRef(false);

  useEffect(() => {
    exprStrRef.current = exprStr;
  }, [exprStr]);

  useEffect(() => {
    justEvaluatedRef.current = justEvaluated;
  }, [justEvaluated]);

  const safeEval = (expr: string) => {
    const cleaned = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
    if (!/^[0-9+\-*/.%() ]+$/.test(cleaned)) throw new Error("bad");
    const val = Function('"use strict";return (' + cleaned + ')')();
    if (!isFinite(val)) throw new Error("infinite");
    return val;
  };

  const handleKeyPress = (key: string) => {
    let currentExpr = exprStrRef.current;
    let evalState = justEvaluatedRef.current;

    if (key === "C") {
      setExprStr("");
      setDisplayStr("0");
      setEvalExpr("");
      setJustEvaluated(false);
      return;
    }

    if (key === "⌫" || key === "Backspace") {
      const popped = currentExpr.slice(0, -1);
      setExprStr(popped);
      setDisplayStr(popped || "0");
      setJustEvaluated(false);
      return;
    }

    if (key === "=" || key === "Enter") {
      try {
        const result = safeEval(currentExpr || "0");
        setEvalExpr(currentExpr + " =");
        setExprStr(String(result));
        setDisplayStr(String(result));
        setJustEvaluated(true);
      } catch (e) {
        setDisplayStr("ERROR");
        setExprStr("");
        setEvalExpr("");
        setJustEvaluated(true);
      }
      return;
    }

    if (key === "%") {
      try {
        const result = safeEval(currentExpr || "0") / 100;
        setExprStr(String(result));
        setDisplayStr(String(result));
      } catch (e) {
        setDisplayStr("ERROR");
        setExprStr("");
      }
      setJustEvaluated(false);
      return;
    }

    if (evalState && /[0-9.]/.test(key)) {
      currentExpr = "";
      setEvalExpr("");
    }

    setJustEvaluated(false);
    const updatedExpr = currentExpr + key;
    setExprStr(updatedExpr);
    setDisplayStr(updatedExpr);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/[0-9.]/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === "+") {
        handleKeyPress("+");
      } else if (e.key === "-") {
        handleKeyPress("−");
      } else if (e.key === "*") {
        handleKeyPress("×");
      } else if (e.key === "/") {
        handleKeyPress("÷");
      } else if (e.key === "Enter" || e.key === "=") {
        handleKeyPress("=");
      } else if (e.key === "Backspace") {
        handleKeyPress("⌫");
      } else if (e.key === "Escape") {
        handleKeyPress("C");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const keys = ["C", "⌫", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", ".", "="];

  const customStyles = `
    @keyframes calcSlideUp {
      0% { opacity: 0; transform: translateY(50px) scale(0.95); filter: blur(8px); }
      60% { opacity: 1; transform: translateY(-5px) scale(1.02); filter: blur(0); }
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }
    @keyframes btnPop {
      0% { opacity: 0; transform: translateY(15px) scale(0.85); filter: blur(4px); }
      60% { opacity: 1; transform: translateY(-2px) scale(1.05); filter: blur(0); }
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }
    .calc-wrap-animated {
      animation: calcSlideUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(254, 208, 187, 0.15) !important;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .calc-wrap-animated:hover {
      box-shadow: 0 30px 60px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(254, 208, 187, 0.3) !important;
    }
    .calc-btn-animated {
      opacity: 0;
      animation: btnPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .calc-btn-animated:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 8px 20px rgba(0,0,0,0.4), 0 0 15px rgba(254,208,187,0.25);
      z-index: 10;
      border-color: rgba(254, 208, 187, 0.5);
      text-shadow: 0 0 8px rgba(254, 208, 187, 0.5);
    }
    .calc-btn-animated:active {
      transform: translateY(2px) scale(0.95);
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    .calc-display-animated {
      transition: all 0.3s ease;
      text-shadow: 0 0 25px rgba(254, 208, 187, 0.4);
      border-bottom: 1px solid rgba(254, 208, 187, 0.15);
      margin-bottom: 16px;
      padding-bottom: 16px;
    }
  `;

  return (
    <section className="view active" id="view-calc">
      <style>{customStyles}</style>
      <div className="view-head">
        <div>
          
          <h1 className="view-title">Calculator</h1>
          <div className="view-sub">Standard arithmetic, HUD styled.</div>
        </div>
      </div>

      <div className="panel calc-wrap brackets calc-wrap-animated">
        <div className="calc-display calc-display-animated">
          <span className="expr mono" id="calcExpr">
            {evalExpr ? evalExpr : <>&nbsp;</>}
          </span>
          <span id="calcDisplay">{displayStr}</span>
        </div>
        <div className="calc-grid" id="calcGrid">
          {keys.map((k, idx) => (
            <button
              key={k}
              className={`calc-btn calc-btn-animated ${/[÷×−+]/.test(k) ? "op" : ""} ${k === "=" ? "eq" : ""}`}
              style={{ 
                gridColumn: k === "=" ? "span 2" : "auto",
                animationDelay: `${idx * 0.03}s` 
              }}
              onClick={() => handleKeyPress(k)}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
