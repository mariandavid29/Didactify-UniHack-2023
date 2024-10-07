// pagina pentru generare cursuri

import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

import LateralNav from "@/components/LateralNav";

import CreateForm from "@/components/client/CreateForm";
import CourseCreationContent from "@/components/client/CourseCreationContent";

export default async function CoursePage() {
  const session = await getAuthSession();
  if (!session) {
    return redirect("/");
  }
  return (
    <>
      <LateralNav />
      <main className="flex min-h-[calc(100vh_-_175px)] w-full flex-col items-center gap-14 pt-20 sm:justify-center sm:pt-0">
        <CourseCreationContent />
      </main>
    </>
  );
}
