import { fileURLToPath } from "node:url";

import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

jiti("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/api/auth/:path*',
            destination: '/auth/:path*',
          },
        ]
      },
};

export default nextConfig;
