import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SITE_URL, STATIC_PAGE_META } from "../../config/seo";

/**
 * Baseline title, description and canonical for the non-generator public pages.
 * Renders nothing on routes that manage their own head (home and generator pages)
 * or that are client-only.
 */
export function StaticPageSeo() {
  const { pathname } = useLocation();
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const meta = STATIC_PAGE_META[path];

  if (!meta) return null;

  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
    </Helmet>
  );
}
