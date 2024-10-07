import CourseSideBar from "@/components/CourseSideBar";
import MainVideoSummary from "@/components/MainVideoSummary";
import QuizCards from "@/components/client/QuizCards";
import prisma from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import LateralNav from "@/components/LateralNav";

const CoursePage = async ({ params: { slug } }) => {
  const [courseId, unitIndexParam, lessonIndexParam] = slug;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      units: {
        include: {
          lessons: {
            include: { questions: true },
          },
        },
      },
    },
  });
  if (!course) {
    return redirect("/");
  }
  let unitIndex = parseInt(unitIndexParam);
  let lessonIndex = parseInt(lessonIndexParam);

  const unit = course.units[unitIndex];
  if (!unit) {
    return redirect("/");
  }
  const lesson = unit.lessons[lessonIndex];
  if (!lesson) {
    return redirect("/");
  }
  const nextLesson = unit.lessons[lessonIndex + 1];
  const prevLesson = unit.lessons[lessonIndex - 1];
  return (
    <>
      <LateralNav />
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex w-full flex-col items-center justify-between gap-10 lg:flex-row">
          <MainVideoSummary
            lesson={lesson}
            lessonIndex={lessonIndex}
            unit={unit}
            unitIndex={unitIndex}
          />
          <CourseSideBar
            course={course}
            show="hidden lg:block"
            currentLessonId={lesson.id}
          />
        </div>

        <div className="mt-4 h-[1px] flex-[1] bg-gray-500 text-gray-500" />
        <div className="flex pb-8">
          {prevLesson && (
            <Link
              href={`/dashboard/course/${course.id}/${unitIndex}/${
                lessonIndex - 1
              }`}
              className="mr-auto mt-4 flex w-fit"
            >
              <div className="flex items-center">
                <div className="flex flex-col items-start">
                  <span className="text-sm text-secondary-foreground/60">
                    Previous
                  </span>
                  <span className="text-xl font-bold">{prevLesson.name}</span>
                </div>
              </div>
            </Link>
          )}

          {nextLesson && (
            <Link
              href={`/dashboard/course/${course.id}/${unitIndex}/${
                lessonIndex + 1
              }`}
              className="ml-auto mt-4 flex w-fit"
            >
              <div className="flex items-center">
                <div className="flex flex-col items-start">
                  <span className="text-sm text-secondary-foreground/60">
                    Next
                  </span>
                  <span className="text-xl font-bold">{nextLesson.name}</span>
                </div>
              </div>
            </Link>
          )}
        </div>
        <CourseSideBar
          course={course}
          show="block lg:hidden"
          currentLessonId={lesson.id}
        />
        <QuizCards lesson={lesson} />
      </div>
    </>
  );
};

export default CoursePage;
