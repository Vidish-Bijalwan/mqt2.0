"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Languages, LoaderCircle } from "lucide-react";

const PUBLISHED_PREVIEW_ORIGIN = "https://mqt2-0.vercel.app";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "zh-CN", label: "Mandarin", native: "中文" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "ru", label: "Russian", native: "Русский" },
  { code: "he", label: "Hebrew", native: "עברית" },
  { code: "ja", label: "Japanese", native: "日本語" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
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
  const [open, setOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setLanguage(selectedLanguage()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const closeOnOutsidePress = (event: MouseEvent) => {
      if (!selectorRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const handleLanguageChange = (nextLanguage: LanguageCode) => {
    const current = new URL(window.location.href);
    const sourceUrl = translatedSourceUrl(current);

    setLanguage(nextLanguage);
    setOpen(false);

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

  const internationalLanguages = LANGUAGES.slice(0, 7);
  const indianLanguages = LANGUAGES.slice(7);

  return (
    <div
      ref={selectorRef}
      className={`notranslate relative ${mobile ? "w-full" : "ml-2"}`}
      translate="no"
    >
      <button
        type="button"
        aria-label="Choose website language"
        aria-expanded={open}
        aria-controls={menuId}
        disabled={navigating}
        onClick={() => setOpen((value) => !value)}
        className={`group inline-flex w-full items-center gap-2 rounded-full border font-bold shadow-[0_6px_18px_rgba(5,48,42,0.12)] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:cursor-wait ${
          mobile
            ? "min-h-11 border-white/20 bg-white/10 px-3 text-sm text-white hover:bg-white/15 focus-visible:ring-offset-brand-forest"
            : "min-h-10 border-brand-forest/15 bg-white/95 px-2.5 text-xs text-brand-forest hover:-translate-y-px hover:border-brand-orange/50 hover:shadow-[0_10px_24px_rgba(5,48,42,0.16)] focus-visible:ring-offset-white"
        }`}
      >
        <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${mobile ? "bg-white/15" : "bg-brand-forest text-white"}`}>
          {navigating ? <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin" /> : <Languages aria-hidden="true" className="h-3.5 w-3.5" />}
        </span>
        <span className="min-w-0 flex-1 text-left leading-tight">
          <span className={`block text-[9px] font-semibold uppercase tracking-[0.14em] ${mobile ? "text-white/60" : "text-brand-forest/55"}`}>Language</span>
          <span className="block truncate text-[11px] font-extrabold">{currentLanguage.label}</span>
        </span>
        <span className={`rounded-full px-1.5 py-1 text-[9px] tracking-wider ${mobile ? "bg-white/15" : "bg-brand-paper text-brand-forest"}`}>
          {currentLanguage.code.toUpperCase()}
        </span>
        <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 transition duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Website languages"
          className={`language-menu absolute z-[90] overflow-hidden rounded-2xl border border-brand-forest/10 bg-white p-2 text-brand-forest shadow-[0_20px_54px_rgba(5,48,42,0.26)] ${
            mobile ? "bottom-[calc(100%+10px)] left-0 w-full" : "right-0 top-[calc(100%+10px)] w-[340px]"
          }`}
        >
          <div className="mb-1 flex items-center justify-between px-2 py-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-forest/55">Choose your language</span>
            <span className="rounded-full bg-brand-paper px-2 py-0.5 text-[9px] font-bold text-brand-forest/70">{LANGUAGES.length} options</span>
          </div>
          <LanguageGroup languages={internationalLanguages} selected={language} onSelect={handleLanguageChange} label="Global" />
          <LanguageGroup languages={indianLanguages} selected={language} onSelect={handleLanguageChange} label="Indian languages" />
        </div>
      ) : null}
    </div>
  );
}

function LanguageGroup({
  languages,
  selected,
  onSelect,
  label,
}: {
  languages: readonly (typeof LANGUAGES)[number][];
  selected: LanguageCode;
  onSelect: (language: LanguageCode) => void;
  label: string;
}) {
  return (
    <div className="border-t border-brand-forest/8 px-1 py-2 first:border-t-0">
      <p className="px-2 pb-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-brand-orange">{label}</p>
      <div className="grid grid-cols-2 gap-1">
        {languages.map((item) => {
          const active = selected === item.code;
          return (
            <button
              key={item.code}
              type="button"
              role="menuitemradio"
              aria-checked={active}
              onClick={() => onSelect(item.code)}
              className={`flex min-h-10 items-center gap-2 rounded-xl px-2 text-left transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
                active
                  ? "bg-brand-forest text-white shadow-sm"
                  : "text-brand-forest hover:bg-brand-paper"
              }`}
            >
              <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-extrabold ${active ? "bg-white/20" : "bg-brand-paper text-brand-forest/70"}`}>
                {active ? <Check aria-hidden="true" className="h-3 w-3" /> : item.code.split("-")[0].toUpperCase()}
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-[11px] font-bold">{item.label}</span>
                <span className={`block truncate text-[10px] ${active ? "text-white/70" : "text-brand-forest/55"}`}>{item.native}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
