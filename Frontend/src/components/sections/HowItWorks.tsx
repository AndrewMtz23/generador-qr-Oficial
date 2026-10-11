import { ListChecks } from "lucide-react";
import type { TextItem } from "../../utils/i18nContent";
import { RichText } from "../common/RichText";
import { SectionShell } from "./SectionShell";

interface HowItWorksProps {
  title: string;
  steps: TextItem[];
  intro?: string;
}

/** Numbered steps (3 on every landing). Same markup feeds the HowTo JSON-LD. */
export const HowItWorks = ({ title, steps, intro }: HowItWorksProps) => (
  <SectionShell id="how-it-works" title={title} icon={ListChecks} intro={intro}>
    <ol className="grid gap-4 md:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step.title} className="card p-6">
          <span
            aria-hidden="true"
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-700 font-heading text-lg font-bold text-white dark:bg-teal-400 dark:text-slate-950"
          >
            {index + 1}
          </span>
          <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{step.title}</h3>
          <p className="leading-relaxed text-slate-600 dark:text-slate-300">
            <RichText text={step.text} />
          </p>
        </li>
      ))}
    </ol>
  </SectionShell>
);
