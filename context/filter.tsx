import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type LanguageType = "en" | "fr";

interface FilterInitialType {
  searchText: string;
  postLanguage: LanguageType;
  onSearch?: (val: string) => void;
  onLanguageChange?: (val: LanguageType) => void;
  mounted: boolean;
}

const LANG_STORAGE_KEY = "postLanguage";

export const filterContext = createContext<FilterInitialType>({
  searchText: "",
  postLanguage: "en",
  mounted: false,
});

export const ProvideFilter = ({ children }: { children: React.ReactNode }) => {
  const value = useProvideFilter();

  if (!value.mounted) return null;

  return <filterContext.Provider value={value}>{children}</filterContext.Provider>;
};

export const useFilter = () => useContext(filterContext);

const detectBrowserLang = (): LanguageType => {
  if (typeof navigator === "undefined") return "en";
  const l = navigator.language?.slice(0, 2).toLowerCase();
  return l === "fr" ? "fr" : "en";
};

const useProvideFilter = () => {
  const [searchText, setSearchText] = useState("");
  // Important : valeur initiale fixe côté SSR, puis on corrige au mount
  const [postLanguage, setPostLanguage] = useState<LanguageType>("en");
  const [mounted, setMounted] = useState(false);

  // Au mount (client), récupère la préférence stockée ou sinon la langue du navigateur
  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem(LANG_STORAGE_KEY) : null;
      const initial =
        stored === "fr" || stored === "en" ? (stored as LanguageType) : detectBrowserLang();

      setPostLanguage(initial);
    } catch {
      // si localStorage n'est pas dispo, fallback navigateur
      setPostLanguage(detectBrowserLang());
    } finally {
      setMounted(true);
    }
  }, []);

  // Persiste toute mise à jour de la langue
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(LANG_STORAGE_KEY, postLanguage);
      }
    } catch {
      // ignore
    }
  }, [postLanguage]);

  const onSearch = useCallback((val: string) => setSearchText(val), []);
  const onLanguageChange = useCallback((val: LanguageType) => setPostLanguage(val), []);

  return {
    searchText,
    postLanguage,
    onSearch,
    onLanguageChange,
    // Pour éviter un "flash" de mauvaise langue, on expose `mounted`
    // et on ne rend certains éléments qu'une fois `mounted === true`.
    mounted,
  };
};
