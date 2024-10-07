// api/friend/deletefriend

import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";

import * as z from "zod";

const formSchema = z.object({
  friendId: z
    .string()
    .min(2, {
      message: "Friend id must be at least 2 characters.",
    })
    .max(500, {
      message: "Friend id must be less than 500 characters.",
    }),
});

export async function POST(req) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { friendId } = await req.json();

    formSchema.parse({ friendId });

    // Delete the friendship by disconnecting the users
    await prisma.user.update({
      where: { id: session.id },
      data: {
        friends: {
          disconnect: { id: friendId },
        },
      },
    });

    await prisma.user.update({
      where: { id: friendId },
      data: {
        friends: {
          disconnect: { id: session.id },
        },
      },
    });

    // Delete the accepted friend request
    await prisma.friendRequest.deleteMany({
      where: {
        AND: [
          {
            OR: [
              {
                senderId: session.id,
                receiverId: friendId,
              },
              {
                senderId: friendId,
                receiverId: session.id,
              },
            ],
          },
          {
            status: "ACCEPTED",
          },
        ],
      },
    });
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "NOT OK" }, { status: 400 });
  }
}
