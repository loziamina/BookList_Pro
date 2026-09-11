import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { translations, type Locale, type Translations } from "@/i18n/translations";

type I18nContextValue = {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
  formatDate: (isoDate: string) => string;
  formatNumber: (value: number) => string;
};

const I18nContext = createContext<I18nContextValue>({
  locale: "fr",
  t: translations.fr,
  setLocale: () => {},
  formatDate: (isoDate) =>
    new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(isoDate)),
  formatNumber: (value) => new Intl.NumberFormat("fr-FR").format(value),
});

const STORAGE_KEY = "booklist:locale";
const SUPPORTED_LOCALES: Locale[] = ["fr", "en"];

function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") {
    return "fr";
  }

  const lang = navigator.language.slice(0, 2);
  return SUPPORTED_LOCALES.includes(lang as Locale) ? (lang as Locale) : "fr";
}

function loadStoredLocale(): Locale {
  if (typeof window === "undefined" || !window.localStorage) {
    return detectBrowserLocale();
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
    return stored as Locale;
  }

  return detectBrowserLocale();
}

export function I18nProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<Locale>(() => loadStoredLocale());

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, locale);
    }
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    const localeTag = locale === "fr" ? "fr-FR" : "en-US";

    return {
      locale,
      t: translations[locale],
      setLocale: setLocaleState,
      formatDate: (isoDate: string) =>
        new Intl.DateTimeFormat(localeTag, {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(isoDate)),
      formatNumber: (value: number) => new Intl.NumberFormat(localeTag).format(value),
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
