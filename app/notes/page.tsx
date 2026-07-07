"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

export default function NotesPage() {
  const { notes, addNote, deleteNote, startListening, voiceState } = useApp();

  const [titleVal, setTitleVal] = useState("");
  const [bodyVal, setBodyVal] = useState("");

  const handleAdd = () => {
    if (!titleVal.trim() && !bodyVal.trim()) return;
    addNote(titleVal, bodyVal);
    setTitleVal("");
    setBodyVal("");
  };

  useEffect(() => {
    const handleDictation = (e: Event) => {
      const customEvent = e as CustomEvent;
      const text = customEvent.detail;
      setBodyVal((prev) => (prev ? prev + " " : "") + text);
    };
    window.addEventListener("voice-note-dictation", handleDictation);
    return () => {
      window.removeEventListener("voice-note-dictation", handleDictation);
    };
  }, []);

  return (
    <section className="view active" id="view-notes">
      <div className="view-head">
        <div>
          <div className="eyebrow">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>{" "}
            Module 06
          </div>
          <h1 className="view-title">Notes</h1>
          <div className="view-sub">Quick session captures. Dictate with your voice if your hands are busy.</div>
        </div>
      </div>

      <div className="panel">
        <div className="notes-form">
          <input
            type="text"
            id="noteTitleInput"
            placeholder="Note title..."
            value={titleVal}
            onChange={(e) => setTitleVal(e.target.value)}
          />
          <div className="notes-form-row">
            <textarea
              id="noteBodyInput"
              rows={2}
              placeholder="Write something..."
              value={bodyVal}
              onChange={(e) => setBodyVal(e.target.value)}
            ></textarea>
            <button
              className={`btn btn-ghost btn-icon ${voiceState.listening && voiceState.mode === 'dictate-note' ? 'listening' : ''}`}
              id="noteDictateBtn"
              title="Dictate note"
              onClick={() => startListening("dictate-note")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
          </div>
          <button className="btn btn-accent" id="noteAddBtn" style={{ alignSelf: "flex-start" }} onClick={handleAdd}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Note
          </button>
        </div>

        <div className="notes-grid" id="notesGrid">
          {notes.length === 0 ? (
            <div className="notes-empty">No notes yet — add one above, or say &quot;open notes&quot; and dictate.</div>
          ) : (
            notes.map((n) => (
              <div className="panel note-card" key={n.id}>
                <button className="note-del" aria-label="Delete note" onClick={() => deleteNote(n.id)}>
                  ✕
                </button>
                <div className="n-title">{n.title}</div>
                <div className="n-body">{n.body}</div>
                <div className="n-time mono">{n.time}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
