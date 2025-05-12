"use server";

import { getFooterData } from "@/utils/fetch-footer";
import { StrapiImage } from "@/components/StrapiImage";

export default async function Footer() {
  try {
    const { footer } = await getFooterData();

    if (!footer) return null;

    return (
      <footer className="footer">
        <div className="footer__content">
          {footer.logo?.image?.url && (
            <StrapiImage
              src={footer.logo.image.url}
              alt={footer.logo.logoText || "Logo"}
              className="footer__logo"
              width={120}
              height={120}
            />
          )}

          <p className="footer__description">{footer.description}</p>

          <small className="footer__date">
            {footer.date ? new Date(footer.date).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric"
            }) : "© 2025"}
          </small>


        </div>
      </footer>
    );
  } catch (error) {
    console.error(" Failed to load footer:", error);
    return <p className="footer__error">Oops! Failed to load footer. Try again later.</p>;
  }
}
