import qs from "qs";
import { Footer } from "@/types";

export async function getFooterData(): Promise<{ footer: Footer }> {
  const apiUrl = process.env.NEXT_PUBLIC_API;

  if (!apiUrl) {
    throw new Error("API URL is missing in environment variables!");
  }

  const footerQuery = qs.stringify(
    {
      populate: {
        logo: { populate: "image" },
      },
    },
    { encodeValuesOnly: true }
  );

  const footerResponse = await fetch(`${apiUrl}/api/footer?${footerQuery}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!footerResponse.ok) {
    throw new Error(`Failed to fetch footer data: ${footerResponse.status} ${footerResponse.statusText}`);
  }

  const footerData = (await footerResponse.json()).data as Footer;

  return { footer: footerData };
}
