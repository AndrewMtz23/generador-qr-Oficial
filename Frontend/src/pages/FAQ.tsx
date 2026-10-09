import { useTranslation } from "react-i18next";
import { HelpCircle } from "lucide-react";
import { PageShell } from "../components/layout/PageShell";
import { FaqList } from "../components/sections/FaqList";
import { JsonLd } from "../components/seo/JsonLd";
import { getList, type FaqItem } from "../utils/i18nContent";
import { buildFaqLd } from "../utils/structuredData";

interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const FAQ = () => {
  const { t } = useTranslation();
  const groups = getList<FaqGroup>(t, "faq.groups");
  const allItems = groups.flatMap((group) => group.items);

  return (
    <PageShell title={t("faq.title")} icon={HelpCircle}>
      <JsonLd data={[buildFaqLd(allItems)]} />
      <p className="mb-8 leading-relaxed text-slate-600 dark:text-slate-300">{t("faq.subtitle")}</p>

      <div className="space-y-10">
        {groups.map((group) => (
          <section key={group.title} aria-label={group.title}>
            <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {group.title}
            </h2>
            <FaqList items={group.items} />
          </section>
        ))}
      </div>
    </PageShell>
  );
};
