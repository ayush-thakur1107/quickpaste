import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { generateCode } from "@/lib/generate-code";
import Paste from "@/models/Paste";

export const runtime = "nodejs";

const MAX_BYTES = 1024 * 1024; // 1 MB
const MAX_GENERATION_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { text, deleteAfterReading } = (body ?? {}) as {
    text?: unknown;
    deleteAfterReading?: unknown;
  };

  if (typeof text !== "string") {
    return NextResponse.json(
      { error: "Text is required." },
      { status: 400 }
    );
  }

  const trimmedText = text.trim();

  if (trimmedText.length === 0) {
    return NextResponse.json(
      { error: "Text cannot be empty." },
      { status: 400 }
    );
  }

  const byteLength = Buffer.byteLength(trimmedText, "utf-8");
  if (byteLength > MAX_BYTES) {
    return NextResponse.json(
      { error: "Text exceeds the 1 MB size limit." },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    let paste = null;
    let lastError: unknown = null;

    // Retry on the (extremely rare) chance of a code collision.
    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
      const code = generateCode();
      try {
        paste = await Paste.create({
          code,
          text: trimmedText,
          deleteAfterReading: Boolean(deleteAfterReading),
        });
        break;
      } catch (err: unknown) {
        lastError = err;
        const isDuplicateKey =
          typeof err === "object" &&
          err !== null &&
          "code" in err &&
          (err as { code?: number }).code === 11000;

        if (!isDuplicateKey) {
          throw err;
        }
        // Otherwise loop and try a new code.
      }
    }

    if (!paste) {
      console.error("Failed to generate a unique code:", lastError);
      return NextResponse.json(
        { error: "Could not generate a unique code. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ code: paste.code }, { status: 201 });
  } catch (err) {
    console.error("Error saving paste:", err);
    return NextResponse.json(
      { error: "Something went wrong while saving your text. Please try again." },
      { status: 500 }
    );
  }
}
