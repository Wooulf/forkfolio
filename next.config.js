/** @type {import('next').NextConfig} */
const path = require("path");

module.exports = {
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "https://app.forestry.io/login",
        permanent: true,
        basePath: false,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, ".");
    return config;
  },
  // Append the default value with md extensions
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx", "html"],
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media2.dev.to',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dev-to-uploads.s3.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  compiler: {
    removeConsole: true,
  },
  output: 'standalone',
};

// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig
