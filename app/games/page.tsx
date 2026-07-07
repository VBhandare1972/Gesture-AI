"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export default function GamesPage() {
  const { rpsState, playRPSRound, runRPSGestureRound } = useApp();

  return (
    <section className="view active" id="view-games">
      <div className="view-head">
        <div>
          <div className="eyebrow">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <line x1="6" y1="12" x2="10" y2="12" />
              <line x1="8" y1="10" x2="8" y2="14" />
              <line x1="15" y1="13" x2="15.01" y2="13" />
              <line x1="18" y1="11" x2="18.01" y2="11" />
            </svg>{" "}
            Module 05
          </div>
          <h1 className="view-title">Gesture Games</h1>
          <div className="view-sub">Rock · Paper · Scissors vs JARVIS. Show your hand or tap a button.</div>
        </div>
      </div>

      <div className="panel brackets">
        <div className="rps-arena">
          <div className="rps-side">
            <div className="rps-label">You</div>
            <div className="rps-emoji" id="rpsPlayerEmoji">
              {rpsState.playerChoice}
            </div>
          </div>
          <div className="rps-vs">VS</div>
          <div className="rps-side">
            <div className="rps-label">JARVIS</div>
            <div className="rps-emoji" id="rpsAiEmoji">
              {rpsState.aiChoice}
            </div>
          </div>
        </div>

        <div className="rps-countdown" id="rpsCountdown">
          {rpsState.countdown !== null ? rpsState.countdown : ""}
        </div>
        <div className="rps-result" id="rpsResult">
          {rpsState.result}
        </div>
        
        <div className="rps-score">
          <span>
            WINS <b id="rpsWins" className="mono">{rpsState.wins}</b>
          </span>
          <span>
            LOSSES <b id="rpsLosses" className="mono">{rpsState.losses}</b>
          </span>
          <span>
            TIES <b id="rpsTies" className="mono">{rpsState.ties}</b>
          </span>
        </div>

        <div className="rps-buttons">
          <button
            className="btn btn-accent"
            id="rpsPlayBtn"
            disabled={rpsState.playingRound}
            onClick={runRPSGestureRound}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Play Round
          </button>
          <button
            className="btn btn-ghost"
            id="rpsRock"
            disabled={rpsState.playingRound}
            onClick={() => playRPSRound("rock")}
          >
            Rock ✊
          </button>
          <button
            className="btn btn-ghost"
            id="rpsPaper"
            disabled={rpsState.playingRound}
            onClick={() => playRPSRound("paper")}
          >
            Paper ✋
          </button>
          <button
            className="btn btn-ghost"
            id="rpsScissors"
            disabled={rpsState.playingRound}
            onClick={() => playRPSRound("scissors")}
          >
            Scissors ✌
          </button>
        </div>
      </div>
    </section>
  );
}
