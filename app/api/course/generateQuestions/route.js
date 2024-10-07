// /api/course/generateQuestions

import { NextResponse } from "next/server";
// import strict_output from "@/lib/gpt";
import { generateContent } from "@/lib/gemini";
import { getAuthSession } from "@/lib/auth";

export async function POST(req, res) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const baseText = {
      text: `You have one single task. The user will give you a topic he wants to learn about and you need to generate 2 simple question (\"question1\", \"question2\") that would help create more context about what the user\'s needs are. The questions are meant to clarify where the users stands in his journey of learning about that topic.  For example: \"Do you have any prior knowledge about the topic?\" is a good starting question. You must not ask any questions related to the method of learning, because the user will only learn by watching youtube videos.
    
    Please provide a response in a structured JSON format that matches the following model: 
    {
      \"question1\":
      {
        \"text\": \"Question number 1\",
      },
      \"question2\":
      {
        \"text\": \"Question number 2\",
      }
    }
    The topic is: `,
    };

    // let output_units = await strict_output(
    //   "You are an very fast AI capable of generating questions that help create more context about the needs of the user when  it comes to learning about a new topic",
    //   `Your only task is to craft 3 questions that the user must answer to help you, the AI, understand what are the user's needs. Your questions should begin by assuming no prior knowledge about the topic the user wishes to learn, gradually progressing to more specific questions pertaining to the topic to effectively address the user's unique learning requirements in the context of learning the topic. These 3 questions should be concise and succinct, not exceeding 15 words each, BE BRIEF. The questions must have the intention to help understand exactly what type of course the user needs, they can be simmilar to something like: "Do you have any prior knowledge about the topic?" or "What is the final goal of learning about this topic?". The questions should not ask about the user's preferred learning method, so the questions should not ask if the user wants to learn by reading, watching videos or other ways, that is because the course he will watch will be in video format. The generation should be quick and fast. The user seeks to learn about: ${body.courseTheme}`,
    //   { questions: "an array of 3 questions" },
    // );
    // console.log(output_units);

    const res = await generateContent(baseText, body.courseTheme);

    return NextResponse.json(res);
  } catch (err) {
    console.log("problema este:");
    console.error(err);

    return new NextResponse(err.message, { status: 400 });
  }
}
