
import qs from "qs";

// --- Types ---
interface LogoData {
  url: string;
  logoText: string;
}

interface CtaData {
  text: string;
  href: string;
  isExternal: boolean;
}

export interface HeaderData {
  logo: LogoData[];
  cta: CtaData[];
}

export interface GlobalSettings {
  header: HeaderData;
}

// --- Query String for GET /api/global ---
export const globalSettingQuery = qs.stringify({
  populate: {
    header: {
      populate: {
        logo: {
          fields: ["url", "logoText"],
        },
        cta: {
          fields: ["text", "href", "isExternal"],
        },
      },
    },
  },
});

// --- Main Data Fetch Function ---
export async function getGlobalSettings(): Promise<GlobalSettings | null> {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API;
    if (!BASE_URL) {
      throw new Error("Missing NEXT_PUBLIC_API environment variable.");
    }
    const url = new URL("api/global", BASE_URL);
    url.search = globalSettingQuery;

    const response = await fetch(url.href, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Failed to fetch global settings: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const logoArr = data?.data?.attributes?.header?.logo ?? [];
    const ctaArr = data?.data?.attributes?.header?.cta ?? [];

    return {
      header: {
        logo: Array.isArray(logoArr)
          ? logoArr.map(
              (item: any): LogoData => ({
                url: String(item.url ?? ""),
                logoText: String(item.logoText ?? ""),
              })
            )
          : [],
        cta: Array.isArray(ctaArr)
          ? ctaArr.map(
              (item: any): CtaData => ({
                text: String(item.text ?? ""),
                href: String(item.href ?? ""),
                isExternal: Boolean(item.isExternal),
              })
            )
          : [],
      },
    };
  } catch (error) {
    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching global settings:", error);
    }
    return null;
  }
}

// --- Loader for SSR or Data Hooks ---
export async function loader(): Promise<{ header: HeaderData }> {
  const globalSettings = await getGlobalSettings();
  if (!globalSettings || !globalSettings.header) {
    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.error("Global settings not found");
    }
    // Defensive fallback
    return { header: { logo: [], cta: [] } };
  }
  return { header: globalSettings.header };
}
