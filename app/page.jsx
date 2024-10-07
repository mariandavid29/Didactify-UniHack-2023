// images
import Image from "next/image";
import heroImg from "./assets/landingHeroImage.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import LogInButtonTrimitator from "@/components/client/LogInButtonTrimitator";

export default async function Home() {
  const session = await getAuthSession();
  return (
    <main className="relative mx-auto flex min-h-[calc(100vh_-_128px)] w-[95%] max-w-6xl flex-col items-center justify-center gap-16 sm:w-[90%] lg:mt-[-5vh] lg:flex-row lg:justify-between lg:gap-4">
      <div className="space-y-4 self-start lg:grow lg:basis-0 lg:self-auto">
        <div className="space-y-4">
          <h1 className="text-3xl font-light lg:text-4xl">
            Learning made <br className="min-[375px]:hidden" />{" "}
            <span className="whitespace-nowrap font-semibold">by people</span>,{" "}
            <br />
            enhanced <br className="min-[375px]:hidden" />
            <span className="whitespace-nowrap font-semibold">by AI</span>
          </h1>
          <p className="hidden max-w-md text-lg min-[375px]:block">
            Learn from the{" "}
            <span className="font-handwrite text-2xl text-primary">best</span>,
            and let the AI do the{" "}
            <span className="font-handwrite text-2xl text-primary">rest</span>.
            Get a personalized learning experience, tailored to your needs, in
            just{" "}
            <span className="font-handwrite text-2xl text-primary">
              a few clicks
            </span>
            .
          </p>
        </div>
        <div>
          {!session ? (
            <LogInButtonTrimitator />
          ) : (
            <Link
              className={buttonVariants({ variant: "default" })}
              href="/dashboard/gallery"
            >
              {" "}
              Dashboard{" "}
            </Link>
          )}
        </div>
      </div>
      <div className="flex w-screen items-center justify-center overflow-x-hidden lg:w-full lg:grow lg:basis-0 lg:justify-end">
        <Image
          src={heroImg}
          className="flex w-[400px] max-w-none items-center justify-center opacity-40 sm:w-full sm:max-w-lg lg:w-full lg:max-w-[550px]"
          alt="Landing Image"
          priority
        ></Image>
      </div>
    </main>
  );
}
