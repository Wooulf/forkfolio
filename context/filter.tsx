import React, { createContext, useContext, useState } from "react";

interface FilterInitialType {
  searchText: string;
  postLanguage: LanguageType;
  onSearch?: (val: string) => void;
  onLanguageChange?: (val: LanguageType) => void;
}

export type LanguageType = "all" | "en" | "fr";

export const filterContext = createContext<FilterInitialType>({
  searchText: "",
  postLanguage: "all",
});

export const ProvideFilter = ({ children }: { children: React.ReactNode }) => {
  const value = useProvideFilter();
  return (
    <filterContext.Provider value={value}>{children}</filterContext.Provider>
  );
};

export const useFilter = () => useContext(filterContext);

const useProvideFilter = () => {
  const [searchText, setSearchText] = useState("");
  const [postLanguage, setPostLanguage] = useState<LanguageType>("en");

  const onSearch = (val: string) => {
    setSearchText(val);
  };

  const onLanguageChange = (val: LanguageType) => {
    setPostLanguage(val);
  };

  return {
    searchText,
    postLanguage,
    onSearch,
    onLanguageChange,
  };
};
