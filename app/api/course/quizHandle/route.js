import { getAuthSession } from "@/lib/auth";

import prisma from "@/lib/db";

export async function POST(req) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("Suntem in endpoint");

    const { punctaj, lessonId } = await req.json();

    const user = await prisma.user.update({
      where: {
        id: session.id,
      },
      data: {
        points: {
          increment: punctaj,
        },
      },
    });

    const lesson = await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        quizDone: true,
      },
    });

    return NextResponse.json({ message: "SUPEEER" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "NOT OK" }, { status: 400 });
  }
}
