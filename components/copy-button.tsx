"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied!",
  className,
  style,
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(copiedLabel);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy to clipboard.");
    }
  };

  return (
    <button
      type="button"
      className={`btn-secondary${className ? ` ${className}` : ""}`}
      style={style}
      onClick={handleCopy}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
          >
            ✓ {copiedLabel}
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
          >
            📋 {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
