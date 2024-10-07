import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Separator } from "@/components/ui/separator";

const CourseSideBar = async ({ course, currentLessonId, show }) => {
  return (
    <div className={`rounded-xl bg-secondary p-6 ${show}`}>
      <h1 className="text-4xl font-bold capitalize">{course.name}</h1>
      {course.units.map((unit, unitIndex) => {
        return (
          <div key={unit.id} className="mt-4">
            <h2 className="text-sm uppercase text-secondary-foreground/60">
              Unit {unitIndex + 1}
            </h2>
            <h2 className="text-2xl font-bold">{unit.name}</h2>
            {unit.lessons.map((lesson, lessonIndex) => {
              return (
                <div key={lesson.id}>
                  <Link
                    href={`/dashboard/course/${course.id}/${unitIndex}/${lessonIndex}`}
                    className={cn("text-secondary-foreground/60", {
                      "font-bold text-primary": lesson.id === currentLessonId,
                    })}
                  >
                    {lesson.name}
                  </Link>
                </div>
              );
            })}
            <Separator className="mt-2 bg-gray-500 text-gray-500" />
          </div>
        );
      })}
    </div>
  );
};

export default CourseSideBar;
