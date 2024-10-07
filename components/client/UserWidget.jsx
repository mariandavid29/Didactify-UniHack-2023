"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

import { signOut } from "next-auth/react";

function UserWidget({ session }) {
  const userName = session.user.name;
  const imgUrl = session.user.image;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative flex cursor-pointer items-center justify-center gap-2  pl-4 text-lg font-semibold transition-all duration-500">
          <span className="hidden md:block">{userName}</span>
          <Avatar className="h-10 w-10">
            <AvatarImage src={imgUrl} />
            <AvatarFallback>PFP</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href="/dashboard/friends">Friends</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button
            type="button"
            onClick={() => {
              signOut();
            }}
            className="flex items-center justify-center gap-1 text-red-600 hover:underline"
          >
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
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            Log Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserWidget;
