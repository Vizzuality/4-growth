export interface JSONAPIError {
  errors: JSONAPIErrorOptions[];
}

export interface JSONAPIErrorOptions {
  id?: string | undefined;
  status?: string | undefined;
  code?: string | undefined;
  title: string;
  detail?: string | undefined;
  source?:
    | {
        pointer?: string | undefined;
        parameter?: string | undefined;
      }
    | undefined;
  links?:
    | {
        about?: string | undefined;
      }
    | undefined;
  meta?: any;
}
