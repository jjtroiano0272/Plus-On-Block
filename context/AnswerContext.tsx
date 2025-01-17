import React, { createContext, ReactNode, useContext, useState } from "react";

interface AnswerContextType {
  submittedAnswer: string;
  correctAnswer: string;
  setSubmittedAnswer: (arg: string) => void;
  setCorrectAnswer: (arg: string) => void;

  numAnswered: number;
  setNumAnswered: (arg: number) => void;
  numCorrect: number;
  setNumCorrect: (arg: number) => void;

  selectedCharacter: string;
  setSelectedCharacter: (arg: string) => void;
}

const AnswerContext = createContext<AnswerContextType>({
  submittedAnswer: "",
  correctAnswer: "",
  setSubmittedAnswer: () => {
    throw new Error("setSubmittedAnswer not implemented");
  },
  setCorrectAnswer: () => {
    throw new Error("setCorrectAnswer not implemented");
  },

  numAnswered: 0,
  setNumAnswered: () => {},
  numCorrect: 0,
  setNumCorrect: () => {},

  selectedCharacter: "",
  setSelectedCharacter: () => {},
});

const AnswerProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("light");
  const [submittedAnswer, setSubmittedAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [numAnswered, setNumAnswered] = useState(0); // set to 19 for debug purposes to test ads
  const [numCorrect, setNumCorrect] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState("");

  return (
    <AnswerContext.Provider
      value={{
        submittedAnswer,
        setSubmittedAnswer,
        correctAnswer,
        setCorrectAnswer,

        numAnswered,
        setNumAnswered,
        numCorrect,
        setNumCorrect,

        selectedCharacter,
        setSelectedCharacter,
      }}
    >
      {children}
    </AnswerContext.Provider>
  );
};

const useAnswers = () => {
  return useContext(AnswerContext);
};

export { AnswerProvider, useAnswers };
