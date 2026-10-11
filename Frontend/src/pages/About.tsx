import { useTranslation } from "react-i18next";
import { Code2, Heart, Users, Target, Zap } from "lucide-react";
import { PageShell } from "../components/layout/PageShell";

const featureKeys = ["item1", "item2", "item3", "item4", "item5"] as const;

const sectionHeading = "mb-3 flex items-center gap-3 text-xl font-semibold text-slate-900 dark:text-white";

export const About = () => {
  const { t } = useTranslation();

  return (
    <PageShell title={t("about.title")} icon={Code2}>
      <p className="mb-8 leading-relaxed text-slate-600 dark:text-slate-300">{t("about.intro")}</p>

      <section className="mb-8">
        <h2 className={sectionHeading}>
          <span className="icon-chip h-9 w-9">
            <Target className="h-5 w-5" aria-hidden="true" />
          </span>
          {t("about.mission.title")}
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-300">{t("about.mission.content")}</p>
      </section>

      <section className="mb-8">
        <h2 className={sectionHeading}>
          <span className="icon-chip h-9 w-9">
            <Zap className="h-5 w-5" aria-hidden="true" />
          </span>
          {t("about.features.title")}
        </h2>
        <ul className="list-disc space-y-2 pl-6 marker:text-teal-700 dark:marker:text-teal-400 text-slate-600 dark:text-slate-300">
          {featureKeys.map((key) => (
            <li key={key}>{t(`about.features.${key}`)}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className={sectionHeading}>
          <span className="icon-chip h-9 w-9">
            <Users className="h-5 w-5" aria-hidden="true" />
          </span>
          {t("about.community.title")}
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-300">{t("about.community.content")}</p>
      </section>

      <section>
        <h2 className={sectionHeading}>
          <span className="icon-chip h-9 w-9">
            <Heart className="h-5 w-5" aria-hidden="true" />
          </span>
          {t("about.openSource.title")}
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-300">{t("about.openSource.content")}</p>
      </section>
    </PageShell>
  );
};
