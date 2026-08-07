"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CopyButton } from "@/components/copy-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const MAX_CHARS = 1_000_000; // ~1 MB ceiling, matches server-side limit
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
  const [deleteAfterReading, setDeleteAfterReading] = React.useState(false);
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
    if (!trimmed) {
      toast.error("Paste some text first.");
      return;
    }
    if (trimmed.length > MAX_CHARS) {
      toast.error("Text is too large. Limit is 1 MB.");
      return;
    }

    setSaving(true);
    setGeneratedCode(null);
    try {
      const res = await fetch("/api/paste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, deleteAfterReading }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Failed to generate a code.");
        return;
      }

      setGeneratedCode(data.code);
      window.localStorage.setItem(RECENT_CODE_KEY, data.code);
      toast.success("Code generated!");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [text, deleteAfterReading]);

  const handleRetrieve = React.useCallback(async () => {
    const trimmed = codeInput.trim();
    if (!trimmed) {
      toast.error("Enter a code first.");
      return;
    }

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

      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (!res.ok) {
        toast.error(data.error ?? "Failed to retrieve text.");
        return;
      }

      setRetrievedText(data.text);
      setRetrievedAt(data.createdAt);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setRetrieving(false);
    }
  }, [codeInput]);

  // Ctrl/Cmd + Enter generates a code from anywhere in the save textarea.
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  };

  // Enter retrieves when the code input is focused.
  const handleCodeInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRetrieve();
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-end">
        <ThemeToggle />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>quickpaste</CardTitle>
          <CardDescription>
            {"the fastest way to move text between your devices\n(seriously, it takes like 3 seconds)"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as "save" | "retrieve")}>
            <TabsList>
              <TabsTrigger value="save">drop some text</TabsTrigger>
              <TabsTrigger value="retrieve">grab it back</TabsTrigger>
            </TabsList>

            {/* --- SAVE TAB --- */}
            <TabsContent value="save" className="mt-6 space-y-4">
              <div className="space-y-2">
                <Textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder="dump your text here... go wild"
                  rows={8}
                  maxLength={MAX_CHARS}
                  aria-label="Text to save"
                  className="min-h-[180px]"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>protip: ctrl+enter works too</span>
                  <span className={cn(text.length > MAX_CHARS * 0.95 && "text-destructive")}>
                    {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                  </span>
                </div>
              </div>

              <label
                htmlFor="delete-after-reading"
                className="flex items-center gap-3 rounded-xl border border-input bg-secondary/30 px-4 py-3 cursor-pointer select-none"
              >
                <Checkbox
                  id="delete-after-reading"
                  checked={deleteAfterReading}
                  onCheckedChange={setDeleteAfterReading}
                />
                <span className="flex items-center gap-2 text-sm">
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  self-destruct mode 💣
                </span>
              </label>

              <Button
                onClick={handleGenerate}
                disabled={saving || text.trim().length === 0}
                className="w-full hover-bounce"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    working on it...
                  </>
                ) : (
                  <>
                    📋 gimme a code
                  </>
                )}
              </Button>

              {generatedCode && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl border border-input bg-secondary/40 p-5 text-center space-y-3"
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    here&apos;s ur code 👇
                  </p>
                  <p className="font-display text-3xl font-bold tracking-[0.25em]">
                    {generatedCode}
                  </p>
                  <CopyButton text={generatedCode} label="Copy Code" />
                </motion.div>
              )}
            </TabsContent>

            {/* --- RETRIEVE TAB --- */}
            <TabsContent value="retrieve" className="mt-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  ref={codeInputRef}
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value.toUpperCase());
                    setNotFound(false);
                  }}
                  onKeyDown={handleCodeInputKeyDown}
                  placeholder="enter your code..."
                  aria-label="Paste code"
                  autoCapitalize="characters"
                />
                <Button
                  onClick={handleRetrieve}
                  disabled={retrieving || codeInput.trim().length === 0}
                  className="hover-bounce"
                >
                  {retrieving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "↗"
                  )}
                  fetch it
                </Button>
              </div>

              {notFound && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-destructive text-center"
                  role="alert"
                >
                  nope, couldn&apos;t find that one 🤷
                </motion.p>
              )}

              {retrievedText !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  <Textarea
                    value={retrievedText}
                    readOnly
                    rows={8}
                    aria-label="Retrieved text"
                    className="min-h-[180px]"
                  />
                  <div className="flex items-center justify-between gap-3">
                    {retrievedAt && (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        🕐 {formatTimestamp(retrievedAt)}
                      </span>
                    )}
                    <CopyButton text={retrievedText} label="Copy Text" className="ml-auto" />
                  </div>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
