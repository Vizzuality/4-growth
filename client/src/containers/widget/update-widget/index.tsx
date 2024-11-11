import { FC, useCallback, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { WidgetVisualizationsType } from "@shared/dto/widgets/widget-visualizations.constants";
import { useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { SaveIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import { FilterQueryParam } from "@/hooks/use-filters";

import { showOverlayAtom } from "@/containers/overlay/store";
import SaveWidgetForm from "@/containers/widget/create-widget/form";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { getAuthHeader } from "@/utils/auth-header";

interface UpdateWidgetMenuProps {
  widgetId: string;
  indicator: string | null;
  visualization: WidgetVisualizationsType | null;
  filters: FilterQueryParam[];
}
const UpdateWidgetMenu: FC<UpdateWidgetMenuProps> = ({
  widgetId,
  indicator,
  visualization,
  filters,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const setShowOverlay = useSetAtom(showOverlayAtom);
  const handleOnOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    setShowOverlay(isOpen);
  };

  const createWidget = useCallback(
    async (name: string) => {
      if (!indicator) return;

      const { status, body } = await client.users.createCustomWidget.mutation({
        params: {
          userId: session?.user.id as string,
        },
        body: {
          name,
          defaultVisualization: visualization as string,
          widgetIndicator: indicator,
          filters,
        },
        extraHeaders: {
          ...getAuthHeader(session?.accessToken as string),
        },
      });

      if (status === 201) {
        handleOnOpenChange(false);
        toast({
          description: (
            <>
              <p>Your chart has been successfully saved in </p>
              <Link href="/profile" className="font-bold underline">
                your profile.
              </Link>
            </>
          ),
        });

        router.push(`/sandbox/${body.data.id}`);
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong saving the widget.",
        });
      }
    },
    [visualization, indicator, session?.accessToken, session?.user.id, toast],
  );

  const updateWidget = useCallback(async () => {
    const { status } = await client.users.updateCustomWidget.mutation({
      params: {
        id: widgetId,
        userId: session?.user.id as string,
      },
      body: {
        defaultVisualization: visualization || undefined,
        widgetIndicator: indicator || undefined,
        filters,
      },
      extraHeaders: {
        ...getAuthHeader(session?.accessToken as string),
      },
    });

    if (status === 200) {
      queryClient.invalidateQueries(
        queryKeys.users.userChart(widgetId).queryKey,
      );
      handleOnOpenChange(false);
      toast({
        description: "Your chart has been successfully updated",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Something went wrong updating the widget.",
      });
    }
  }, [session?.accessToken, session?.user.id, toast]);

  return (
    <Popover onOpenChange={handleOnOpenChange} open={open}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          className="flex h-8 w-8 items-center rounded-full bg-navy-700 p-2 transition-colors hover:bg-navy-800"
        >
          <SaveIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        onCloseAutoFocus={() => {
          if (showForm) {
            setShowForm(false);
          }
        }}
      >
        {showForm ? (
          <SaveWidgetForm onSubmit={createWidget} />
        ) : (
          <div className="flex flex-col">
            <Button
              variant="clean"
              className="justify-start rounded-none text-xs font-medium transition-colors hover:bg-slate-200"
              onClick={updateWidget}
            >
              Save
            </Button>
            <Button
              variant="clean"
              className="justify-start rounded-none text-xs font-medium transition-colors hover:bg-slate-200"
              onClick={() => {
                setShowForm(true);
              }}
            >
              Save as a copy
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default UpdateWidgetMenu;
