"use client";

import { FC } from "react";

import Link from "next/link";

import { UserIcon, LogOutIcon } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { classes } from "../";

const Menu: FC = () => {
  const { data: session, status } = useSession();

  const initialEmailLetter = session?.user?.email
    .substring(0, 1)
    ?.toUpperCase();

  return (
    <ul className="overflow-hidden pt-2">
      {status === "authenticated" ? (
        <li className="border-t border-border">
          <Link
            href="/auth/signin"
            className={`${classes.link} flex items-center space-x-2`}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-magenta-500 text-foreground">
                {initialEmailLetter}
              </AvatarFallback>
            </Avatar>
            <span>Profile</span>
          </Link>
        </li>
      ) : (
        <li className="border-t border-border pt-2">
          <Link
            href="/auth/signin"
            className={`${classes.link} flex space-x-2`}
          >
            <UserIcon />
            <span>Log in</span>
          </Link>
        </li>
      )}
      {status === "authenticated" && (
        <li className={classes.link}>
          <button
            type="button"
            onClick={() => signOut()}
            className="flex items-center space-x-2"
          >
            <LogOutIcon />
            <span>Sign out</span>
          </button>
        </li>
      )}
    </ul>
  );
};

export default Menu;
