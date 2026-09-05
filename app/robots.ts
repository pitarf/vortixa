import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "https://vortixia.com.br";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register", "/recovery-password"],
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/api",
          "/api/*",
          "/admin",
          "/admin/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
