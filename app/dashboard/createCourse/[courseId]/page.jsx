import ConfirmLessons from "@/components/client/ConfirmLessons";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export default async function CreateLessons({ params: { courseId } }) {
  const session = await getAuthSession();
  if (!session) {
    return redirect("/");
  }
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      units: {
        include: {
          lessons: true,
        },
      },
    },
  });

  if (!course) {
    return redirect("/dashboard/createCourse");
  }
  return (
    <div className="mx-auto my-16 flex max-w-xl flex-col items-start">
      <h5 className="text-seconday-foreground/60 text-sm uppercase">
        Course Name
      </h5>
      <h1 className="text-5xl font-bold">{course.name}</h1>

      <div className="mt-5 flex border-none bg-secondary p-4">
        <div>
          We generated lessons for each of your units. Look over them and then
          click the Button to confirm and continue.
        </div>
      </div>
      <ConfirmLessons course={course} />
    </div>
  );
}
