/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // S3
      {
        protocol: "https",
        hostname: "pp-web-strage.s3.ap-southeast-2.amazonaws.com",
      },
      // X
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      // Google
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // prod
      {
        protocol: "https",
        hostname: "torimede.vercel.app",
      },
    ],
  },
};

export default nextConfig;
