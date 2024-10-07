"use client";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

const LessonCard = React.forwardRef(
  ({ lesson, lessonIndex, setCompletedLessons, completedLessons }, ref) => {
    const [success, setSuccess] = React.useState(null);
    const { mutate: getLessonInfo, isLoading } = useMutation({
      mutationFn: async () => {
        const response = await axios.post("/api/course/generateCourse", {
          lessonId: lesson.id,
        });
        return response.data;
      },
    });

    const addLessonIdToSet = React.useCallback(() => {
      setCompletedLessons((prev) => {
        const newSet = new Set(prev);
        newSet.add(lesson.id);
        return newSet;
      });
    }, [lesson.id, setCompletedLessons]);

    React.useEffect(() => {
      if (lesson.youtubeVideoId) {
        setSuccess(true);
        addLessonIdToSet;
      }
    }, [lesson, addLessonIdToSet]);

    React.useImperativeHandle(ref, () => ({
      async triggerLoad() {
        if (lesson.youtubeVideoId) {
          addLessonIdToSet();
          return;
        }
        getLessonInfo(undefined, {
          onSuccess: () => {
            setSuccess(true);
            addLessonIdToSet();
          },
          onError: (error) => {
            console.error(error);
            setSuccess(false);
            addLessonIdToSet();
          },
        });
      },
    }));
    return (
      <div
        key={lesson.id}
        className={cn("mt-2 flex justify-between rounded px-4 py-2", {
          "bg-secondary": success === null,
          "bg-red-500": success === false,
          "bg-green-500": success === true,
        })}
      >
        <h5>{lesson.name}</h5>
      </div>
    );
  },
);

LessonCard.displayName = "LessonCard";

export default LessonCard;
