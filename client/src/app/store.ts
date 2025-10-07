"use client";

import { createStore } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const store = createStore();

export const analyticsConsentAtom = atomWithStorage<boolean | undefined>(
  "analytics-consent",
  undefined,
);
