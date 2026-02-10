import { atom } from "jotai";

export const infoAtom = atom<{ title: string; description: string } | null>(
  null,
);
