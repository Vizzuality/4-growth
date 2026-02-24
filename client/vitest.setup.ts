import "@testing-library/jest-dom";
import { vi } from "vitest";
import * as path from "path";
import { loadEnvFile } from "process";
loadEnvFile(path.resolve(__dirname, ".env.test"));

// Make sure global is defined for JSdom
if (globalThis.window) {
  globalThis.global = globalThis;
}

window.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
