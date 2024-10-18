import { fileURLToPath } from "node:url";

import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

jiti("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    const warning = [
      ...(config.ignoreWarnings || []),
      { module: /typeorm/ },
      {
        module: /app-root-path/,
        message: /the request of a dependency is an expression/,
      },
    ];
    config.ignoreWarnings = warning;
    return config;
  },
};

export default nextConfig;
