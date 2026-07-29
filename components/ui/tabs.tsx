"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within <Tabs>");
  return ctx;
}

export function Tabs({
  value,
  onValueChange,
  className,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <TabsContext.Provider value={{ value, setValue: onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "relative grid grid-cols-2 gap-1 rounded-2xl bg-secondary/60 p-1",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value: triggerValue,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const { value, setValue } = useTabsContext();
  const isActive = value === triggerValue;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => setValue(triggerValue)}
      className={cn(
        "relative z-10 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200",
        isActive
          ? "text-primary-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {isActive && (
        <motion.span
          layoutId="tab-pill"
          className="absolute inset-0 -z-10 rounded-xl bg-primary"
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        />
      )}
      {children}
    </button>
  );
}

export function TabsContent({
  value: contentValue,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { value } = useTabsContext();
  if (value !== contentValue) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
