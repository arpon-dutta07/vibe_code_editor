"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LogOut, User } from "lucide-react";
import LogoutButton from "./logout-button";
import { useCurrentUser } from "../hooks/use-current-user";
import Link from "next/link";

const UserButton = () => {

  const user = useCurrentUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className={cn("relative rounded-full")}>
          <Avatar>
            <AvatarImage src={user?.image!} alt={user?.name!} />
            <AvatarFallback className="bg-red-500">
              <User className="text-white" />
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

    <DropdownMenuContent className="mr-4 w-52 bg-zinc-950 text-white border-zinc-800 backdrop-blur-2xl">
      <DropdownMenuItem className="text-zinc-400 focus:bg-zinc-900 focus:text-white">
        <span className="truncate">
          {user?.email}
        </span>
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-zinc-800" />
      <DropdownMenuItem asChild className="focus:bg-zinc-900 focus:text-rose-400 text-zinc-200 cursor-pointer">
        <Link href={user?.id ? `/users/${user.id}` : "/users"} className="flex items-center w-full">
          <User className="h-4 w-4 mr-2" />
          My Profile
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-zinc-800" />
      <LogoutButton>
        <DropdownMenuItem className="text-zinc-200 focus:bg-zinc-900 focus:text-rose-500 cursor-pointer">
          <LogOut className="h-4 w-4 mr-2"/>
          LogOut
        </DropdownMenuItem>
      </LogoutButton>
    </DropdownMenuContent>

    </DropdownMenu>
  );
};

export default UserButton;
