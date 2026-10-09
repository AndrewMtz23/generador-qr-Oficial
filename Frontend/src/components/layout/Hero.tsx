import { useTranslation } from "react-i18next";
import { UserX, Ban, Infinity as InfinityIcon } from "lucide-react";

interface HeroProps {
  title: string;
  lead: string;
}

const CHIPS = [
  { key: "noSignup", icon: UserX },
  { key: "noAds", icon: Ban },
  { key: "neverExpires", icon: InfinityIcon },
] as const;

/** Page H1, one-line promise and the three benefit chips. */
export const Hero = ({ title, lead }: HeroProps) => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
      <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
        {lead}
      </p>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {CHIPS.map(({ key, icon: Icon }) => (
          <li
            key={key}
            className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {t(`landing.chips.${key}`)}
          </li>
        ))}
      </ul>
    </div>
  );
};
