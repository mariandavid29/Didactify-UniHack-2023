"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const QuizCards = ({ lesson }) => {
  const [answers, setAnswers] = React.useState({});
  const [questionState, setQuestionState] = React.useState({});
  const checkAnswer = React.useCallback(() => {
    const newQuestionState = { ...questionState };
    lesson.questions.forEach((question) => {
      const user_answer = answers[question.id];
      if (!user_answer) return;
      if (user_answer === question.correctAnswer) {
        newQuestionState[question.id] = true;
      } else {
        newQuestionState[question.id] = false;
      }
      setQuestionState(newQuestionState);
    });
  }, [answers, questionState, lesson.questions]);
  return (
    <div className="my-16 flex-[1] px-3">
      <h1 className="text-center text-3xl font-bold">
        <span className="font-handwrite text-4xl text-primary">Concept</span>{" "}
        Check
      </h1>
      <div className="mt-2">
        {lesson.questions.map((question) => {
          const options = JSON.parse(question.answers);
          return (
            <div
              key={question.id}
              className={cn("mt-4 rounded-lg border border-secondary p-3", {
                "bg-green-700": questionState[question.id] === true,
                "bg-red-700": questionState[question.id] === false,
                "bg-secondary": questionState[question.id] === null,
              })}
            >
              <h1 className="text-lg font-semibold">{question.question}</h1>
              <div className="mt-2">
                <RadioGroup
                  onValueChange={(e) => {
                    setAnswers((prev) => {
                      return {
                        ...prev,
                        [question.id]: e,
                      };
                    });
                  }}
                >
                  {options.map((option, index) => {
                    return (
                      <div className="flex items-center space-x-2" key={index}>
                        <RadioGroupItem
                          value={option}
                          id={question.id + index.toString()}
                        />
                        <Label htmlFor={question.id + index.toString()}>
                          {option}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            </div>
          );
        })}
      </div>
      <Button className="mt-2 w-full" size="lg" onClick={checkAnswer}>
        Check Answer
      </Button>
    </div>
  );
};

export default QuizCards;
