import { useState, type ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, ChevronDown, LocateFixed, Loader2 } from "lucide-react";
import { fieldKey, type FieldDef, type FormSpec } from "../../config/qrTypes";
import type { FieldValues } from "../../types";

/**
 * Renders the form of a registry type from its `FormSpec`: fields (with groups, two-column rows,
 * conditional fields), inline errors/warnings, optional per-type extras and the payload preview.
 * Copy lives in `form.types.<slug>.*`; see `fieldKey` in `config/qrTypes.ts`.
 */

interface ExtraProps {
  slug: string;
  values: FieldValues;
  setValue: (name: string, value: string) => void;
}

const fieldId = (name: string) => `qr-field-${name}`;

/* ------------------------------------------------------------------ extras */

const GoogleReviewsGuide = ({ slug }: ExtraProps) => {
  const { t } = useTranslation();
  const steps = t(`form.types.${slug}.guide.steps`, { returnObjects: true }) as unknown;
  return (
    <details className="group rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
      <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-4 text-sm font-semibold text-slate-900 dark:text-white [&::-webkit-details-marker]:hidden">
        {t(`form.types.${slug}.guide.title`)}
        <ChevronDown
          className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="space-y-2 px-4 pb-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <p>{t(`form.types.${slug}.guide.intro`)}</p>
        <ol className="list-decimal space-y-1 pl-5">
          {Array.isArray(steps) && steps.map((step) => <li key={String(step)}>{String(step)}</li>)}
        </ol>
      </div>
    </details>
  );
};

type GeoStatus = "idle" | "loading" | "success" | "denied" | "unavailable" | "timeout" | "unsupported";

const LocationTools = ({ slug, setValue }: ExtraProps) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<GeoStatus>("idle");

  // Only runs on click: the browser asks for permission at that moment, never on page load.
  const locate = () => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("mode", "coords");
        setValue("lat", position.coords.latitude.toFixed(6));
        setValue("lng", position.coords.longitude.toFixed(6));
        setStatus("success");
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) setStatus("denied");
        else if (error.code === error.TIMEOUT) setStatus("timeout");
        else setStatus("unavailable");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div>
      <button type="button" onClick={locate} disabled={status === "loading"} className="btn-secondary w-full sm:w-auto">
        {status === "loading" ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        ) : (
          <LocateFixed className="h-5 w-5" aria-hidden="true" />
        )}
        {status === "loading" ? t(`form.types.${slug}.geo.loading`) : t(`form.types.${slug}.geo.button`)}
      </button>
      <p className="field-hint">{t(`form.types.${slug}.geo.hint`)}</p>
      <p
        role="status"
        className={`mt-1.5 text-sm ${
          status === "success" ? "text-teal-800 dark:text-teal-300" : "text-amber-800 dark:text-amber-300"
        }`}
      >
        {status !== "idle" && status !== "loading" && t(`form.types.${slug}.geo.${status}`)}
      </p>
    </div>
  );
};

/** Optional per-type blocks rendered after the fields, keyed by type id. */
const EXTRAS: Record<string, ComponentType<ExtraProps>> = {
  "resenas-google": GoogleReviewsGuide,
  ubicacion: LocationTools,
};

/* ------------------------------------------------------------------ fields */

interface FieldProps {
  slug: string;
  field: FieldDef;
  value: string;
  error?: string;
  warning?: string;
  setValue: (name: string, value: string) => void;
}

