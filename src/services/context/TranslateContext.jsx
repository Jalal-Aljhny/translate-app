import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import translate from "../apis/TranslateApi";
import propTypes from "prop-types";

const worldLanguages = [
  { language: "English", code: "en" },
  { language: "French", code: "fr" },
  { language: "Spanish", code: "es" },
  { language: "Arabic", code: "ar" },
  { language: "German", code: "de" },
  { language: "Chinese ", code: "zh" },
  { language: "Japanese", code: "ja" },
  { language: "Korean", code: "ko" },
  { language: "Russian", code: "ru" },
  { language: "Portuguese", code: "pt" },
  { language: "Italian", code: "it" },
  { language: "Dutch", code: "nl" },
  { language: "Swedish", code: "sv" },
  { language: "Norwegian", code: "no" },
  { language: "Finnish", code: "fi" },
  { language: "Danish", code: "da" },
  { language: "Turkish", code: "tr" },
  { language: "Vietnamese", code: "vi" },
  { language: "Thai", code: "th" },
  { language: "Greek", code: "el" },
  { language: "Indonesian", code: "id" },
  { language: "Hungarian", code: "hu" },
  { language: "Czech", code: "cs" },
  { language: "Romanian", code: "ro" },
  { language: "Hebrew", code: "he" },
];
export const TranslateContext = createContext();

const initialResponse = {
  data: null,
  loading: false,
  error: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, data: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export const TranslateProvider = ({ children }) => {
  const [language, setLanguage] = useState("English");
  const [translated, setTranslated] = useState("French");
  const [state, dispatch] = useReducer(reducer, initialResponse);
  const [text, setText] = useState("Hello, how are you?");
  const isMount = useRef(false);

  const fetchData = useCallback(async (text, language, translated) => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await translate(text, language, translated);
      dispatch({
        type: "FETCH_SUCCESS",
        payload: data,
      });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  }, []);

  useEffect(() => {
    if (!isMount.current) {
      fetchData(
        text,
        worldLanguages[findIndexByLan(worldLanguages, language)].code,
        worldLanguages[findIndexByLan(worldLanguages, translated)].code
      );
      isMount.current = true;
    }
  }, [fetchData, text, language, translated]);

  const findIndexByLan = (array, lan) => {
    return array.findIndex(
      (obj) => obj.language.toLowerCase() === lan.toLowerCase()
    );
  };

  return (
    <TranslateContext.Provider
      value={{
        worldLanguages,
        language,
        setLanguage,
        translated,
        setTranslated,
        text,
        setText,
        ...state,
        fetchData,
        findIndexByLan,
      }}
    >
      {children}
    </TranslateContext.Provider>
  );
};

export default TranslateContext;
TranslateProvider.propTypes = {
  children: propTypes.oneOfType([propTypes.string, propTypes.element]),
};
