"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  className?: string;
}

export function Checkbox({
  checked,
  onCheckedChange,
  id,
  className,
}: CheckboxProps) {
  return (
    <button
      type="button"
      id={id}
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "h-5 w-5 shrink-0 rounded-md border border-input flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked ? "bg-primary border-primary" : "bg-secondary/50",
        className
      )}
    >
      {checked && (
        <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />
      )}
    </button>
  );
}
