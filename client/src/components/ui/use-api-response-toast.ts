import { JSONAPIErrorOptions } from "@shared/dto/errors/json-api.error";

import { useToast } from "@/components/ui/use-toast";

type ApiResponse<T = unknown> = {
  headers: Headers;
  status: number;
  body: { errors?: JSONAPIErrorOptions[] } | T;
};

export const useApiResponseToast = () => {
  const { toast } = useToast();

  const apiResponseToast = <T>(
    response: ApiResponse<T>,
    options: { successMessage: string; customErrorMessage?: string },
  ) => {
    if (response.status >= 200 && response.status < 300) {
      toast({ description: options.successMessage });
      return;
    }

    if (response.status >= 400 && response.status < 500) {
      if (options.customErrorMessage) {
        toast({
          variant: "destructive",
          description: options.customErrorMessage,
        });
      } else if (
        response.body &&
        typeof response.body === "object" &&
        "errors" in response.body
      ) {
        (response.body as { errors: JSONAPIErrorOptions[] }).errors?.forEach(
          (error) => {
            toast({ description: error.title });
          },
        );
      }
      return;
    }

    toast({
      variant: "destructive",
      description: "Something went wrong. Please try again.",
    });
  };

  return { apiResponseToast, toast };
};
