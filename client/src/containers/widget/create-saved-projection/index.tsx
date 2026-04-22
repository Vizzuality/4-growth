import { FC, useCallback, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  CustomProjectionSettingsType,
  OthersAggregationType,
} from "@shared/schemas/custom-projection-settings.schema";
import { useQueryClient } from "@tanstack/react-query";
import { SaveIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import { FilterQueryParam } from "@/hooks/use-filters";

import { useAuthRedirect } from "@/hooks/use-auth-redirect";

import { DEFAULT_TABLE_OPTIONS } from "@/containers/profile/saved-visualizations/table";
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

interface CreateSavedProjectionMenuProps {
  settings: CustomProjectionSettingsType | null;
  filters: FilterQueryParam[];
  othersAggregation: OthersAggregationType;
}

const CreateSavedProjectionMenu: FC<CreateSavedProjectionMenuProps> = ({
  settings,
  filters,
  othersAggregation,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const handleOnOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };
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
        queryClient.invalidateQueries(
          queryKeys.users.savedProjections(
            session?.user.id as string,
            DEFAULT_TABLE_OPTIONS,
          ).queryKey,
        );
        setOpen(false);
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
      toast,
      router,
      redirect,
      queryClient,
    ],
  );

  if (!session) {
    return (
      <Link
        href={`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`}
        className="flex h-8 w-8 items-center rounded-full bg-navy-700 p-2 transition-colors hover:bg-navy-800"
      >
        <SaveIcon />
      </Link>
    );
  }

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
      <PopoverContent align="end">
        <SaveWidgetForm onSubmit={createSavedProjection} />
      </PopoverContent>
    </Popover>
  );
};

export default CreateSavedProjectionMenu;
