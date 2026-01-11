import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
  //  experimental: {
  //   serverComponentsExternalPackages: ['@prisma/client', '@prisma/adapter-neon'],
  // },
  // webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     config.externals.push({
  //       '@prisma/client': '@prisma/client',
  //       '@prisma/adapter-neon': '@prisma/adapter-neon',
  //     });
  //   }
  //   return config;
  // },
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
