import { LanguageType, useFilter } from "@/context/filter";

const LangSwitch = () => {
    const { postLanguage, onLanguageChange } = useFilter();
    const languages: LanguageType[] = ["fr", "en"];
  
    return (
      <div className="z-50 flex gap-2 bg-bglight/80 dark:bg-bgdark/80 p-2 rounded shadow dark:shadow-black/50">
      {languages.map((lang) => {
        const isActive = postLanguage === lang;
        const baseClasses = "px-2 py-1 text-sm rounded";
        const activeClasses =
          "bg-bgdark text-textlight dark:bg-bglight dark:text-black";
        const inactiveClasses =
          "bg-bglight dark:bg-bgdark dark:text-textlight";

        return (
          <button
            key={lang}
            onClick={() => onLanguageChange?.(lang)}
            className={`${baseClasses} ${
              isActive ? activeClasses : inactiveClasses
            }`}
          >
            {lang.toUpperCase()}
          </button>
        );
      })}
    </div>
    );
  };

  export default LangSwitch;