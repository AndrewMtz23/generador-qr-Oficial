import { useLocation } from "react-router-dom";
import { STATIC_PAGE_META } from "../../config/seo";
import { SeoHead } from "./SeoHead";

/**
 * Baseline title, description, canonical and social tags for the non-generator public pages.
 * Renders nothing on routes that manage their own head (home and generator pages)
 * or that are client-only.
 */
export function StaticPageSeo() {
  const { pathname } = useLocation();
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const meta = STATIC_PAGE_META[path];

  if (!meta) return null;

  return <SeoHead title={meta.title} description={meta.description} path={path} />;
}
