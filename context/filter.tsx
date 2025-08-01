import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

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

const useProvideFilter = () => {
  const { i18n } = useTranslation();
  const [searchText, setSearchText] = useState("");
  // Important : valeur initiale fixe côté SSR, puis on corrige au mount
  const [postLanguage, setPostLanguage] = useState<LanguageType>("en");
  const [mounted, setMounted] = useState(false);

  // Dès le mount, on récupère la langue depuis i18n (qui lit localStorage automatiquement)
  useEffect(() => {
    setPostLanguage(i18n.language as LanguageType);
    setMounted(true);
  }, [i18n.language]);

  // Permet de changer la langue *et* de déclencher les effets associés
  const onLanguageChange = useCallback((val: LanguageType) => {
    i18n.changeLanguage(val);
    setPostLanguage(val);
  }, [i18n]);

  const onSearch = useCallback((val: string) => setSearchText(val), []);

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
