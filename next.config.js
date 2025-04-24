/** @type {import('next').NextConfig} */

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
  // Append the default value with md extensions
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx", "html"],
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    domains: ["media2.dev.to", "dev-to-uploads.s3.amazonaws.com"],
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
