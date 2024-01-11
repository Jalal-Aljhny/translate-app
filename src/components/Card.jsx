import propTypes from "prop-types";
import toggle from "../assets/Horizontal_top_left_main.svg";
import expand from "../assets/Expand_down.svg";
import sound from "../assets/sound_max_fill.svg";
import copy from "../assets/Copy.svg";
import alfa from "../assets/Sort_alfa.svg";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import TranslateContext from "../services/context/TranslateContext";

const Card = ({ type }) => {
  const {
    worldLanguages,
    language,
    translated,
    text,
    setLanguage,
    setTranslated,
    setText,
    data,
    loading,
    error,
    fetchData,
    findIndexByLan,
  } = useContext(TranslateContext);
  const [thirdLang, setThirdLang] = useState(worldLanguages[2]?.language);
  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(2);
  const translatedField = useRef();
  const [voiceError, setVoiceError] = useState(null);
  const lanActiveRef = useRef([]);
  const transActiveRef = useRef([]);
  const [copied, setCopied] = useState(false);

  const selectLanguage = useCallback(
    (lan) => {
      if (type == "translation") {
        setLanguage(lan);
      } else {
        setTranslated(lan);
      }
    },
    [setLanguage, setTranslated, type]
  );
  const handleMenu = useCallback(() => {
    setShow(!show);
  }, [setShow, show]);
  const voiceBtn = useCallback((text, lan) => {
    try {
      console.log(lan);
      let synth = window.speechSynthesis;
      let utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lan;
      synth.speak(utterance);
      setVoiceError(null);
    } catch (error) {
      setVoiceError(error.message);
    }
  }, []);

  const copyText = useCallback((text) => {
    navigator.clipboard.writeText(text);
  }, []);

  const swapLan = useCallback(
    (lan1, lan2) => {
      setLanguage(lan2);
      setTranslated(lan1);
    },
    [setLanguage, setTranslated]
  );

  useEffect(() => {
    if (type === "translation") {
      let index = findIndexByLan(worldLanguages, language);
      if (index > 2) {
        index = 2;
      }
      for (let i = 0; i < lanActiveRef.current.length; i++) {
        lanActiveRef.current[i].classList.remove("active");
      }
      lanActiveRef.current[index].classList.add("active");
    } else {
      let index = findIndexByLan(worldLanguages, translated);
      if (index > 2) {
        index = 2;
      }
      for (let i = 0; i < transActiveRef.current.length; i++) {
        transActiveRef.current[i].classList.remove("active");
      }
      transActiveRef.current[index].classList.add("active");
    }
  }, [language, translated, type, findIndexByLan, worldLanguages]);

  const handleCopied = () => {
    setCopied(!copied);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <section
      className={`card ${
        type === "translation" ? "translation" : "translated"
      }`}
    >
      <div className="card_head">
        {type === "translation" ? <h1>Detect language</h1> : null}
        <p
          ref={(el) => {
            type === "translation"
              ? (lanActiveRef.current[0] = el)
              : (transActiveRef.current[0] = el);
          }}
          onClick={(e) => {
            selectLanguage(e.target.textContent);
          }}
        >
          {worldLanguages[0]?.language}
        </p>
        <p
          ref={(el) => {
            type === "translation"
              ? (lanActiveRef.current[1] = el)
              : (transActiveRef.current[1] = el);
          }}
          onClick={(e) => {
            selectLanguage(e.target.textContent);
          }}
        >
          {worldLanguages[1]?.language}
        </p>
        <div
          className="select"
          onClick={() => {
            handleMenu();
          }}
        >
          <p
            ref={(el) => {
              type === "translation"
                ? (lanActiveRef.current[2] = el)
                : (transActiveRef.current[2] = el);
            }}
            onClick={(e) => {
              selectLanguage(e.target.textContent);
            }}
          >
            {thirdLang}
          </p>
          <img src={expand} alt="expand down" />
          <ul className={`${show ? "" : "hidden"}`}>
            {worldLanguages.map((v, i) => {
              if (i != index && i !== 1 && i !== 0) {
                return (
                  <li
                    key={v.code}
                    onClick={() => {
                      if (type === "translation") {
                        setLanguage(v.language);
                      } else {
                        setTranslated(v.language);
                      }
                      setThirdLang(v.language);
                      setIndex(worldLanguages.indexOf(v));
                      handleMenu();
                    }}
                  >
                    {v.language}
                  </li>
                );
              }
            })}
          </ul>
        </div>
        {type === "translated" ? (
          <img
            src={toggle}
            alt="toggle icon"
            className="icon "
            onClick={() => {
              swapLan(language, translated);
            }}
          />
        ) : null}
      </div>

      <div className="tranlation_field">
        {type === "translation" ? (
          <textarea
            maxLength={500}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          >
            {text}
          </textarea>
        ) : (
          <p
            className={error ? "error" : ""}
            ref={translatedField}
            style={
              translated.toLowerCase() == "arabic" ? { textAlign: "end" } : null
            }
          >
            {data && !error && !loading
              ? data.responseData.translatedText
              : null}
            {!data && error && !loading ? error : null}
            {loading ? "loading ..." : null}
          </p>
        )}
        <div className="tran_actions">
          <div className="icons">
            <img
              src={sound}
              alt="toggle icon"
              className={`icon ${voiceError ? "error" : null}`}
              title={voiceError ? "error" : ""}
              onClick={() => {
                {
                  type == "translation"
                    ? voiceBtn(
                        text,
                        worldLanguages[findIndexByLan(worldLanguages, language)]
                          .code
                      )
                    : voiceBtn(
                        translatedField.current.outerText,
                        worldLanguages[
                          findIndexByLan(worldLanguages, translated)
                        ].code
                      );
                }
              }}
            />
            <div className="show">
              <small className={copied ? "clicked" : null}>
                Copied &#10003;
              </small>
              <img
                src={copy}
                alt="toggle icon"
                className="icon"
                onClick={() => {
                  type == "translation"
                    ? copyText(text)
                    : copyText(translatedField.current.outerText);
                  handleCopied();
                }}
              />
            </div>
          </div>
          {type === "translation" ? (
            <div
              className="trans_btn"
              onClick={() => {
                fetchData(
                  text,
                  worldLanguages[findIndexByLan(worldLanguages, language)].code,
                  worldLanguages[findIndexByLan(worldLanguages, translated)]
                    .code
                );
              }}
            >
              <img src={alfa} alt="alfa icon" />
              <p>Translate</p>
            </div>
          ) : null}
        </div>
        {type === "translation" ? (
          <p className={`count ${text.length == 500 ? "full" : ""}`}>
            {text.length}/500{" "}
          </p>
        ) : null}
      </div>
    </section>
  );
};

export default Card;
Card.propTypes = {
  type: propTypes.string,
};
