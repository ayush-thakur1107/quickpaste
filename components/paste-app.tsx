"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CopyButton } from "@/components/copy-button";

const MAX_CHARS = 1_000_000;
const RECENT_CODE_KEY = "quickpaste:last-code";

function formatTimestamp(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function PasteApp() {
  const [tab, setTab] = React.useState<"save" | "retrieve">("save");

  // --- Save tab state ---
  const [text, setText] = React.useState("");
  const [generatedCode, setGeneratedCode] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // --- Retrieve tab state ---
  const [codeInput, setCodeInput] = React.useState("");
  const [retrieving, setRetrieving] = React.useState(false);
  const [retrievedText, setRetrievedText] = React.useState<string | null>(null);
  const [retrievedAt, setRetrievedAt] = React.useState<string | null>(null);
  const [notFound, setNotFound] = React.useState(false);
  const codeInputRef = React.useRef<HTMLInputElement>(null);

  // Autofocus the active tab's primary input.
  React.useEffect(() => {
    if (tab === "save") {
      textareaRef.current?.focus();
    } else {
      codeInputRef.current?.focus();
    }
  }, [tab]);

  // Load the most recently generated code from localStorage on mount.
  React.useEffect(() => {
    const stored = window.localStorage.getItem(RECENT_CODE_KEY);
    if (stored) setGeneratedCode(stored);
  }, []);

  const handleGenerate = React.useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed) { toast.error("Paste some text first."); return; }
    if (trimmed.length > MAX_CHARS) { toast.error("Text is too large. Limit is 1 MB."); return; }

    setSaving(true);
    setGeneratedCode(null);
    try {
      const res = await fetch("/api/paste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, deleteAfterReading: false }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Failed to generate a code."); return; }
      setGeneratedCode(data.code);
      window.localStorage.setItem(RECENT_CODE_KEY, data.code);
      try {
        await navigator.clipboard.writeText(data.code);
        toast.success("Code generated & copied to clipboard!");
      } catch {
        toast.success("Code generated!");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [text]);

  const handleRetrieve = React.useCallback(async () => {
    const trimmed = codeInput.trim();
    if (!trimmed) { toast.error("Enter a code first."); return; }

    setRetrieving(true);
    setNotFound(false);
    setRetrievedText(null);
    setRetrievedAt(null);
    try {
      const res = await fetch("/api/retrieve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = await res.json();
      if (res.status === 404) { setNotFound(true); return; }
      if (!res.ok) { toast.error(data.error ?? "Failed to retrieve text."); return; }
      setRetrievedText(data.text);
      setRetrievedAt(data.createdAt);
      try {
        await navigator.clipboard.writeText(data.text);
        toast.success("Text retrieved & copied to clipboard!");
      } catch {
        toast.success("Text retrieved!");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setRetrieving(false);
    }
  }, [codeInput]);

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); handleGenerate(); }
  };

  const handleCodeInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); handleRetrieve(); }
  };

  return (
    <div className="card">
      {/* Card header */}
      <div className="card-header">
        <h2 className="card-title">quickpaste</h2>
        <p className="card-desc">the fastest way to move text between your devices</p>
      </div>

      {/* Tabs */}
      <div className="tabs-list">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "save"}
          className={`tab-btn${tab === "save" ? " tab-btn--active" : ""}`}
          onClick={() => setTab("save")}
        >
          drop some text
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "retrieve"}
          className={`tab-btn${tab === "retrieve" ? " tab-btn--active" : ""}`}
          onClick={() => setTab("retrieve")}
        >
          grab it back
        </button>
      </div>

      {/* ---- SAVE TAB ---- */}
      {tab === "save" && (
        <motion.div
          key="save"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="space-y"
        >
          <div>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder="dump your text here.."
              rows={6}
              maxLength={MAX_CHARS}
              aria-label="Text to save"
              className="textarea"
            />
            <div className="counter-row">
              <span>ctrl+enter to generate</span>
              <span className={text.length > MAX_CHARS * 0.95 ? "text-danger" : ""}>
                {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={saving || text.trim().length === 0}
          >
            {saving ? (
              <><span className="spinner" /> working on it...</>
            ) : (
              <>🔒 generate a code</>
            )}
          </button>

          {generatedCode && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className="code-result"
            >
              <p className="code-result__label">here&apos;s ur code 👇</p>
              <p className="code-result__code">{generatedCode}</p>
              <CopyButton text={generatedCode} label="Copy Code" />
            </motion.div>
          )}
        </motion.div>
      )}

      {/* ---- RETRIEVE TAB ---- */}
      {tab === "retrieve" && (
        <motion.div
          key="retrieve"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="space-y"
        >
          <div className="retrieve-row">
            <input
              ref={codeInputRef}
              value={codeInput}
              onChange={(e) => { setCodeInput(e.target.value.toUpperCase()); setNotFound(false); }}
              onKeyDown={handleCodeInputKeyDown}
              placeholder="enter your code..."
              aria-label="Paste code"
              autoCapitalize="characters"
              className="input"
            />
            <button
              className="btn-primary"
              onClick={handleRetrieve}
              disabled={retrieving || codeInput.trim().length === 0}
            >
              {retrieving ? <span className="spinner" /> : "↗"} fetch
            </button>
          </div>

          {notFound && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="error-text"
              role="alert"
            >
              nope, couldn&apos;t find that one 🤷
            </motion.p>
          )}

          {retrievedText !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className="space-y"
            >
              <textarea
                value={retrievedText}
                readOnly
                rows={6}
                aria-label="Retrieved text"
                className="textarea"
              />
              <div className="retrieved-footer">
                {retrievedAt && (
                  <span className="timestamp">🕐 {formatTimestamp(retrievedAt)}</span>
                )}
                <CopyButton text={retrievedText} label="Copy Text" style={{ marginLeft: "auto" }} />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
