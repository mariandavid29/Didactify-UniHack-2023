import { getAuthSession } from "@/lib/auth";

import LateralNav from "@/components/LateralNav";

import prisma from "@/lib/db";

import { redirect } from "next/navigation";

const getBoard = async (session) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { friends: true },
    });

    const users = user.friends.map((friend) => {
      return {
        id: friend.id,
        name: friend.name,
        icon: friend.image,
        points: friend.points,
      };
    });

    users.push({
      id: user.id,
      name: user.name,
      icon: user.image,
      points: user.points,
    });

    users.sort((a, b) => b.points - a.points);
    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
};

async function Leaderboard() {
  const session = await getAuthSession();
  if (!session) {
    return redirect("/");
  }

  const leaderboardUsers = await getBoard(session);

  return (
    <>
      <LateralNav />
      <main className="mx-auto flex min-h-[calc(100vh_-_175px)] w-full max-w-7xl flex-col items-center justify-start gap-5">
        <h1 className="font-handwrite text-5xl font-semibold text-primary sm:text-6xl">
          LeaderBoard
        </h1>
        {leaderboardUsers.map((user, index) => {
          return (
            <div
              key={user.id}
              className={`flex w-full items-center justify-between rounded-lg bg-gray-800 px-4 py-2 ${
                index === 0 ? "border-4 border-yellow-400" : " "
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">{index + 1}</span>
                <img
                  className="h-10 w-10 rounded-full"
                  src={user.icon}
                  alt={user.name}
                />
                <span className="hidden text-xl  font-bold sm:inline">
                  {user.name}
                </span>
              </div>
              <span className="text-2xl font-bold">{user.points}</span>
            </div>
          );
        })}
      </main>
    </>
  );
}

export default Leaderboard;
