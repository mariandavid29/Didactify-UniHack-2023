import Link from "next/link";

export default function CourseCard({ course, index }) {
  const transformedString =
    course.name.charAt(0).toUpperCase() + course.name.slice(1);
  return (
    <Link
      href={`/dashboard/course/${course.id}/0/0`}
      className={`flex w-full max-w-lg flex-col gap-6 rounded-xl bg-zinc-800 p-5 duration-200 hover:outline hover:outline-primary focus:outline-primary ${
        index % 2 === 0
          ? "min-[900px]:justify-self-end"
          : "min-[900px]:justify-self-start"
      }`}
    >
      <div className="flex w-full flex-col items-start justify-center gap-3">
        <div>
          <h2 className="text-2xl min-[900px]:text-3xl">{transformedString}</h2>
          <p className="text-sm font-light min-[900px]:text-base">
            {course.units.length} CHAPTERS
          </p>
        </div>

        <div className="flex w-full flex-col items-center justify-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <div className="flex w-full items-center justify-start gap-2">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
            <span className="tracking-wide">Not completed</span>
          </div>
          <span
            className="flex w-full items-center justify-start gap-1 font-medium  text-primary sm:justify-end"
            href="/"
          >
            Jump back in
            <CardSVG />
          </span>
        </div>
      </div>
    </Link>
  );
}

function CardSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
      />
    </svg>
  );
}
