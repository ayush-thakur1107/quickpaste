"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends Omit<ButtonProps, "onClick"> {
  text: string;
  label?: string;
  copiedLabel?: string;
}

export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied!",
  className,
  ...props
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
    <Button
      type="button"
      variant="secondary"
      onClick={handleCopy}
      className={cn("min-w-[9.5rem]", className)}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            {copiedLabel}
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
