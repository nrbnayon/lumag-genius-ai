import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Google Translate API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { text, targetLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "Missing text or targetLang" },
        { status: 400 }
      );
    }

    if (targetLang === "en") {
        return NextResponse.json({ translatedText: text });
    }

    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        format: "text", // or 'html' if you want to preserve formatting
      }),
    });

    const data = await response.json();

    if (data.error) {
        console.error("Google API Error:", data.error);
        throw new Error(data.error.message);
    }

    const translatedText = data.data.translations[0].translatedText;

    return NextResponse.json({ translatedText });
  } catch (error: any) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Failed to translate text" },
      { status: 500 }
    );
  }
}
