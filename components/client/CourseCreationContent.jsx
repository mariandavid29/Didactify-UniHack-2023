"use client";

import { useState } from "react";
import CreateForm from "@/components/client/CreateForm";

export default function CourseCreationContent() {
  const [generatedQuestions, setGeneratedQuestions] = useState(null);
  return (
    <>
      {generatedQuestions ? (
        <h1 className="w-[90%] text-center text-4xl font-light sm:text-5xl md:text-6xl">
          <span className="font-handwrite text-primary">Answer</span>{" "}
          <br className="sm:hidden" /> the following questions
        </h1>
      ) : (
        <h1 className="w-[90%] text-center text-4xl font-light sm:text-5xl md:text-6xl">
          Let&apos;s <span className="font-handwrite text-primary">learn</span>{" "}
          something new
        </h1>
      )}
      <div className="flex w-full flex-col-reverse  items-center justify-start gap-16">
        <CreateForm
          generatedQuestions={generatedQuestions}
          setGeneratedQuestions={setGeneratedQuestions}
        />
      </div>
    </>
  );
}
