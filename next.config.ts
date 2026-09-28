import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/r/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/studio/:path*", headers: [{key:"X-Robots-Tag",value:"noindex, nofollow"},{key:"Referrer-Policy",value:"no-referrer"},{key:"Cache-Control",value:"private, no-store"}] },
      { source: "/api/studio/:path*", headers: [{key:"Cache-Control",value:"private, no-store"},{key:"X-Content-Type-Options",value:"nosniff"}] },
    ];
  },
};

export default nextConfig;
