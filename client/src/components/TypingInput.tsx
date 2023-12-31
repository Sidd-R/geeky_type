"use client";

import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useTyping from "react-typing-game-hook";
import Cookies from "js-cookie";
import {toast} from "react-toastify";
import { usePreferenceContext } from "@/context";

type TypingInputProps = {
  text: string;
  time: string;
} & React.ComponentPropsWithRef<"input">;

const TypingInput = React.forwardRef<HTMLInputElement, TypingInputProps>(
  ({ text,time }, ref) => {
    
    const {
      preferences: { isOpen },
    } = usePreferenceContext();
    const [duration, setDuration] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const letterElements = useRef<HTMLDivElement>(null);
    const [timeLeft, setTimeLeft] = useState(() => parseInt(time));
    const [realTimeWPM, setRealTimeWPM] = useState(0);
    // let time = "15"
    const {
      states: {
        charsState,
        currIndex,
        phase,
        correctChar,
        errorChar,
        startTime,
        endTime,
      },
      actions: { insertTyping, deleteTyping, resetTyping, endTyping },
    } = useTyping(text, { skipCurrentWordOnSpace: false });

    const [margin, setMargin] = useState(0);
    const [value, setValue] = useState("");

    const pos = useMemo(() => {
      if (currIndex !== -1 && letterElements.current) {
        const spanref: any = letterElements.current.children[currIndex];
        const left = spanref.offsetLeft + spanref.offsetWidth - 2;
        const top = spanref.offsetTop - 2;
        if (top > 60) {
          setMargin((margin) => margin + 1);
          return {
            left,
            top: top / 2,
          };
        }
        return { left, top };
      } else {
        return {
          left: -2,
          top: 2,
        };
      }
    }, [currIndex]);

    useEffect(() => {
      setValue("");
      setMargin(0);
      setTimeLeft(parseInt(time));
      endTyping();
      resetTyping();
    }, [text, time]);

    const realTimeWPMRef = useRef(realTimeWPM);
    realTimeWPMRef.current = realTimeWPM;

    useEffect(() => {
      let timerInterval : NodeJS.Timeout;
      if (startTime) {
        timerInterval = setInterval(() => {
          setTimeLeft((timeLeft) => {
            if (timeLeft <= 1) {
              clearInterval(timerInterval);
              endTyping();
              const _id = Cookies.get("_id");
              if (_id) {
                const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL+"api/test/new";

                fetch(apiUrl, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    score: realTimeWPMRef.current, // Use the ref value
                    id: _id,
                  }),
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("API request failed");
                    }
                    return response.json();
                  })
                  .then((data) => {
                    toast.success("Game data saved successfully!", {
                      position: "top-center",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                  })
                  .catch((error) => {
                    console.error(error);
                    
                  });
              }
              return 0;
            } else {
              return timeLeft - 1;
            }
          });
        }, 1000);
      }

      return () => {
        clearInterval(timerInterval);
      };
    }, [startTime, endTyping]);
    

    useEffect(() => {
      if (phase === 2 && endTime && startTime) {
        const dur = Math.floor((endTime - startTime) / 1000);
        setDuration(dur);
      } else {
        setDuration(0);
      }
    }, [phase, startTime, endTime]);

    const handleKeyDown = (letter: string, control: boolean) => {
      if (letter === "Backspace") {
        const spanref: any = letterElements?.current?.children[currIndex];
        const top = spanref?.offsetTop - 2;

        if (top < 0) {
          return;
        }
        deleteTyping(control);
      } else if (letter.length === 1) {
        insertTyping(letter);
      }
    };

    useEffect(() => {
      let interval: NodeJS.Timeout | null = null;
      if (phase === 1 && startTime) {
        interval = setInterval(() => {
          const timeElapsedInSeconds = Math.floor(
            (Date.now() - startTime) / 1000
          );
          const typedWords = Math.floor(correctChar / 5); // Assume an average word length of 5 characters
          const currentWPM = Math.round(
            (60 * typedWords) / timeElapsedInSeconds
          );
          setRealTimeWPM(currentWPM);
        }, 100);
      }

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [phase, startTime, correctChar]);

    return (
      <div className='relative w-full max-w-[950px]'>
        <span className='absolute left-0 -top-[3.25rem] z-40 text-4xl text-fg/80'>
          {timeLeft}
        </span>

        <div
          className={clsx(
            'relative z-40 h-[200px] w-full text-2xl outline-none'
          )}
          onClick={() => {
            if (ref != null && typeof ref !== "function") {
              ref?.current?.focus();
            }
            setIsFocused(true);
          }}
        >
          <input
            type="text"
            className="absolute left-0 top-0 z-20 h-full w-full cursor-default opacity-0"
            tabIndex={1}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={value}
            onChange={(e) => {
              setValue((prev) => {
                if (prev.length > e.target.value.length) {
                  handleKeyDown("Backspace", false);
                } else {
                  handleKeyDown(e.target.value.slice(-1), false);
                }
                return e.target.value;
              });
            }}
            onKeyDown={(e) => {
              if (isOpen) {
                setIsFocused(false);
                return;
              }
              if (e.ctrlKey) return;
              if (
                ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                  e.key
                )
              )
                e.preventDefault();
            }}
          />
          <span
            className={clsx(
              "absolute z-20 flex h-full w-full cursor-default items-center justify-center text-base opacity-0 transition-all duration-200",
              { " opacity-100  text-gray-600": !isFocused }
            )}
          >
            Click to focus
          </span>
          <div
            className={clsx(
              "absolute top-0 left-0 mb-4 h-full w-full overflow-hidden text-justify leading-relaxed tracking-wide transition-all duration-200",
              { "opacity-40 blur-[8px]": !isFocused }
            )}
          >
            <div
              ref={letterElements}
              style={
                margin > 0
                  ? {
                      marginTop: -(margin * 39),
                    }
                  : {
                      marginTop: 0,
                    }
              }
            >
              {text.split("").map((letter, index) => {
                const state = charsState[index];
                const color =
                  state === 0
                    ? "text-font"
                    : state === 1
                    ? "text-fg"
                    : "text-hl border-b-2 border-hl";
                return (
                  <span
                    key={letter + index}
                    className={`${color} ${
                      state === 0 &&
                      index < currIndex &&
                      "border-b-2 border-hl text-hl"
                    }`}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>
          </div>
          {isFocused ? (
            <span
              style={{
                left: pos.top < 0 ? -2 : pos.left,
                top: pos.top < 0 ? 2 : pos.top + 2,
              }}
              className={clsx("caret text-hl", {
                "-mt-[2px]": currIndex === -1,
                "animate-blink": phase === 0,
              })}
            >
              {phase === 2 ? (
                <div className="group relative z-40">
                  {/* <BsFlagFill className='-mb-[8px] text-fg' /> */}
                </div>
              ) : (
                "|"
              )}
            </span>
          ) : null}
        </div>
        <div className="relative z-40 mt-4 flex w-full flex-col flex-wrap items-center justify-center gap-4 text-sm">
          {phase === 2 && startTime && endTime ? (
            <div className="grid grid-rows-3 items-center gap-4 rounded-lg px-4 py-1 text-xl font-bold sm:flex">
              <span className="text-4xl">
                {Math.round(((60 / duration) * correctChar) / 5)}
                <span className="text-base">WPM</span>
              </span>
              <span className="text-4xl">
                {duration}
                <span className="text-2xl">s</span>
              </span>
              <span className="relative text-4xl">
                {(((correctChar - errorChar) / (currIndex + 1)) * 100).toFixed(
                  2
                )}
                %
                <span className="absolute -bottom-4 right-1 text-sm">
                  ACCURACY
                </span>
              </span>
            </div>
          ) : null}

          {phase === 1 && startTime && (
            <div className="grid grid-rows-3 items-center gap-4 rounded-lg px-4 py-1 text-xl font-bold sm:flex">
              <span className="text-4xl">
                {realTimeWPM}
                <span className="text-base">WPM</span>
              </span>
            </div>
          )}

          <div className="flex gap-4"></div>
        </div>
      </div>
    );
  }
);
TypingInput.displayName = 'TypingInput';

export default TypingInput;