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

import { useAuthRedirect } from "@/hooks/use-auth-redirect";
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
import { getDynamicRouteHref } from "@/utils/route-config";

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
  const handleOnOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      setShowOverlay(isOpen);
    },
    [setOpen, setShowOverlay],
  );
  const invalidateQueries = useCallback(
    (widgetId: string) =>
      queryClient.invalidateQueries(
        queryKeys.users.userChart(widgetId).queryKey,
      ),
    [queryClient],
  );
  const { redirect } = useAuthRedirect();

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
        await invalidateQueries(widgetId);
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

        router.push(
          getDynamicRouteHref(
            "surveyAnalysis",
            "sandbox",
            String(body.data.id),
          ),
        );
      } else {
        redirect();
      }
    },
    [
      indicator,
      session?.user.id,
      session?.accessToken,
      visualization,
      filters,
      invalidateQueries,
      widgetId,
      handleOnOpenChange,
      toast,
      router,
      redirect,
    ],
  );

  const updateWidget = useCallback(async () => {
    const { status } = await client.users.updateCustomWidget.mutation({
      params: {
        id: Number(widgetId),
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
      await invalidateQueries(widgetId);
      handleOnOpenChange(false);
      toast({
        description: "Your chart has been successfully updated",
      });
    } else {
      redirect();
    }
  }, [
    widgetId,
    session?.user.id,
    session?.accessToken,
    visualization,
    indicator,
    filters,
    invalidateQueries,
    handleOnOpenChange,
    toast,
    redirect,
  ]);

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
