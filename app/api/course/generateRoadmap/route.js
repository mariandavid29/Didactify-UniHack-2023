import { NextResponse } from "next/server";
// import strict_output from "@/lib/gpt";

import { generateContentWithQuestions } from "@/lib/gemini";

import prisma from "@/lib/db";

import { getAuthSession } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("Suntem in endpoint");

    const { courseTheme, answers } = await req.json();

    const baseText = {
      text: `You only have one job, to create a course roadmap, with 2 units, each unit containing 2 lessons based on a topic that you will receive. Each unit should have an \"unit_name\" and 2 lessons (\"lesson1\", \"lesson2\")

        Please provide a response in a structured JSON format that matches the following model: 
    {
      \"unit1\": {
        \"unit_name\": \"Name of unit1\",
        \"lessons\": [
              {
                lesson_name: \"Name of lesson1\",
                youtube_search_query: \"Search query for lesson1\"
              }, 
              {
                lesson_name: \"Name of lesson2\",
                youtube_search_query: \"Search query for lesson2\"
              }
        ]
      },
      \"unit2\": {
        \"unit_name\": \"Name of unit2\",
        \"lessons\": [
              {
                lesson_name: \"Name of lesson1\",
                youtube_search_query: \"Search query for lesson1\"
              }, 
              {
                lesson_name: \"Name of lesson2\",
                youtube_search_query: \"Search query for lesson2\"
              }
        ]
      }
    }`,
    };

    console.log(courseTheme, answers);

    const res = await generateContentWithQuestions(
      baseText,
      courseTheme,
      answers,
    );

    console.log(res);

    // let output_units = await strict_output(
    //   "You are a very fast AI capable of curating course content, and you ARE BRIEF",
    //   `You are capable of coming up with a course that contains relevant unit titles, and identifying pertinent YouTube videos for each lesson of the unit. Your task is to design a course about ${courseTheme} made out of a maximum of 4 units, each unit containing a maximum of 3 lessons, to give you more context, use this vector of questions and answers about the topic of the course to generate a more tailored course: ${answers}. For each lesson, provide a detailed YouTube search query that can be used to locate an informative and educational video. Each query should yield an educational and informative YouTube lesson. BE BRIEF`,
    //   {
    //     course:
    //       "an array of objects, each object containg the unit title (unitTitle) and a lessons array, each lesson from the lessons array should have a youtube_search_query and a lesson_title key in the JSON object",
    //   },
    // );

    const course = await prisma.course.create({
      data: {
        name: courseTheme,
        userId: session.id,
      },
    });

    for (const unit of res) {
      const title = unit.unit_name;
      const prismaUnit = await prisma.unit.create({
        data: {
          name: title,
          courseId: course.id,
        },
      });
      await prisma.lesson.createMany({
        data: unit.lessons.map((lesson) => {
          return {
            name: lesson.lesson_name,
            youtubeSearchQuery: lesson.youtube_search_query,
            unitId: prismaUnit.id,
          };
        }),
      });
    }

    return NextResponse.json({ courseId: course.id }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "NOT OK" }, { status: 400 });
  }
}
