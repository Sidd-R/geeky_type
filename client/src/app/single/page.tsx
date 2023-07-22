"use client";
import TypingArea from "@/components/TypingArea";
import * as React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePreferenceContext } from "@/context";
import { useState,useEffect } from "react";
// import Box from '@/components/Game/Box';
// import Kbd from '@/components/Kbd';
// import AnimateFade from '@/components/Layout/AnimateFade';
// import Seo from '@/components/Seo';

export default function SoloPage() {
  const difficultyOptions = ["1", "2", "3"];
  const timeOptions = ["15", "30", "45", "60"];
  const {
    preferences: { theme, type, time },
    dispatch,
  } = usePreferenceContext();
  const [selectedDifficulty, setSelectedDifficulty] = useState(type);
  const [selectedTime, setSelectedTime] = useState("15");

  useEffect(() => {
    dispatch({ type: "setTime", payload: selectedTime });

  }, [selectedTime])

  useEffect(() => {
    dispatch({ type: "setType", payload: selectedDifficulty });

  }, [selectedTime])
  
  return (
    <>
      {/* <AnimateFade> */}
      {/* <Seo title='Monkeytype Clone' /> */}

      <main>
        <section>
          <div className="pt-5 flex flex-row justify-evenly">
            <div>
              {/* Theme Options */}
              <h3 className="">Difficulty:</h3>
              <div>
                {difficultyOptions.map((option) => (
                  <label key={option}>
                    <input
                      type="radio"
                      value={option}
                      checked={selectedDifficulty === option}
                      onChange={(e) => {
                        setSelectedDifficulty(e.target.value);
                        if (selectedDifficulty !== "") {
                          dispatch({ type: "setType", payload: selectedDifficulty });
                        }
                      }}
                      className="mx-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <div>
              {/* Time Options */}
              <h3>Time:</h3>
              <div>
                {timeOptions.map((option) => (
                  <label key={option}>
                    <input
                      type="radio"
                      value={option}
                      checked={selectedTime === option}
                      onChange={(e) => {
                        setSelectedTime(e.target.value);
                        // dispatch({ type: "setTime", payload: e.target.value });
                      }}
                      className="mx-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="layout flex flex-col items-center pt-36 text-center relative">
            {/* <Box /> */}
            <TypingArea time={selectedTime} diff={selectedDifficulty}/>
          </div>
        </section>
        <ToastContainer />
      </main>
      {/* </AnimateFade> */}
    </>
  );
}
