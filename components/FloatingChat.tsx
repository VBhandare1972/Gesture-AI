"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";

export default function FloatingChat() {
  const {
    chatHistory,
    isTyping,
    sendChatMessage,
    clearChat,
    settings,
    setSettings,
    toggleCommandMic,
    voiceState,
    chatOpen,
    setChatOpen
  } = useApp();

  const [inputVal, setInputVal] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const chatLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-scroll chat log
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping, chatOpen]);

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
    <>
      {/* FLOATING TRIGGER BUTTON */}
      <button
        className={`floating-chat-trigger ${chatOpen ? "open" : ""}`}
        onClick={() => setChatOpen(!chatOpen)}
        title="AI Assistant"
        aria-label="Toggle AI Assistant"
        suppressHydrationWarning
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="glow-ring"></span>
      </button>

      {/* CHAT PANEL MODAL */}
      <div className={`floating-chat-panel ${chatOpen ? "show" : ""}`}>
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
              <div className="chat-status mono">● ONLINE</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button className="btn btn-ghost btn-xs" onClick={clearChat} title="Clear chat history" style={{ padding: "3px 8px", fontSize: "10px" }} suppressHydrationWarning>
              Clear
            </button>
            <button className="close-panel-btn" onClick={() => setChatOpen(false)} title="Close Chat" suppressHydrationWarning>
              ×
            </button>
          </div>
        </div>

        {/* CHAT LOG */}
        <div className="chat-log" ref={chatLogRef}>
          {chatHistory.length === 0 ? (
            <div className="chat-welcome">
              <p>Greetings, User. I am JARVIS. How may I assist you today?</p>
            </div>
          ) : (
            chatHistory.map((msg, i) => (
              <div key={i} className={`chat-row ${msg.role === "user" ? "user" : "bot"}`}>
                <div className="chat-msg">{msg.content}</div>
                <div className="chat-time">
                  {isMounted
                    ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : ""}
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="chat-row bot">
              <div className="chat-msg typing-bubble">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        {/* CHAT SUGGESTIONS */}
        <div className="chat-suggestions">
          {suggestions.map((text, i) => (
            <button key={i} className="suggest-chip" onClick={() => handleSuggestion(text)} suppressHydrationWarning>
              {text}
            </button>
          ))}
        </div>

        {/* CHAT INPUT PANEL */}
        <div className="chat-foot">
          <input
            type="text"
            className="chat-input-field"
            placeholder="Type a message..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            suppressHydrationWarning
          />
          <button
            className={`btn btn-icon btn-ghost ${voiceState.listening && voiceState.mode === 'command' ? 'listening' : ''}`}
            title="Voice command"
            onClick={toggleCommandMic}
            style={{ width: "36px", height: "36px", borderRadius: "8px", flexShrink: 0, padding: 0 }}
            suppressHydrationWarning
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
            </svg>
          </button>
          <button
            className={`btn btn-icon btn-ghost ${settings.voiceOut ? "voice-on" : ""}`}
            title="Toggle voice replies"
            onClick={toggleVoiceOut}
            style={{ width: "36px", height: "36px", borderRadius: "8px", flexShrink: 0, padding: 0 }}
            suppressHydrationWarning
          >
            {settings.voiceOut ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>
          <button className="btn btn-accent btn-sm" onClick={handleSend} style={{ flexShrink: 0, height: "36px" }} suppressHydrationWarning>
            Send
          </button>
        </div>
      </div>
    </>
  );
}
