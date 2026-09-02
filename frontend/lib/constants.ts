const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export const API_URL = rawApiUrl.startsWith("http://") || rawApiUrl.startsWith("https://")
  ? rawApiUrl
  : `https://${rawApiUrl}`;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nexuspc.com.ar";
