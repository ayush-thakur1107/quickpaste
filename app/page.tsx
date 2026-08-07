import { PasteApp } from "@/components/paste-app";

export default function HomePage() {
  return (
    <main className="page">
      <div className="page-inner">
        <h1 className="page-title">quickpaste</h1>
        <PasteApp />
      </div>
    </main>
  );
}
