/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // S3
      {
        protocol: "https",
        hostname: "pp-web-strage.s3.ap-southeast-2.amazonaws.com",
      },
      // LINE
      {
        protocol: "https",
        hostname: "profile.line-scdn.net",
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
      // Stg
      {
        protocol: "https",
        hostname: "stg.torimede.com",
      },
      // Prod
      {
        protocol: "https",
        hostname: "www.torimede.com",
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
