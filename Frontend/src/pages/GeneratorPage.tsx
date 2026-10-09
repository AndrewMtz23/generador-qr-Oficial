import { useEffect } from "react";
import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HelpCircle, ArrowRight } from "lucide-react";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/layout/Hero";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { QRTypeTabs } from "../components/qr/QRTypeTabs";
import { QRForm } from "../components/qr/QRForm";
import { QRDisplay } from "../components/qr/QRDisplay";
import { SeoHead } from "../components/seo/SeoHead";
import { HowItWorks } from "../components/sections/HowItWorks";
import { TypeCards } from "../components/sections/TypeCards";
import { StaticVsDynamic } from "../components/sections/StaticVsDynamic";
import { Comparison } from "../components/sections/Comparison";
import { WhatIsQR } from "../components/sections/WhatIsQR";
import { SectionShell } from "../components/sections/SectionShell";
import { FaqList } from "../components/sections/FaqList";
import { TextSection } from "../components/sections/TextSection";
import { TypeUseCases } from "../components/sections/TypeUseCases";
import { TypeTips } from "../components/sections/TypeTips";
import { OtherTypes } from "../components/sections/OtherTypes";
import { useQRGenerator } from "../hooks/useQRGenerator";
import { TYPE_ICONS, USE_CASE_ICONS } from "../config/landing";
import {
  SITE_URL,
  PROJECT_NAME,
  ROUTE_TO_TYPE,
  TYPE_TO_ROUTE,
  GENERATOR_ROUTE_META,
  GENERATOR_ROUTE_TYPES,
  HOME_META,
  type GeneratorRouteType,
} from "../config/seo";
import { getList, type FaqItem, type TextItem } from "../utils/i18nContent";
import {
  buildBreadcrumbLd,
  buildFaqLd,
  buildHowToLd,
  buildWebApplicationLd,
  buildWebSiteLd,
} from "../utils/structuredData";
import type { QRType } from "../types";

interface GeneratorPageProps {
  /** "home" renders the generator at "/" (url preset, canonical "/"); "type" uses the :type route param. */
  variant?: "home" | "type";
}

export function GeneratorPage({ variant = "type" }: GeneratorPageProps) {
  const isHome = variant === "home";
  const { t, i18n } = useTranslation();
  const { type: routeType } = useParams<{ type: string }>();
  const navigate = useNavigate();

  const isValidRoute =
    isHome || (!!routeType && GENERATOR_ROUTE_TYPES.includes(routeType as GeneratorRouteType));
  const resolvedRouteType: GeneratorRouteType =
    !isHome && isValidRoute ? (routeType as GeneratorRouteType) : "url";
  const internalType = ROUTE_TO_TYPE[resolvedRouteType];

  const qrGenerator = useQRGenerator();

  useEffect(() => {
    qrGenerator.setType(internalType);
  }, [internalType]);

  const setTypeViaNavigate = (newType: QRType) => {
    navigate(`/generador-qr/${TYPE_TO_ROUTE[newType]}`);
  };

  const qrGeneratorForForm = {
    ...qrGenerator,
    type: internalType,
    setType: setTypeViaNavigate,
  };

  if (!isValidRoute) {
    return <Navigate to="/generador-qr/url" replace />;
  }

  const contentKey = isHome ? "landing.home" : `landing.types.${resolvedRouteType}`;
  const meta = isHome ? HOME_META : GENERATOR_ROUTE_META[resolvedRouteType];
  const path = isHome ? "/" : `/generador-qr/${resolvedRouteType}`;
  const canonicalUrl = isHome ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  const language = i18n.language?.slice(0, 2) || "es";

  const h1 = t(`${contentKey}.h1`);
  const lead = t(`${contentKey}.lead`);
  const steps = getList<TextItem>(t, `${contentKey}.how.steps`);
  const howTitle = t(`${contentKey}.how.title`);
  const faqItems = getList<FaqItem>(t, `${contentKey}.faq.items`);

  const jsonLd = isHome
    ? [
        buildWebApplicationLd({
          name: PROJECT_NAME,
          url: canonicalUrl,
          description: meta.description,
          inLanguage: language,
          browserRequirements: t("landing.home.browserRequirements"),
          featureList: getList<string>(t, "landing.home.featureList"),
        }),
        buildWebSiteLd({ name: PROJECT_NAME, url: canonicalUrl, inLanguage: language }),
        buildFaqLd(faqItems),
      ]
    : [
        buildBreadcrumbLd([
          { name: t("landing.common.breadcrumbHome"), url: `${SITE_URL}/` },
          { name: t(`${contentKey}.breadcrumb`), url: canonicalUrl },
        ]),
        buildHowToLd(howTitle, lead, steps),
        buildFaqLd(faqItems),
      ];

  return (
    <>
      <SeoHead title={meta.title} description={meta.description} path={path} jsonLd={jsonLd} />

      <section className="bg-slate-50 py-10 dark:bg-slate-950 sm:py-14">
        <div className="container-page">
          {!isHome && <Breadcrumb currentLabel={t(`${contentKey}.breadcrumb`)} />}
          <Hero title={h1} lead={lead} />
          <h2 id="home-section-heading" className="sr-only">
            {t("main.sectionTitle")}
          </h2>

          <div className="card" role="group" aria-labelledby="home-section-heading">
            <div className="border-b border-slate-200 p-4 dark:border-slate-800 sm:p-5">
              <QRTypeTabs qrGenerator={qrGeneratorForForm} />
            </div>
            <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <div className="p-5 sm:p-6 lg:p-8">
                <QRForm qrGenerator={qrGeneratorForForm} />
              </div>
              <div className="rounded-b-2xl border-t border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40 sm:p-6 lg:rounded-bl-none lg:rounded-br-2xl lg:border-l lg:border-t-0 lg:p-8">
                <QRDisplay qrGenerator={qrGenerator} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks title={howTitle} steps={steps} intro={isHome ? t("landing.home.how.intro") : undefined} />

      {isHome ? (
        <>
          <TypeCards />
          <StaticVsDynamic />
          <Comparison />
          <WhatIsQR />
          <SectionShell
            id="faq"
            title={t("landing.home.faq.title")}
            icon={HelpCircle}
            tone="muted"
            intro={t("landing.home.faq.intro")}
          >
            <FaqList items={faqItems} />
            <p className="mt-6">
              <Link to="/faq" className="text-link inline-flex min-h-[44px] items-center gap-1">
                {t("landing.home.faq.more")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </p>
          </SectionShell>
        </>
      ) : (
        <>
          <TextSection
            id="about-type"
            title={t(`${contentKey}.about.title`)}
            icon={TYPE_ICONS[resolvedRouteType]}
            paragraphs={getList<string>(t, `${contentKey}.about.paragraphs`)}
            tone="muted"
          />
          <TypeUseCases
            title={t(`${contentKey}.useCases.title`)}
            intro={t(`${contentKey}.useCases.intro`)}
            items={getList<TextItem>(t, `${contentKey}.useCases.items`)}
            icons={USE_CASE_ICONS[resolvedRouteType]}
          />
          <TypeTips title={t(`${contentKey}.tips.title`)} items={getList<TextItem>(t, `${contentKey}.tips.items`)} />
          <SectionShell id="faq" title={t(`${contentKey}.faq.title`)} icon={HelpCircle}>
            <FaqList items={faqItems} />
          </SectionShell>
          <OtherTypes current={resolvedRouteType} />
        </>
      )}

      <Footer />
    </>
  );
}
