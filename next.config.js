/** @type {import('next').NextConfig} */

const nextConfig = {
  // typescript: {
  //   ignoreBuildErrors: true,
  // },

  images: {
    qualities: [75, 100],
  },
  // transpilePackages: ["import-in-the-middle"],
  // experimental: {
  //   serverActions: {
  //     bodySizeLimit: "10mb",
  //   },
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kylahucyscyiwmgoccux.supabase.co",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;

