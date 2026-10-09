import type { LucideIcon } from "lucide-react";
import { RichText } from "../common/RichText";
import { SectionShell } from "./SectionShell";

interface TextSectionProps {
  id: string;
  title: string;
  icon: LucideIcon;
  paragraphs: string[];
  tone?: "white" | "muted";
}

/** A heading followed by a few readable paragraphs. */
export const TextSection = ({ id, title, icon, paragraphs, tone = "white" }: TextSectionProps) => (
  <SectionShell id={id} title={title} icon={icon} tone={tone}>
    <div className="max-w-prose space-y-4">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
          <RichText text={paragraph} />
        </p>
      ))}
    </div>
  </SectionShell>
);
