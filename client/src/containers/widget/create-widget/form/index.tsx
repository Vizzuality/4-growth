import { FC } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Title from "@/components/ui/title";

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
    <div className="w-[366px] space-y-6 pt-6">
      <Title as="h2" className="px-8 text-base">
        Save chart
      </Title>
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
          <div className="px-0.5 pb-0.5">
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
