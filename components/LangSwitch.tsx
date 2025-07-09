import { useFilter } from "@/context/filter";

const LangSwitch = () => {
    const { postLanguage, onLanguageChange } = useFilter();
  
    return (
      <div className="ml-4 flex gap-2">
        <button
          onClick={() => onLanguageChange?.("fr")}
          className={`px-2 py-1 text-sm rounded ${
            postLanguage === "fr" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          FR
        </button>
        <button
          onClick={() => onLanguageChange?.("en")}
          className={`px-2 py-1 text-sm rounded ${
            postLanguage === "en" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          EN
        </button>
      </div>
    );
  };

  export default LangSwitch;