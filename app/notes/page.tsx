"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote, startListening, voiceState } = useApp();

  const [titleVal, setTitleVal] = useState("");
  const [bodyVal, setBodyVal] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const handleAdd = () => {
    if (!titleVal.trim() && !bodyVal.trim()) return;
    addNote(titleVal, bodyVal);
    setTitleVal("");
    setBodyVal("");
  };

  const handleDownload = (n: { title: string; body: string; time: string }) => {
    const content = `${n.title ? n.title + '\n\n' : ''}${n.body}\n\n---\nCreated: ${n.time}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${n.title ? n.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'jarvis_note'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const startEdit = (n: { id: number; title: string; body: string }) => {
    setEditingId(n.id);
    setEditTitle(n.title === "Untitled" ? "" : n.title);
    setEditBody(n.body === "(no content)" ? "" : n.body);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditBody("");
  };

  const saveEdit = (id: number) => {
    updateNote(id, editTitle, editBody);
    setEditingId(null);
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

  const customStyles = `
    @keyframes noteSlideUp {
      0% { opacity: 0; transform: translateY(30px) scale(0.95); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes pulseGlow {
      0% { box-shadow: 0 0 0 0 rgba(254, 208, 187, 0.4); }
      70% { box-shadow: 0 0 0 15px rgba(254, 208, 187, 0); }
      100% { box-shadow: 0 0 0 0 rgba(254, 208, 187, 0); }
    }
    .note-card-animated {
      animation: noteSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
      transition: all 0.3s ease;
    }
    .note-card-animated:hover {
      transform: translateY(-4px) scale(1.02) !important;
      box-shadow: 0 12px 30px rgba(0,0,0,0.5), 0 0 15px rgba(254,208,187,0.15);
      border-color: rgba(254, 208, 187, 0.4);
    }
    .btn-listening {
      animation: pulseGlow 1.5s infinite;
      background: rgba(254, 208, 187, 0.15) !important;
      color: var(--peach) !important;
      border-color: rgba(254, 208, 187, 0.5) !important;
    }
    .add-note-btn {
      transition: all 0.3s ease;
    }
    .add-note-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(254, 208, 187, 0.25);
    }
    .notes-form-container {
      transition: all 0.3s ease;
      background: rgba(17, 5, 14, 0.6) !important;
      backdrop-filter: blur(12px);
      border: 1px solid rgba(254, 208, 187, 0.1);
    }
    .notes-form-container:focus-within {
      border-color: rgba(254, 208, 187, 0.3);
      box-shadow: 0 0 25px rgba(254, 208, 187, 0.05);
    }
    .note-dl {
      position: absolute;
      top: 12px;
      right: 44px;
      background: none;
      border: none;
      color: var(--txt-faint);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;
    }
    .note-dl:hover {
      color: var(--peach);
      transform: translateY(-2px);
    }
  `;

  return (
    <section className="view active" id="view-notes">
      <style>{customStyles}</style>
      <div className="view-head">
        <div>
         
          <h1 className="view-title">Notes</h1>
          <div className="view-sub">Quick session captures. Dictate with your voice if your hands are busy.</div>
        </div>
      </div>

      <div className="panel notes-form-container" style={{ padding: "24px", borderRadius: "20px", marginBottom: "32px" }}>
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
              className={`btn btn-ghost btn-icon ${voiceState.listening && voiceState.mode === 'dictate-note' ? 'btn-listening' : ''}`}
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
          <button className="btn btn-accent add-note-btn" id="noteAddBtn" style={{ alignSelf: "flex-start", padding: "12px 24px", borderRadius: "12px", letterSpacing: "1px", fontWeight: "600" }} onClick={handleAdd}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Note
          </button>
        </div>

        <div className="notes-grid" id="notesGrid">
          {notes.length === 0 ? (
            <div className="notes-empty" style={{ opacity: 0, animation: "noteSlideUp 0.5s ease forwards", textAlign: "center", width: "100%", padding: "60px 0", color: "var(--txt-faint)", gridColumn: "1 / -1" }}>No notes yet — add one above, or say &quot;open notes&quot; and dictate.</div>
          ) : (
            notes.map((n, idx) => (
              <div 
                className="panel note-card note-card-animated" 
                key={n.id}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                {editingId === n.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                    <input 
                      type="text" 
                      value={editTitle} 
                      onChange={(e) => setEditTitle(e.target.value)} 
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(254, 208, 187, 0.2)", color: "#fff", padding: "8px 12px", borderRadius: "8px", fontSize: "16px", fontWeight: "600" }}
                      placeholder="Note title..."
                      autoFocus
                    />
                    <textarea 
                      value={editBody} 
                      onChange={(e) => setEditBody(e.target.value)} 
                      rows={3}
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(254, 208, 187, 0.2)", color: "var(--txt-mid)", padding: "8px 12px", borderRadius: "8px", fontSize: "14px", resize: "vertical" }}
                      placeholder="Note body..."
                    />
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "4px" }}>
                      <button className="btn btn-ghost" style={{ padding: "6px 16px", fontSize: "12px", borderRadius: "8px" }} onClick={cancelEdit}>Cancel</button>
                      <button className="btn btn-accent" style={{ padding: "6px 16px", fontSize: "12px", borderRadius: "8px" }} onClick={() => saveEdit(n.id)}>Save</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button className="note-dl" style={{ right: "72px" }} aria-label="Edit note" onClick={() => startEdit(n)} title="Edit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button className="note-dl" aria-label="Download note" onClick={() => handleDownload(n)} title="Save as .txt">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </button>
                    <button className="note-del" aria-label="Delete note" onClick={() => deleteNote(n.id)}>
                      ✕
                    </button>
                    <div className="n-title">{n.title}</div>
                    <div className="n-body">{n.body}</div>
                    <div className="n-time mono">{n.time}</div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
