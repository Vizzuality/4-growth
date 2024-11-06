import { FC, useCallback, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { SaveIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import { client } from "@/lib/queryClient";

import useFilters, { FilterQueryParam } from "@/hooks/use-filters";
import useSandboxWidget from "@/hooks/use-sandbox-widget";

import SaveWidgetForm from "@/containers/widget/create-widget/form";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { getAuthHeader } from "@/utils/auth-header";

interface SaveWidgetMenuProps {
  mode: "create" | "update";
}
const UpdateWidgetMenu: FC<SaveWidgetMenuProps> = ({ mode }) => {
  const { indicator, visualization } = useSandboxWidget();
  const { filters } = useFilters();
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const handleOnOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (!isOpen && showForm) {
      // Timeout is added because popup is still visible while closing
      setTimeout(() => setShowForm(false), 200);
    }
  };

  const createWidget = useCallback(
    async (name: string) => {
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

        router.push(`/sandbox/${body.data.id}`);
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong saving the widget.",
        });
      }
    },
    [session?.accessToken, session?.user.id, toast],
  );

  const updateWidget = useCallback(
    async (
      id: string,
      values: {
        name?: string;
        defaultVisualization?: string;
        filters: FilterQueryParam[];
        widgetIndicator?: string;
      },
    ) => {
      const { status, body } = await client.users.updateCustomWidget.mutation({
        params: {
          id,
          userId: session?.user.id as string,
        },
        body: values,
        extraHeaders: {
          ...getAuthHeader(session?.accessToken as string),
        },
      });

      if (status === 200) {
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

        router.push(`/sandbox/${body.data.id}`);
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong saving the widget.",
        });
      }
    },
    [session?.accessToken, session?.user.id, toast],
  );

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
        {showForm ? (
          <SaveWidgetForm onSubmit={createWidget} />
        ) : (
          <div className="flex flex-col">
            <Button
              variant="clean"
              onClick={() => {
                if (session) {
                  setShowForm(true);
                } else {
                  router.push(
                    `/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`,
                  );
                }
              }}
            >
              Save chart
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default UpdateWidgetMenu;
