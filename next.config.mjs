/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@refinedev/antd"],
  output: "standalone",
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "https://localhost:443/api/:path*", // Proxy to Backend
            },
        ];
    }
};

export default nextConfig;
