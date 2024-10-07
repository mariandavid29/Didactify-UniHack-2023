// /api/course/generateCourse

import { getAuthSession } from "@/lib/auth";

import prisma from "@/lib/db";
// import strict_output from "@/lib/gpt";

import { generateContent, generateContentSummary } from "@/lib/gemini";

import {
  getQuestionsFromTranscript,
  getTranscript,
  searchYoutube,
} from "@/lib/youtube";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await req.json();

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        {
          message: "NOT OK",
        },
        { status: 404 },
      );
    }
    const videoId = await searchYoutube(lesson.youtubeSearchQuery);

    let transcript = await getTranscript(videoId);
    let maxLength = 800;
    transcript = transcript.split(" ").slice(0, maxLength).join(" ");

    const summary = transcript.split(" ").slice(0, 200).join(" ");

    const baseText = {
      text: transcript,
    };

    // const summary = await generateContentSummary(baseText, transcript);

    // const { summary } = await strict_output(
    //   "You are an AI capable of summarising a youtube transcript",
    //   "summarise the youtube transcript in maximum 200 words, BE BRIEF. Do not mention the creators name or any giveaways or promo codes they do. Do not talk of the sponsors, or anything unrelated to the main topic, BE BRIEF, also do not introduce what the summary is about.\n" +
    //     transcript,
    //   { summary: "summary of the transcript" },
    // );

    const questions = await getQuestionsFromTranscript(baseText, lesson.name);

    await prisma.question.createMany({
      data: questions.map((question) => {
        let options = [
          question.question.question_ans,
          question.question.option1,
          question.question.option2,
          question.question.option3,
        ];
        options = options.sort(() => Math.random() - 0.5);
        return {
          question: question.question.question_text,
          correctAnswer: question.question.question_ans,
          answers: JSON.stringify(options),
          lessonId: lessonId,
        };
      }),
    });

    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        youtubeVideoId: videoId,
        summary: summary,
      },
    });
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "NOT OK",
      },
      { status: 500 },
    );
  }
}
