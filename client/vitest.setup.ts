import "@testing-library/jest-dom";
import { vi } from "vitest";
import path from "path"
import { loadEnvFile } from 'process'
loadEnvFile(path.resolve(__dirname, '.env.test'))


global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));