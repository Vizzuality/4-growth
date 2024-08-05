import { FC, useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";

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

import { CLASS } from "../";

import { getAuthHeader } from "@/utils/auth-header";

const DeleteVisualizationButton: FC<{ id: string }> = ({ id }) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = useCallback(async () => {
    const response = await client.userCharts.deleteCustomChart.mutation({
      params: {
        id: id as string,
      },
      extraHeaders: {
        ...getAuthHeader(session?.accessToken as string),
      },
    });

    if (response.status === 200) {
      queryClient.invalidateQueries(
        queryKeys.users.userCharts(session?.user.id as string, {}).queryKey,
        {
          exact: false,
        },
      );

      toast({
        description: "Visualization removed successfully.",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Something went wrong deleting the visualization.",
      });
    }
  }, [id, queryClient, session?.accessToken, session?.user.id, toast]);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button type="button" className={cn(CLASS, "text-destructive")}>
          <Trash2Icon />
          <span>Delete</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Visualization deletion</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            visualization.
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
              onClick={handleDelete}
              className="bg-destructive text-foreground hover:bg-red-600 hover:text-white"
            >
              Delete visualization
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteVisualizationButton;
