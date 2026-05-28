"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { aspirasiSchema, type AspirasiInput } from "@/lib/aspirasi-schema";
import { submitAspirasi } from "@/app/(public)/aspirasi/actions";
import {
  ASPIRASI_KATEGORI,
  ASPIRASI_KATEGORI_LABEL_KEY,
  ASPIRASI_KELAS,
} from "@/lib/constants";

const inputCls =
  "w-full rounded border border-navy-100 bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-navy";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-navy">{label}</span>
      {children}
      {error && (
        <span className="mt-1 block text-xs font-medium text-pink">{error}</span>
      )}
    </label>
  );
}

export function AspirasiForm() {
  const t = useTranslations("Aspirasi");
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AspirasiInput>({
    resolver: zodResolver(aspirasiSchema),
    defaultValues: {
      nama: "",
      kelas: "" as AspirasiInput["kelas"],
      kategori: "" as AspirasiInput["kategori"],
      judul: "",
      isi: "",
      contact: "",
      website: "",
    },
  });

  async function onSubmit(values: AspirasiInput) {
    setServerError(null);
    const res = await submitAspirasi(values);
    if (res.ok) {
      reset();
      setDone(true);
    } else {
      setServerError(t("errorGeneric"));
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-navy-100 bg-white p-8 text-center">
        <CheckCircle2 className="mx-auto text-green-600" size={48} aria-hidden />
        <h2 className="mt-4 text-2xl font-bold text-navy">
          {t("successTitle")}
        </h2>
        <p className="mt-2 text-muted">{t("successBody")}</p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-6 rounded border border-navy-100 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-navy-50"
        >
          {t("successAgain")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-xl border border-navy-100 bg-white p-6 sm:p-8"
    >
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        {...register("website")}
      />

      <div className="grid gap-5">
        <Field label={t("name")} error={errors.nama && t("errorRequired")}>
          <input
            {...register("nama")}
            placeholder={t("namePlaceholder")}
            className={inputCls}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("kelas")} error={errors.kelas && t("errorRequired")}>
            <select {...register("kelas")} className={inputCls}>
              <option value="" disabled>
                {t("kelasPlaceholder")}
              </option>
              {ASPIRASI_KELAS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label={t("kategori")}
            error={errors.kategori && t("errorRequired")}
          >
            <select {...register("kategori")} className={inputCls}>
              <option value="" disabled>
                {t("kategoriPlaceholder")}
              </option>
              {ASPIRASI_KATEGORI.map((k) => (
                <option key={k} value={k}>
                  {t(ASPIRASI_KATEGORI_LABEL_KEY[k])}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label={t("judul")} error={errors.judul && t("errorRequired")}>
          <input
            {...register("judul")}
            placeholder={t("judulPlaceholder")}
            className={inputCls}
          />
        </Field>

        <Field label={t("isi")} error={errors.isi && t("errorRequired")}>
          <textarea
            {...register("isi")}
            rows={6}
            placeholder={t("isiPlaceholder")}
            className={inputCls}
          />
        </Field>

        <Field label={t("contact")}>
          <input
            {...register("contact")}
            placeholder={t("contactPlaceholder")}
            className={inputCls}
          />
        </Field>

        {serverError && (
          <p className="text-sm font-medium text-pink">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-navy py-3 text-base font-bold text-amber transition-colors hover:bg-navy-700 disabled:opacity-60"
        >
          {isSubmitting ? t("submitting") : t("submit")}
        </button>
      </div>
    </form>
  );
}
