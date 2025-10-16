import {
  ComponentProps,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useQueryClient } from "@tanstack/react-query";
import { CellContext } from "@tanstack/react-table";
import { useAtom } from "jotai/react";
import { useResetAtom } from "jotai/utils";
import { useSession } from "next-auth/react";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";

import { selectedRowAtom } from "@/containers/profile/store";

import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { getAuthHeader } from "@/utils/auth-header";

import { ColumnsTable } from "../";

const CellName: FC<CellContext<ColumnsTable, unknown>> = ({
  getValue,
  row,
}) => {
  const [selectedRow] = useAtom(selectedRowAtom);
  const resetSelectedRow = useResetAtom(selectedRowAtom);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: session } = useSession();
  const ref = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEnterKey = useCallback(
    async (
      evt: Parameters<
        NonNullable<ComponentProps<typeof Input>["onKeyDown"]>
      >[0],
    ) => {
      if (evt.code === "Enter" && isEditing) {
        const response = await client.users.updateCustomWidget.mutation({
          params: {
            userId: session?.user.id as string,
            id: Number(row.original.id),
          },
          body: {
            name: evt.currentTarget.value,
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
            description: "Visualization updated successfully.",
          });
        } else {
          toast({
            variant: "destructive",
            description: "Something went wrong updating the visualization.",
          });
        }

        resetSelectedRow();
      }

      if (evt.code === "Escape" && isEditing) {
        resetSelectedRow();
      }
    },
    [
      isEditing,
      queryClient,
      row.original.id,
      session?.accessToken,
      session?.user.id,
      toast,
      resetSelectedRow,
    ],
  );

  useEffect(() => {
    if (selectedRow === String(row.original.id)) {
      setIsEditing(true);
      ref.current?.focus();
    }
  }, [selectedRow, row.original.id]);

  return (
    <Input
      ref={ref}
      type="text"
      readOnly={!isEditing}
      defaultValue={getValue() as string}
      onKeyDown={handleEnterKey}
      className={cn({
        "border-l-0 bg-transparent pl-0 focus-within:bg-transparent hover:bg-transparent":
          true,
        "cursor-pointer": !isEditing,
      })}
    />
  );
};

export default CellName;
