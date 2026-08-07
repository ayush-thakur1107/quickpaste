import { PasteApp } from "@/components/paste-app";

// hand-drawn clipboard doodle — inline SVG so we don't depend on an icon lib
function ClipboardDoodle() {
  return (
    <svg
      width="52"
      height="58"
      viewBox="0 0 52 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
      aria-hidden="true"
    >
      {/* clipboard body - slightly wonky rectangle */}
      <path
        d="M8 14C7.5 14 5 14.5 5 17L4 50C4 52.5 6 54.5 8.5 54.5L42 55C44.5 55 46.5 53 46.5 50.5L47 17C47 14.5 45.5 13.5 43 13.5L8 14Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="hsl(8 85% 62% / 0.12)"
      />
      {/* clip at top */}
      <path
        d="M18 8C18 5 20 3 25.5 3C31 3 33 5 33 8V16H18V8Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* little circle on clip */}
      <circle cx="25.5" cy="8" r="2.5" fill="currentColor" opacity="0.5" />
      {/* text lines — slightly uneven */}
      <line x1="14" y1="26" x2="36" y2="26.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="14" y1="33" x2="32" y2="33.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="14" y1="40" x2="28" y2="40.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen w-full px-4 py-10 md:py-16">
      <div className="mx-auto max-w-xl">
        {/* hero — slightly left-leaning, not perfectly centered */}
        <div className="mb-8 md:mb-10 pl-1">
          <div className="flex items-end gap-3 mb-3">
            <ClipboardDoodle />
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-none">
              quickpaste<span className="text-primary ml-1">✦</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-base md:text-lg max-w-md leading-relaxed">
            made this bc i was tired of emailing myself notes lol.{" "}
            <span className="opacity-70">
              paste something, get a code, grab it from anywhere.
            </span>
          </p>
        </div>

        {/* the actual app */}
        <PasteApp />

        {/* footer — casual, personal */}
        <footer className="mt-10 pl-1 space-y-1.5">
          <p className="text-xs text-muted-foreground">
            built by <span className="font-medium text-foreground/70">ayush</span>, a CS student who got tired of discord DMs to self
          </p>
          <p className="text-[11px] text-muted-foreground/60">
            v0.3 — still adding stuff lol
          </p>
        </footer>
      </div>
    </main>
  );
}
