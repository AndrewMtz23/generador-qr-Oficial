import { Lightbulb } from "lucide-react";
import type { TextItem } from "../../utils/i18nContent";
import { RichText } from "../common/RichText";
import { SectionShell } from "./SectionShell";

interface TypeTipsProps {
  title: string;
  items: TextItem[];
}

/** Type pages: practical tips for one QR type. */
export const TypeTips = ({ title, items }: TypeTipsProps) => (
  <SectionShell id="tips" title={title} icon={Lightbulb} tone="muted">
    <ul className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <li key={item.title} className="card p-6">
          <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
          <p className="leading-relaxed text-slate-600 dark:text-slate-300">
            <RichText text={item.text} />
          </p>
        </li>
      ))}
    </ul>
  </SectionShell>
);
