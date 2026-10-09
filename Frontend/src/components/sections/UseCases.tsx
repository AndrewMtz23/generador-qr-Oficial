import { useTranslation } from "react-i18next";
import {
  Megaphone,
  Share2,
  Briefcase,
  UtensilsCrossed,
  CalendarDays,
  LifeBuoy,
  Zap,
  type LucideIcon,
} from "lucide-react";

const useCases: { key: string; icon: LucideIcon }[] = [
  { key: "marketing", icon: Megaphone },
  { key: "social", icon: Share2 },
  { key: "business", icon: Briefcase },
  { key: "restaurant", icon: UtensilsCrossed },
  { key: "events", icon: CalendarDays },
  { key: "support", icon: LifeBuoy },
];

export const UseCases = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-14 dark:bg-slate-900 sm:py-16">
      <div className="container-page">
        <div className="mb-4 flex items-center gap-3">
          <span className="icon-chip">
            <Zap className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {t("sections.useCases.title")}
          </h2>
        </div>
        <p className="mb-8 max-w-prose text-base leading-relaxed text-slate-600 dark:text-slate-300">
          {t("sections.useCases.intro")}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map(({ key, icon: Icon }) => (
            <article key={key} className="card p-6">
              <span className="icon-chip mb-4">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                {t(`sections.useCases.${key}.title`)}
              </h3>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                {t(`sections.useCases.${key}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
