import React, { createContext, ReactNode, useContext, useState } from "react";

interface AnswerContextType {
  submittedAnswer: string;
  correctAnswer: string;
  setSubmittedAnswer: (arg: string) => void;
  setCorrectAnswer: (arg: string) => void;
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
});

const AnswerProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("light");
  const [submittedAnswer, setSubmittedAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  return (
    <AnswerContext.Provider
      value={{
        submittedAnswer,
        setSubmittedAnswer,
        correctAnswer,
        setCorrectAnswer,
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
