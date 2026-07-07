"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";

export default function ChatPage() {
  const {
    chatHistory,
    isTyping,
    sendChatMessage,
    clearChat,
    settings,
    setSettings,
    startListening,
    voiceState
  } = useApp();

  const [inputVal, setInputVal] = useState("");
  const chatLogRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat log
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    sendChatMessage(inputVal);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (text: string) => {
    sendChatMessage(text);
  };

  const toggleVoiceOut = () => {
    setSettings((prev) => ({ ...prev, voiceOut: !prev.voiceOut }));
  };

  const suggestions = [
    "Tell me about AI",
    "What can you do?",
    "What's the weather today?",
    "Open drawing",
    "Play Kesariya",
  ];

  return (
    <section className="view active" id="view-chat">
      <div className="view-head">
        <div>
          <div className="eyebrow">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Module 01
          </div>
          <h1 className="view-title">AI Assistant</h1>
          <div className="view-sub">Ask anything — speak it, type it, or pick a suggestion below.</div>
        </div>
        <button className="btn btn-ghost btn-sm" id="chatClearBtn" onClick={clearChat}>
          Clear chat
        </button>
      </div>

      <div className="panel chat-panel brackets">
        <div className="chat-head">
          <div className="chat-head-id">
            <div className="chat-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                <circle cx="12" cy="16" r="1" />
              </svg>
            </div>
            <div>
              <div className="chat-name">JARVIS</div>
              <div className="chat-status mono" id="chatStatus">
                ● ONLINE
              </div>
            </div>
          </div>
          <button
            className="btn btn-icon btn-ghost"
            id="chatVoiceOutToggle"
            title="Toggle spoken replies"
            onClick={toggleVoiceOut}
          >
            {settings.voiceOut ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>
        </div>

        <div className="chat-log" id="chatLog" ref={chatLogRef}>
          {chatHistory.map((m, idx) => {
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={idx} className={`msg ${m.role === "user" ? "user" : "ai"}`}>
                <div>{m.content}</div>
                <span className="m-time">{timeStr}</span>
              </div>
            );
          })}
          {isTyping && (
            <div className="msg ai typing" id="typingIndicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>

        <div className="chat-suggestions" id="chatSuggestions">
          {suggestions.map((text) => (
            <button key={text} className="chip" onClick={() => handleSuggestion(text)}>
              {text}
            </button>
          ))}
        </div>

        <div className="chat-input-row">
          <textarea
            id="chatInput"
            rows={1}
            placeholder="Message JARVIS..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
          ></textarea>
          <button
            className={`btn btn-icon btn-ghost ${voiceState.listening && voiceState.mode === 'dictate-chat' ? 'listening' : ''}`}
            id="chatMicBtn"
            aria-label="Speak"
            onClick={() => startListening('dictate-chat')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
          <button className="btn btn-accent btn-icon" id="chatSendBtn" aria-label="Send" onClick={handleSend}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
