import { FC, useCallback, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  CustomProjectionSettingsType,
  OthersAggregationType,
} from "@shared/schemas/custom-projection-settings.schema";
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

import { DEFAULT_TABLE_OPTIONS } from "@/containers/profile/saved-visualizations/table";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { getAuthHeader } from "@/utils/auth-header";
import { getDynamicRouteHref } from "@/utils/route-config";

interface UpdateSavedProjectionMenuProps {
  savedProjectionId: string;
  settings: CustomProjectionSettingsType | null;
  filters: FilterQueryParam[];
  othersAggregation: OthersAggregationType;
}

const UpdateSavedProjectionMenu: FC<UpdateSavedProjectionMenuProps> = ({
  savedProjectionId,
  settings,
  filters,
  othersAggregation,
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
    (id: string) =>
      queryClient.invalidateQueries(
        queryKeys.users.savedProjection(id).queryKey,
      ),
    [queryClient],
  );
  const { redirect } = useAuthRedirect();

  const createSavedProjection = useCallback(
    async (name: string) => {
      if (!settings) return;

      const { status, body } =
        await client.savedProjections.createSavedProjection.mutation({
          params: {
            userId: session?.user.id as string,
          },
          body: {
            name,
            settings: { settings, othersAggregation },
            dataFilters: filters,
          },
          extraHeaders: {
            ...getAuthHeader(session?.accessToken as string),
          },
        });

      if (status === 201) {
        await invalidateQueries(savedProjectionId);
        queryClient.invalidateQueries(
          queryKeys.users.savedProjections(
            session?.user.id as string,
            DEFAULT_TABLE_OPTIONS,
          ).queryKey,
        );
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
            "projections",
            "sandbox",
            String(body.data.id),
          ),
        );
      } else {
        redirect();
      }
    },
    [
      settings,
      othersAggregation,
      session?.user.id,
      session?.accessToken,
      filters,
      invalidateQueries,
      savedProjectionId,
      queryClient,
      handleOnOpenChange,
      toast,
      router,
      redirect,
    ],
  );

  const updateSavedProjection = useCallback(async () => {
    if (!settings) return;

    const { status } =
      await client.savedProjections.updateSavedProjection.mutation({
        params: {
          id: Number(savedProjectionId),
          userId: session?.user.id as string,
        },
        body: {
          settings: { settings, othersAggregation },
          dataFilters: filters,
        },
        extraHeaders: {
          ...getAuthHeader(session?.accessToken as string),
        },
      });

    if (status === 200) {
      await invalidateQueries(savedProjectionId);
      handleOnOpenChange(false);
      toast({
        description: "Your chart has been successfully updated",
      });
    } else {
      redirect();
    }
  }, [
    settings,
    othersAggregation,
    savedProjectionId,
    session?.user.id,
    session?.accessToken,
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
          <SaveWidgetForm onSubmit={createSavedProjection} />
        ) : (
          <div className="flex flex-col">
            <Button
              variant="clean"
              className="justify-start rounded-none text-xs font-medium transition-colors hover:bg-slate-200"
              onClick={updateSavedProjection}
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

export default UpdateSavedProjectionMenu;
