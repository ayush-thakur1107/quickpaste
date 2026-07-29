import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Paste from "@/models/Paste";

export const runtime = "nodejs";

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

  const { code } = (body ?? {}) as { code?: unknown };

  if (typeof code !== "string" || code.trim().length === 0) {
    return NextResponse.json(
      { error: "Code is required." },
      { status: 400 }
    );
  }

  const normalizedCode = code.trim().toUpperCase();

  try {
    await connectToDatabase();

    const paste = await Paste.findOne({ code: normalizedCode });

    if (!paste) {
      return NextResponse.json(
        { error: "Code not found." },
        { status: 404 }
      );
    }

    const response = {
      text: paste.text,
      createdAt: paste.createdAt,
    };

    if (paste.deleteAfterReading) {
      await Paste.deleteOne({ _id: paste._id });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("Error retrieving paste:", err);
    return NextResponse.json(
      { error: "Something went wrong while retrieving your text. Please try again." },
      { status: 500 }
    );
  }
}
