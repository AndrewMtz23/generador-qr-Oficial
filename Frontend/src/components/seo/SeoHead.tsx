import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { OG_IMAGE, OG_LOCALES, PROJECT_NAME, SITE_URL } from "../../config/seo";
import { JsonLd } from "./JsonLd";

interface SeoHeadProps {
  title: string;
  description: string;
  /** Pathname of the page ("/" for the home). Used for canonical and og:url. */
  path: string;
  /** Structured data objects, one script block each. */
  jsonLd?: Record<string, unknown>[];
}

/** Title, description, canonical, Open Graph, Twitter card and optional JSON-LD for one page. */
export const SeoHead = ({ title, description, path, jsonLd = [] }: SeoHeadProps) => {
  const { i18n } = useTranslation();
  const canonicalUrl = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  const locale = OG_LOCALES[i18n.language?.slice(0, 2)] ?? OG_LOCALES.es;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:site_name" content={PROJECT_NAME} />
        <meta property="og:locale" content={locale} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={OG_IMAGE.url} />
        <meta property="og:image:width" content={String(OG_IMAGE.width)} />
        <meta property="og:image:height" content={String(OG_IMAGE.height)} />
        <meta property="og:image:alt" content={OG_IMAGE.alt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={OG_IMAGE.url} />
        <meta name="twitter:image:alt" content={OG_IMAGE.alt} />
      </Helmet>
      {jsonLd.length > 0 && <JsonLd data={jsonLd} />}
    </>
  );
};
