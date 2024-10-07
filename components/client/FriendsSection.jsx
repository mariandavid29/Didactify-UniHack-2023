"use client";

import FriendRequest from "./FriendRequest";
import FriendCard from "./FriendCard";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useState } from "react";

import axios from "axios";

function FriendsSection({ session, pendingRequestsList, friendsList }) {
  const imgUrl = session.user.image;
  const [pendingRequests, setPendingRequests] = useState(pendingRequestsList);
  const [friends, setFriends] = useState(friendsList);

  async function acceptFriendRequest(id) {
    try {
      axios.post("/api/friend/acceptfriend", {
        senderId: id,
      });
      setPendingRequests(
        pendingRequests.filter((request) => request.id !== id),
      );
      setFriends([
        ...friends,
        pendingRequests.find((request) => request.id === id),
      ]);
    } catch (error) {
      console.error(error);
    }
  }

  async function declineFriendRequest(id) {
    try {
      axios.post("/api/friend/declinefriend", {
        senderId: id,
      });
      setPendingRequests(
        pendingRequests.filter((request) => request.id !== id),
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteFriend(id) {
    try {
      axios.post("/api/friend/deletefriend", {
        friendId: id,
      });
      setFriends(friends.filter((friend) => friend.id !== id));
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Tabs
      defaultValue="friends"
      className="mx-auto flex w-full flex-col items-center gap-5"
    >
      <TabsList className="grid w-full max-w-xl grid-cols-2 sm:h-14 sm:px-4">
        <TabsTrigger className="sm:text-xl" value="friends">
          Friends
        </TabsTrigger>
        <TabsTrigger className="sm:text-xl" value="requests">
          Requests
        </TabsTrigger>
      </TabsList>
      <TabsContent className="w-full max-w-2xl" value="requests">
        <div className="flex w-full flex-col items-center justify-center gap-6 rounded-xl bg-zinc-800 p-3 sm:p-5">
          {pendingRequests.length > 0 ? (
            <ul className="max-h-[300px] w-[95%] overflow-y-auto md:w-[90%]">
              {pendingRequests.map((sender) => (
                <FriendRequest
                  imgUrl={sender.icon}
                  key={sender.name}
                  id={sender.id}
                  acceptFriendRequest={acceptFriendRequest}
                  declineFriendRequest={declineFriendRequest}
                >
                  {sender.name}
                </FriendRequest>
              ))}
            </ul>
          ) : (
            <span>No requests!</span>
          )}
        </div>
      </TabsContent>
      <TabsContent className="w-full max-w-2xl" value="friends">
        <div className="flex w-full flex-col items-center justify-center gap-6 rounded-xl bg-zinc-800 p-3 sm:p-5">
          {friends.length > 0 ? (
            <ul className="max-h-[300px] w-full overflow-y-auto">
              {friends.map((friend) => (
                <FriendCard
                  imgUrl={friend.icon}
                  id={friend.id}
                  declineFriendRequest={deleteFriend}
                  key={friend.name}
                >
                  {friend.name}
                </FriendCard>
              ))}
            </ul>
          ) : (
            <span>No friends!</span>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default FriendsSection;