const Field = ({ slug, field, value, error, warning, setValue }: FieldProps) => {
  const { t } = useTranslation();
  const id = fieldId(field.name);
  const label = t(fieldKey(slug, field.name, "label"));
  const hint = field.hint ? t(fieldKey(slug, field.name, "hint")) : null;
  const describedBy =
    [hint && `${id}-hint`, error && `${id}-error`, warning && `${id}-warning`].filter(Boolean).join(" ") || undefined;

  const messages = (
    <>
      {hint && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-medium text-red-700 dark:text-red-400">
          {t(`form.types.${slug}.errors.${error}`)}
        </p>
      )}
      {warning && (
        <p id={`${id}-warning`} className="mt-1.5 flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{t(`form.types.${slug}.warnings.${warning}`)}</span>
        </p>
      )}
    </>
  );

  if (field.kind === "choice") {
    return (
      <fieldset>
        <legend className="field-label">{label}</legend>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {field.options?.map((option) => (
            <label key={option} className="relative cursor-pointer">
              <input
                type="radio"
                name={`${slug}-${field.name}`}
                value={option}
                checked={value === option}
                onChange={() => setValue(field.name, option)}
                className="peer sr-only"
              />
              <span className="flex min-h-[44px] items-center justify-center rounded-lg px-3 text-center text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-white peer-checked:bg-teal-700 peer-checked:text-white peer-checked:shadow-sm peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-teal-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:peer-checked:bg-teal-400 dark:peer-checked:text-slate-950 dark:peer-focus-visible:outline-teal-400">
                {t(fieldKey(slug, field.name, `options.${option}`))}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  const common = {
    id,
    value,
    onChange: (event: { target: { value: string } }) => setValue(field.name, event.target.value),
    placeholder: field.placeholder ? t(fieldKey(slug, field.name, "placeholder")) : undefined,
    autoComplete: field.autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: `field${error ? " !border-red-700 dark:!border-red-400" : ""}`,
  };

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {field.kind === "textarea" ? (
        <textarea {...common} rows={field.rows ?? 3} />
      ) : (
        <input
          {...common}
          type={field.kind}
          inputMode={field.kind === "tel" ? "tel" : field.kind === "email" ? "email" : field.kind === "url" ? "url" : undefined}
          spellCheck={false}
        />
      )}
      {messages}
    </div>
  );
};

/* ------------------------------------------------------------------ form */

interface TypeFieldsProps {
  slug: string;
  typeId: string;
  form: FormSpec;
  values: FieldValues;
  errors: Record<string, string>;
  setFieldValue: (typeId: string, name: string, value: string) => void;
}

export const TypeFields = ({ slug, typeId, form, values, errors, setFieldValue }: TypeFieldsProps) => {
  const { t } = useTranslation();
  const setValue = (name: string, value: string) => setFieldValue(typeId, name, value);

  const visible = form.fields.filter((field) => !field.visibleWhen || field.visibleWhen(values));
  const sections: { group?: string; fields: FieldDef[] }[] = [];
  for (const field of visible) {
    const last = sections[sections.length - 1];
    if (last && last.group === field.group) last.fields.push(field);
    else sections.push({ group: field.group, fields: [field] });
  }

  const { errors: liveErrors, warnings } = form.validate(values);
  const preview = Object.keys(liveErrors).length === 0 ? form.buildPayload(values).replace(/\r\n/g, "\n") : null;
  const Extra = EXTRAS[typeId];

  const grid = (fields: FieldDef[]) => (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.name} className={field.width === "half" ? undefined : "sm:col-span-2"}>
          <Field
            slug={slug}
            field={field}
            value={values[field.name] ?? ""}
            error={errors[field.name]}
            warning={warnings[field.name]}
            setValue={setValue}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      {sections.map((section, index) =>
        section.group ? (
          <fieldset key={`${section.group}-${index}`}>
            <legend className="field-label">{t(`form.types.${slug}.groups.${section.group}`)}</legend>
            {grid(section.fields)}
          </fieldset>
        ) : (
          <div key={`section-${index}`}>{grid(section.fields)}</div>
        )
      )}

      {Extra && <Extra slug={slug} values={values} setValue={setValue} />}

      <div>
        <p className="field-label">{t("form.payloadPreview")}</p>
        {preview !== null ? (
          <pre
            tabIndex={0}
            aria-label={t("form.payloadPreview")}
            className="max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            {preview}
          </pre>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
            {t("form.payloadPreviewEmpty")}
          </p>
        )}
      </div>
    </div>
  );
};
