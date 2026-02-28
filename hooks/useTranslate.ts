"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

// Simple in-memory cache to prevent re-fetching the same translations
const translationCache: Record<string, string> = {};

export function useTranslate(text: string) {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If language is English, just show original text (assuming source is English)
    if (language === "en") {
      setTranslatedText(text);
      return;
    }

    if (!text) {
        setTranslatedText("");
        return;
    }

    // Check cache first
    const cacheKey = `${text}_${language}`;
    if (translationCache[cacheKey]) {
      setTranslatedText(translationCache[cacheKey]);
      return;
    }

    // Fetch translation
    let isMounted = true;
    setLoading(true);

    const translate = async () => {
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, targetLang: language }),
        });
        
        const data = await res.json();
        
        if (data.translatedText && isMounted) {
          translationCache[cacheKey] = data.translatedText;
          setTranslatedText(data.translatedText);
        }
      } catch (error) {
        console.error("Translation error:", error);
        // Fallback to original text on error
        if (isMounted) setTranslatedText(text);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    translate();

    return () => {
      isMounted = false;
    };
  }, [text, language]);

  return { translatedText, loading };
}
