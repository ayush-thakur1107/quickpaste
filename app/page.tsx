import { PasteApp } from "@/components/paste-app";

export default function HomePage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-12">
      <PasteApp />
      <p className="mt-8 text-xs text-muted-foreground text-center">
        No accounts. No passwords. Just codes.
      </p>
    </main>
  );
}
