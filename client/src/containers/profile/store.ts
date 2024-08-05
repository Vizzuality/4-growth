import { atomWithReset } from "jotai/utils";

export const selectedRowAtom = atomWithReset<string | null>(null);
