"use client";

import { useTranslate } from "@/hooks/useTranslate";

interface TranslatedTextProps {
  text: string;
  className?: string; // Allow passing styles
}

export default function TranslatedText({ text, className }: TranslatedTextProps) {
  const { translatedText } = useTranslate(text);

  return <span className={className}>{translatedText}</span>;
}
