import { FC } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SaveWidgetFormProps {
  onSubmit: (name: string) => void;
}

const saveWidgetFormSchema = z.object({
  name: z.string().min(1, "Chart name is required"),
});

const SaveWidgetForm: FC<SaveWidgetFormProps> = ({ onSubmit }) => {
  const form = useForm<z.infer<typeof saveWidgetFormSchema>>({
    resolver: zodResolver(saveWidgetFormSchema),
    defaultValues: { name: "" },
  });

  return (
    <div className="space-y-6">
      <DialogTitle className="px-8 pt-6 text-base">Save chart</DialogTitle>
      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit((v) => onSubmit(v.name))}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chart name</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    autoComplete="off"
                    placeholder="Create chart name"
                    variant="secondary"
                    className="py-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button type="submit" className="w-full">
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SaveWidgetForm;
