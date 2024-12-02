import { FC, useCallback, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { WidgetVisualizationsType } from "@shared/dto/widgets/widget-visualizations.constants";
import { SaveIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import { client } from "@/lib/queryClient";

import { FilterQueryParam } from "@/hooks/use-filters";

import SaveWidgetForm from "@/containers/widget/create-widget/form";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { getAuthHeader } from "@/utils/auth-header";

interface CreateWidgetMenuProps {
  indicator: string | null;
  visualization: WidgetVisualizationsType | null;
  filters: FilterQueryParam[];
}
const CreateWidgetMenu: FC<CreateWidgetMenuProps> = ({
  indicator,
  visualization,
  filters,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const handleOnOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
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
    [
      session?.accessToken,
      session?.user.id,
      visualization,
      indicator,
      filters,
      toast,
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
        <SaveWidgetForm onSubmit={createWidget} />
      </PopoverContent>
    </Popover>
  );
};

export default CreateWidgetMenu;
