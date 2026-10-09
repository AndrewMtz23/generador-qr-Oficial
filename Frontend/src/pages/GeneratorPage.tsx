import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/layout/Hero";
import { QRTypeTabs } from "../components/qr/QRTypeTabs";
import { QRForm } from "../components/qr/QRForm";
import { QRDisplay } from "../components/qr/QRDisplay";
import { WhatIsQR } from "../components/sections/WhatIsQR";
import { HowToUse } from "../components/sections/HowToUse";
import { UseCases } from "../components/sections/UseCases";
import { ComingSoonModal } from "../components/common/ComingSoonModal";
import { useQRGenerator } from "../hooks/useQRGenerator";
import {
  SITE_URL,
  ROUTE_TO_TYPE,
  TYPE_TO_ROUTE,
  GENERATOR_ROUTE_META,
  HOME_META,
  type GeneratorRouteType,
} from "../config/seo";
import type { QRType } from "../types";

const VALID_ROUTE_TYPES: GeneratorRouteType[] = ["url", "whatsapp", "wifi", "texto"];

interface GeneratorPageProps {
  /** "home" renders the generator at "/" (url preset, canonical "/"); "type" uses the :type route param. */
  variant?: "home" | "type";
}

export function GeneratorPage({ variant = "type" }: GeneratorPageProps) {
  const isHome = variant === "home";
  const { t } = useTranslation();
  const { type: routeType } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const isValidRoute =
    isHome || (!!routeType && VALID_ROUTE_TYPES.includes(routeType as GeneratorRouteType));
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

  const meta = isHome ? HOME_META : GENERATOR_ROUTE_META[resolvedRouteType];
  const canonicalUrl = isHome ? `${SITE_URL}/` : `${SITE_URL}/generador-qr/${resolvedRouteType}`;

  if (!isValidRoute) {
    return <Navigate to="/generador-qr/url" replace />;
  }

  return (
    <>
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

      <section className="bg-slate-50 py-10 dark:bg-slate-950 sm:py-14">
        <div className="container-page">
          <Hero />
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

      <WhatIsQR />
      <HowToUse />
      <UseCases />
      <Footer />

      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
      />
    </>
  );
}
