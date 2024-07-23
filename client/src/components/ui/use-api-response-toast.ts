import { JSONAPIErrorOptions } from "@shared/dto/errors/json-api.error";

import { useToast } from "@/components/ui/use-toast";

export const useApiResponseToast = () => {
  const { toast } = useToast();
  const apiResponseToast = (
    response: Record<string, any>,
    options: { successMessage: string; customErrorMessage?: string },
  ) => {
    if (response.status >= 200 && response.status < 300) {
      toast({ description: options.successMessage });
      return;
    }
    if (response.status >= 400 && response.status < 500) {
      options.customErrorMessage
        ? toast({
            variant: "destructive",
            description: options.customErrorMessage,
          })
        : response.body.errors.forEach((error: JSONAPIErrorOptions) => {
            toast({ description: error.title });
          });
      return;
    }
    toast({
      variant: "destructive",
      description: "Something went wrong. Please try again.",
    });
  };
  return { apiResponseToast, toast };
};
