import { stripRichText } from "./richText";

type JsonLd = Record<string, unknown>;

const CONTEXT = "https://schema.org";

interface FaqEntry {
  q: string;
  a: string;
}

interface StepEntry {
  title: string;
  text: string;
}

/** FAQPage. Answers are the visible text (internal links reduced to their label). */
export function buildFaqLd(items: FaqEntry[]): JsonLd {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: stripRichText(item.a) },
    })),
  };
}

export function buildHowToLd(name: string, description: string, steps: StepEntry[]): JsonLd {
  return {
    "@context": CONTEXT,
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.text,
    })),
  };
}

export function buildBreadcrumbLd(crumbs: { name: string; url: string }[]): JsonLd {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function buildWebApplicationLd(options: {
  name: string;
  url: string;
  description: string;
  inLanguage: string;
  browserRequirements: string;
  featureList: string[];
}): JsonLd {
  return {
    "@context": CONTEXT,
    "@type": "WebApplication",
    name: options.name,
    url: options.url,
    description: options.description,
    inLanguage: options.inLanguage,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: options.browserRequirements,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    featureList: options.featureList,
  };
}

export function buildWebSiteLd(options: { name: string; url: string; inLanguage: string }): JsonLd {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    name: options.name,
    url: options.url,
    inLanguage: options.inLanguage,
  };
}
