"use client";

import { FC, useCallback } from "react";

import { Trash2Icon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { client } from "@/lib/queryClient";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { getAuthHeader } from "@/utils/auth-header";

const DeleteAccount: FC = () => {
  const { data: session } = useSession();
  const { toast } = useToast();

  const onDeleteAccount = useCallback(async () => {
    try {
      const { status, body } = await client.user.deleteMe.mutation({
        extraHeaders: {
          ...getAuthHeader(session?.accessToken),
        },
      });

      if (status === 200) {
        signOut({ callbackUrl: "/auth/signin" });
      }

      if (status === 400 || status === 401) {
        toast({
          variant: "destructive",
          description: body.errors?.[0].title,
        });
      }
    } catch (e) {
      toast({
        variant: "destructive",
        description: "Something went wrong deleting the account.",
      });
    }
  }, [session?.accessToken, toast]);

  return (
    <div className="px-8">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="destructive"
            className="group w-full space-x-2"
          >
            <span>Delete account</span>
            <Trash2Icon className="h-4 w-4 text-destructive group-hover:text-red-600" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Account deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline-alt">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                type="button"
                variant="destructive"
                onClick={onDeleteAccount}
                className="bg-destructive text-foreground hover:bg-red-600 hover:text-white"
              >
                Delete account
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteAccount;
