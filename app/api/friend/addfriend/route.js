// api route : /api/friend/addfriend

import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";

import * as z from "zod";

const formSchema = z.object({
  friendEmail: z
    .string()
    .min(2, {
      message: "Friend email must be at least 2 characters.",
    })
    .max(100, {
      message: "Friend email must be less than 100 characters.",
    })
    .email({
      message: "Please enter a valid friend email.",
    }),
});

export async function POST(req) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { friendEmail } = await req.json();

    formSchema.parse({ friendEmail });

    const futureFriend = await prisma.User.findUnique({
      where: {
        email: friendEmail,
      },
    });

    if (!futureFriend) {
      return NextResponse.json(
        { message: "Friend not found" },
        { status: 404 },
      );
    }

    // Check if friend request already exists
    const existingFriendRequest = await prisma.friendRequest.findFirst({
      where: {
        AND: [
          {
            OR: [
              {
                senderId: session.id,
                receiverId: futureFriend.id,
              },
              {
                senderId: futureFriend.id,
                receiverId: session.id,
              },
            ],
          },
          {
            status: "PENDING",
          },
        ],
      },
    });

    if (existingFriendRequest) {
      return NextResponse.json(
        { message: "Friend request already exists" },
        { status: 400 },
      );
    }

    // Check if they are already friends
    const existingFriendship = await prisma.friendRequest.findFirst({
      where: {
        AND: [
          {
            OR: [
              {
                senderId: session.id,
                receiverId: futureFriend.id,
              },
              {
                senderId: futureFriend.id,
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

    if (existingFriendship) {
      return NextResponse.json(
        { message: "You are already friends" },
        { status: 400 },
      );
    }

    // Create a new friend request
    const newFriendRequest = await prisma.friendRequest.create({
      data: {
        status: "PENDING",
        sender: {
          connect: { id: session.id },
        },
        receiver: {
          connect: { id: futureFriend.id },
        },
      },
    });

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "NOT OK" }, { status: 400 });
  }
}
