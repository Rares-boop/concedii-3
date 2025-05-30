"use server";

import { getFooterData } from "@/utils/fetch-footer";
import { StrapiImage } from "@/components/StrapiImage";

export default async function Footer() {
  try {
    const { footer } = await getFooterData();

    if (!footer) return null;

    return (
      <footer className="bg-slate-800 text-gray-300 py-6 mt-12 shadow-inner">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-4 text-center">
          {footer.logo?.image?.url && (
            <StrapiImage
              src={footer.logo.image.url}
              alt={footer.logo.logoText || "Logo"}
              className="h-20 w-20 object-contain"
              width={120}
              height={120}
            />
          )}

          <p className="text-sm leading-relaxed">{footer.description}</p>

          <small className="text-xs text-gray-400">
            {footer.date
              ? new Date(footer.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "© 2025"}
          </small>
        </div>
      </footer>
    );
  } catch (error) {
    console.error("Failed to load footer:", error);
    return (
      <div className="bg-red-100 text-red-700 p-4 text-center mt-8 rounded">
        Oops! Failed to load footer. Try again later.
      </div>
    );
  }
}
