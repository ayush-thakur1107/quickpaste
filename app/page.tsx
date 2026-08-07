import { PasteApp } from "@/components/paste-app";

/* Hand-drawn clipboard doodle — inline SVG, no icon library */
function ClipboardDoodle() {
  return (
    <svg
      width="48"
      height="54"
      viewBox="0 0 52 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* clipboard body — slightly wonky rectangle */}
      <path
        d="M8 14C7.5 14 5 14.5 5 17L4 50C4 52.5 6 54.5 8.5 54.5L42 55C44.5 55 46.5 53 46.5 50.5L47 17C47 14.5 45.5 13.5 43 13.5L8 14Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(192, 57, 43, 0.1)"
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
      <circle cx="25.5" cy="8" r="2.5" fill="currentColor" opacity="0.4" />
      {/* text lines — slightly uneven */}
      <line x1="14" y1="26" x2="36" y2="26.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      <line x1="14" y1="33" x2="32" y2="33.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      <line x1="14" y1="40" x2="28" y2="40.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="page">
      <div className="page-inner">
        {/* Hero — slightly left-leaning, not perfectly centered */}
        <div className="hero">
          <div className="hero-row">
            <ClipboardDoodle />
            <h1 className="hero-title">
              quickpaste<span className="hero-accent">✦</span>
            </h1>
          </div>
          <p className="hero-subtitle">
            made this bc i was tired of emailing myself notes lol.{" "}
            <span className="hero-dim">
              paste something, get a code, grab it from anywhere.
            </span>
          </p>
        </div>

        {/* The app */}
        <PasteApp />

        {/* Footer */}
        <footer className="footer">
          <p>
            built by <span className="name">ayush</span>, a CS student who got
            tired of discord DMs to self
          </p>
          <p className="version">v0.3 — still adding stuff lol</p>
        </footer>
      </div>
    </main>
  );
}
