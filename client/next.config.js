import { fileURLToPath } from "node:url";

import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

jiti("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    const warning = [
      ...(config.ignoreWarnings || []),
      {
        module: /typeorm/,
        message: /the request of a dependency is an expression/,
      },
      {
        module: /typeorm/,
        message: /Can't resolve 'react-native-sqlite-storage'/,
      },
      {
        module: /typeorm/,
        message: /Can't resolve '@sap\/hana-client\/extension\/Stream'/,
      },
      {
        module: /typeorm/,
        message: /Can't resolve 'mysql'/,
      },
      {
        module: /app-root-path/,
        message: /the request of a dependency is an expression/,
      },
    ];
    config.ignoreWarnings = warning;
    return config;
  },
  async redirects() {
    // Temporary redirect to explore page
    return [
      {
        source: '/',
        destination: '/explore',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
