// api route : /api/friend/acceptfriend

import { NextResponse } from "next/server";

import prisma from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

import * as z from "zod";

const formSchema = z.object({
  senderId: z
    .string()
    .min(2, {
      message: "Requester id must be at least 2 characters.",
    })
    .max(500, {
      message: "Requester id must be less than 500 characters.",
    }),
});

export async function POST(req) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { senderId } = await req.json();

    formSchema.parse({ senderId });

    const friendRequest = await prisma.friendRequest.findFirst({
      where: { senderId, receiverId: session.id },
    });

    if (!friendRequest) {
      return NextResponse.json(
        { message: "Friend request not found" },
        { status: 404 },
      );
    }

    await prisma.friendRequest.update({
      where: { id: friendRequest.id },
      data: { status: "ACCEPTED" },
    });

    // Establish the friendship by connecting the users
    await prisma.user.update({
      where: { id: friendRequest.senderId },
      data: {
        friends: {
          connect: { id: friendRequest.receiverId },
        },
      },
    });

    await prisma.user.update({
      where: { id: friendRequest.receiverId },
      data: {
        friends: {
          connect: { id: friendRequest.senderId },
        },
      },
    });

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "NOT OK" }, { status: 400 });
  }
}
