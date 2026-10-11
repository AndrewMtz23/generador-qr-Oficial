import { ChevronDown } from "lucide-react";
import type { FaqItem } from "../../utils/i18nContent";
import { RichText } from "../common/RichText";

interface FaqListProps {
  items: FaqItem[];
}

/** Native <details> accordion: every answer is in the HTML, so it is indexable without JS. */
export const FaqList = ({ items }: FaqListProps) => (
  <div className="space-y-3">
    {items.map((item) => (
      <details
        key={item.q}
        className="group rounded-xl border border-slate-200 bg-white open:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:open:bg-slate-800/50"
      >
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 rounded-xl p-4 [&::-webkit-details-marker]:hidden">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{item.q}</h3>
          <ChevronDown
            className="h-5 w-5 shrink-0 text-slate-600 transition-transform duration-200 group-open:rotate-180 dark:text-slate-400"
            aria-hidden="true"
          />
        </summary>
        <p className="px-4 pb-4 leading-relaxed text-slate-600 dark:text-slate-300">
          <RichText text={item.a} />
        </p>
      </details>
    ))}
  </div>
);
