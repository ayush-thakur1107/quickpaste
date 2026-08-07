"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div style={{ width: 40, height: 40 }} aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      className="btn-icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
