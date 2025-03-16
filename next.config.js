const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      // NextJS <Image> component needs to whitelist domains for src={}
      "lh3.googleusercontent.com",
      "pbs.twimg.com",
      "images.unsplash.com",
      "logos-world.net",
      "cdn2.suno.ai",
      "cdn1.suno.ai",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.suno.ai", // 允许所有子域名
        port: "",
        pathname: "/**", // 允许所有路径
      },
    ],
  },
};
