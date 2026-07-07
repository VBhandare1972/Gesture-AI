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

  return (
    <section className="view active" id="view-calc">
      <div className="view-head">
        <div>
          <div className="eyebrow">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="8" y1="6" x2="16" y2="6" />
              <line x1="8" y1="10" x2="16" y2="10" />
            </svg>{" "}
            Module 07
          </div>
          <h1 className="view-title">Calculator</h1>
          <div className="view-sub">Standard arithmetic, HUD styled.</div>
        </div>
      </div>

      <div className="panel calc-wrap brackets">
        <div className="calc-display">
          <span className="expr mono" id="calcExpr">
            {evalExpr ? evalExpr : <>&nbsp;</>}
          </span>
          <span id="calcDisplay">{displayStr}</span>
        </div>
        <div className="calc-grid" id="calcGrid">
          {keys.map((k) => (
            <button
              key={k}
              className={`calc-btn ${/[÷×−+]/.test(k) ? "op" : ""} ${k === "=" ? "eq" : ""}`}
              style={{ gridColumn: k === "=" ? "span 2" : "auto" }}
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
