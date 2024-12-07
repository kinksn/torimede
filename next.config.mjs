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
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
