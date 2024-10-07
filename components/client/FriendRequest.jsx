"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";

function FriendRequest({
  children,
  imgUrl,
  acceptFriendRequest,
  id,
  declineFriendRequest,
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl bg-zinc-700 px-4 py-2">
      <div class="flex items-center justify-center gap-4">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
          <AvatarImage src={imgUrl} />
          <AvatarFallback>PFP</AvatarFallback>
        </Avatar>
        <span className="text-xl font-medium">{children}</span>
      </div>
      <div className="flex items-center justify-center gap-3">
        <Button
          type="button"
          className="bg-green-600 duration-300 hover:bg-green-700"
          onClick={() => acceptFriendRequest(id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#fff"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </Button>
        <Button
          type="button"
          className="bg-red-700 duration-300 hover:bg-red-800"
          onClick={() => declineFriendRequest(id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#fff"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </Button>
      </div>
    </li>
  );
}

export default FriendRequest;
