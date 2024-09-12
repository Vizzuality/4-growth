import { ApiPaginationResponse } from "@shared/dto/global/api-response.dto";
import { Section } from "@shared/dto/sections/section.entity";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseSearchSectionsQuery(resp: {
  status: 200;
  body: ApiPaginationResponse<Section>;
  headers: Headers;
}) {
  return resp.body.data.map((s) => ({
    ...s,
    id: s.name!.toLowerCase().replace(/\s+/g, "-"),
  }));
}
