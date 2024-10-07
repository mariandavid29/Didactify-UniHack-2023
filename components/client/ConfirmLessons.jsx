"use client";
import React from "react";
import LessonCard, { LessonCardHandler } from "./LessonCard";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function ConfirmLessons({ course }) {
  const [loading, setLoading] = React.useState(false);
  const lessonRefs = {};
  course.units.forEach((unit) => {
    unit.lessons.forEach((lesson) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      lessonRefs[lesson.id] = React.useRef(null);
    });
  });
  const [completedLessons, setCompletedLessons] = React.useState(new Set());
  const totalLessonsCount = React.useMemo(() => {
    return course.units.reduce((acc, unit) => {
      return acc + unit.lessons.length;
    }, 0);
  }, [course.units]);
  console.log(totalLessonsCount, completedLessons.size);
  return (
    <div className="mt-4 w-full">
      {course.units.map((unit, unitIndex) => {
        return (
          <div key={unit.id} className="mt-5">
            <h2 className="text-sm uppercase text-secondary-foreground/60">
              Unit {unitIndex + 1}
            </h2>
            <h3 className="text-2xl font-bold">{unit.name}</h3>
            <div className="mt-3">
              {unit.lessons.map((lesson, lessonIndex) => {
                return (
                  <LessonCard
                    completedLessons={completedLessons}
                    setCompletedLessons={setCompletedLessons}
                    ref={lessonRefs[lesson.id]}
                    key={lesson.id}
                    lesson={lesson}
                    lessonIndex={lessonIndex}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="mt-4 flex items-center justify-center">
        <div className="mx-4 flex items-center gap-3">
          <Link href="/dashboard/createCourse" className="">
            Back
          </Link>
          {totalLessonsCount === completedLessons.size ? (
            <Link
              className={buttonVariants({ variant: "default" })}
              href={`/dashboard/course/${course.id}/0/0`}
            >
              Save & Continue
            </Link>
          ) : (
            <Button
              type="button"
              className="ml-4 font-semibold"
              disabled={loading}
              onClick={() => {
                setLoading(true);
                Object.values(lessonRefs).forEach((ref) => {
                  ref.current?.triggerLoad();
                });
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <span>Generate</span>
                {loading && (
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
        </div>
      </div>
    </div>
  );
}
