import { getAuthSession } from "@/lib/auth";

import AddFriend from "@/components/client/AddFriend";

import LateralNav from "@/components/LateralNav";

import { redirect } from "next/navigation";

import prisma from "@/lib/db";
import FriendsSection from "@/components/client/FriendsSection";

const getFriends = async (session) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { friends: true },
    });
    return user.friends.map((friend) => {
      return { id: friend.id, name: friend.name, icon: friend.image };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getPendingRequests = async (session) => {
  try {
    const pendingRequests = await prisma.friendRequest.findMany({
      where: {
        receiverId: session.id,
        status: "PENDING",
      },
      include: {
        sender: true,
      },
    });
    return pendingRequests.map((request) => ({
      id: request.sender.id,
      name: request.sender.name,
      icon: request.sender.image,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default async function Friends() {
  const session = await getAuthSession();

  if (!session) {
    return redirect("/");
  }
  const pendingRequestsList = await getPendingRequests(session);
  const friendsList = await getFriends(session);

  return (
    <>
      <LateralNav />
      <main className="mx-auto mt-8 flex min-h-[calc(100vh_-_128px)] w-[95%] max-w-6xl flex-col items-center justify-start gap-20 sm:w-[90%] sm:gap-24">
        <h1 className="text-center text-4xl sm:text-6xl">Your social portal</h1>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <AddFriend session={session} />
        </div>
        <div className="mb-32 flex w-full flex-col items-center justify-center gap-3">
          <span className="text-center text-3xl">
            Manage{" "}
            <span className="font-handwrite text-4xl text-primary">
              friends
            </span>
          </span>
          <FriendsSection
            session={session}
            pendingRequestsList={pendingRequestsList}
            friendsList={friendsList}
          />
        </div>
      </main>
    </>
  );
}
