"use client";

import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useState } from "react";

import { useRouter } from "next/navigation";

let courseTheme;

const formSchema = z.object({
  topic: z
    .string()
    .min(2, {
      message: "Topic must be at least 2 characters.",
    })
    .max(100, {
      message: "Topic must be less than 100 characters.",
    }),
});

export default function CreateForm({
  generatedQuestions,
  setGeneratedQuestions,
}) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  async function onSubmit(values) {
    if (!generatedQuestions || generatedQuestions.length === 0) {
      try {
        setIsLoading(true);
        courseTheme = values.topic;
        const res = await axios.post("/api/course/generateQuestions", {
          courseTheme,
        });
        setGeneratedQuestions(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    } else if (currentQuestion < generatedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswers([
        ...answers,
        { question: generatedQuestions[currentQuestion], answer: values.topic },
      ]);
    } else {
      setAnswers([
        ...answers,
        { question: generatedQuestions[currentQuestion], answer: values.topic },
      ]);
      console.log(answers, {
        question: generatedQuestions[currentQuestion],
        answer: values.topic,
      });
      try {
        setIsLoading(true);
        answers.push({
          question: generatedQuestions[currentQuestion],
          answer: values.topic,
        });
        console.log(answers);
        const res = await axios.post("/api/course/generateRoadmap", {
          courseTheme,
          answers,
        });
        console.log(res.data.courseId);
        router.push(`/dashboard/createCourse/${res.data.courseId}`);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-[90%] max-w-2xl flex-col gap-3"
      >
        {generatedQuestions && generatedQuestions.length > 0 ? (
          <FormField
            control={form.control}
            name="topic"
            className="w-full"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col items-start justify-start gap-3">
                <FormLabel className="flex w-full flex-col items-start justify-center gap-2">
                  <p className="text-xl sm:text-2xl">
                    {generatedQuestions[currentQuestion]}
                  </p>
                  <p className=" text-zinc-400 ">
                    <span className="text-primary">&#9432;</span> Give a short
                    response to the question below or write -.
                  </p>
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-14"
                    placeholder="your response"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="topic"
            className="w-full"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col items-start justify-start gap-3">
                <FormLabel className="flex flex-col gap-1">
                  <p className="text-xl sm:text-2xl">Topic</p>
                  <p className="text-zinc-400">
                    <span className="text-primary ">&#9432;</span> Write a topic
                    you want to learn about. You should be concise.
                  </p>
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-14"
                    placeholder="ex: playing the guitar"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {generatedQuestions && generatedQuestions.length > 0 ? (
          <Button disabled={isLoading} className="h-14 text-lg" type="submit">
            <div className="flex items-center justify-center gap-2">
              <span>
                {currentQuestion < generatedQuestions.length - 1
                  ? "Next"
                  : "Submit"}
              </span>
              {isLoading && (
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
            </div>
          </Button>
        ) : (
          <Button type="submit" className="h-14 text-lg" disabled={isLoading}>
            <div className="flex items-center justify-center gap-2">
              <span>Submit</span>
              {isLoading && (
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
            </div>
          </Button>
        )}
      </form>
    </Form>
  );
}
