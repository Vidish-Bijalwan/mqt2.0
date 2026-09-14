"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Languages } from "lucide-react";

const PUBLISHED_PREVIEW_ORIGIN = "https://mqt2-0.vercel.app";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "bn", label: "Bengali" },
  { code: "gu", label: "Gujarati" },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]["code"];

function isLanguageCode(value: string | null): value is LanguageCode {
  return LANGUAGES.some((language) => language.code === value);
}

function translatedSourceUrl(current: URL): string {
  if (current.hostname.endsWith(".translate.goog")) {
    const translatedHost = current.hostname.slice(0, -".translate.goog".length);
    const originalHost = translatedHost
      .replace(/--/g, "__HYPHEN__")
      .replace(/-/g, ".")
      .replace(/__HYPHEN__/g, "-");
    const cleanUrl = new URL(`https://${originalHost}${current.pathname}`);

    current.searchParams.forEach((value, key) => {
      if (!key.startsWith("_x_tr_")) cleanUrl.searchParams.append(key, value);
    });

    return cleanUrl.toString();
  }

  if (current.hostname === "localhost" || current.hostname === "127.0.0.1") {
    return new URL(`${current.pathname}${current.search}${current.hash}`, PUBLISHED_PREVIEW_ORIGIN).toString();
  }

  return current.toString();
}

function selectedLanguage(): LanguageCode {
  const current = new URL(window.location.href);
  const translatedLanguage = current.searchParams.get("_x_tr_tl") || current.searchParams.get("tl");
  return isLanguageCode(translatedLanguage) ? translatedLanguage : "en";
}

export default function LanguageSelector({ mobile = false }: { mobile?: boolean }) {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setLanguage(selectedLanguage()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleLanguageChange = (nextLanguage: LanguageCode) => {
    const current = new URL(window.location.href);
    const sourceUrl = translatedSourceUrl(current);

    setLanguage(nextLanguage);

    if (nextLanguage === "en") {
      if (current.hostname.endsWith(".translate.goog")) {
        setNavigating(true);
        window.location.assign(sourceUrl);
      }
      return;
    }

    setNavigating(true);
    const translatedUrl = new URL("https://translate.google.com/translate");
    translatedUrl.searchParams.set("sl", "en");
    translatedUrl.searchParams.set("tl", nextLanguage);
    translatedUrl.searchParams.set("u", sourceUrl);
    window.location.assign(translatedUrl.toString());
  };

  const currentLanguage = LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];

  return (
    <label
      className={`notranslate relative inline-flex items-center rounded-full font-bold ${
        mobile
          ? "min-h-11 w-full border border-white/20 bg-white/10 px-3 text-sm text-white"
          : "ml-2 min-h-9 bg-white px-3 text-xs text-gray-800"
      }`}
      translate="no"
    >
      <span className="sr-only">Website language</span>
      <Languages aria-hidden="true" className="mr-2 h-4 w-4 shrink-0" />
      <span className={`mr-1.5 rounded px-1.5 py-0.5 text-[10px] tracking-wider ${mobile ? "bg-white/15" : "bg-brand-paper text-brand-forest"}`}>
        {currentLanguage.code.toUpperCase()}
      </span>
      <select
        aria-label="Website language"
        value={language}
        disabled={navigating}
        onChange={(event) => handleLanguageChange(event.target.value as LanguageCode)}
        className={`min-w-0 flex-1 cursor-pointer appearance-none bg-transparent pr-5 font-bold outline-none disabled:cursor-wait ${
          mobile ? "text-white" : "text-gray-800"
        }`}
      >
        {LANGUAGES.map((item) => (
          <option key={item.code} value={item.code} className="text-gray-900">
            {item.label}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 h-3.5 w-3.5" />
    </label>
  );
}
