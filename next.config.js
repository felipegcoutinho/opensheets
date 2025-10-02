/** @type {import('next').NextConfig} */

const nextConfig = {
  // typescript: {
  //   ignoreBuildErrors: true,
  // },

  images: {
    qualities: [75, 100],
  },

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
