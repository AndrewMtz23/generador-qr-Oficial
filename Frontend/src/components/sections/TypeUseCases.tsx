import { Zap, type LucideIcon } from "lucide-react";
import type { TextItem } from "../../utils/i18nContent";
import { RichText } from "../common/RichText";
import { SectionShell } from "./SectionShell";

interface TypeUseCasesProps {
  title: string;
  intro?: string;
  items: TextItem[];
  icons: readonly LucideIcon[];
}

/** Type pages: 3 to 4 concrete use cases for one QR type. */
export const TypeUseCases = ({ title, intro, items, icons }: TypeUseCasesProps) => (
  <SectionShell id="use-cases" title={title} icon={Zap} intro={intro}>
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item, index) => {
        const Icon = icons[index % icons.length];
        return (
          <article key={item.title} className="card p-6">
            <span className="icon-chip mb-4">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              <RichText text={item.text} />
            </p>
          </article>
        );
      })}
    </div>
  </SectionShell>
);
