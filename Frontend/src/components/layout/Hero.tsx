import { useTranslation } from "react-i18next";

export const Hero = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
      <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
        {t("main.title")}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
        {t("main.subtitle")}
      </p>
    </div>
  );
};
