"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FormCard, FormSection, FormInput, FormSelect } from "@/components/ui/form-components";
import { useRequests } from "@/hooks/use-requests";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ArrowLeft, Loader2, FileText, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { Resident } from "@/lib/types";

const SITIO_CHOICES = [
  "All Season 1",
  "All Season 2",
  "All Season 3",
  "Apple",
  "Caimito",
  "Elma",
  "Laguna 1",
  "Laguna 2",
  "Little Hawaii",
  "Lourdes Extension",
  "Lourdes Proper",
];

interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "date";
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface DocConfig {
  title: string;
  backendType: string;
  description: string;
  fields: FieldConfig[];
  specialNote?: string;
}

const DOCUMENT_CONFIGS: Record<string, DocConfig> = {
  "barangay-clearance": {
    title: "Barangay Clearance",
    backendType: "barangay_clearance",
    description: "Request a clearance for employment, business, or legal purposes.",
    fields: [
      { name: "first_name", label: "First Name", type: "text", required: true },
      { name: "middle_name", label: "Middle Name", type: "text", required: false },
      { name: "last_name", label: "Last Name", type: "text", required: true },
      { name: "sitio", label: "Sitio", type: "select", required: true, options: SITIO_CHOICES },
      { name: "gender", label: "Gender", type: "select", required: true, options: ["Male", "Female"] },
      { name: "purpose", label: "Purpose", type: "text", required: true, placeholder: "e.g., Employment, Travel" },
    ],
  },
  "residency": {
    title: "Certificate of Residency",
    backendType: "residency",
    description: "Proof of residence within the barangay jurisdiction.",
    fields: [
      { name: "first_name", label: "First Name", type: "text", required: true },
      { name: "middle_name", label: "Middle Name", type: "text", required: false },
      { name: "last_name", label: "Last Name", type: "text", required: true },
      { name: "sitio", label: "Sitio", type: "select", required: true, options: SITIO_CHOICES },
      { name: "years_of_living", label: "Years of Living", type: "number", required: true, placeholder: "Years of residency" },
      { name: "purpose", label: "Purpose", type: "text", required: true, placeholder: "Specify purpose of certificate" },
    ],
    specialNote: "If the purpose is for a scholarship, the applicant must enter the student's full name in the Purpose field.",
  },
  "indigency": {
    title: "Certificate of Indigency",
    backendType: "indigency",
    description: "For medical, educational, or financial assistance applications.",
    fields: [
      { name: "first_name", label: "First Name", type: "text", required: true },
      { name: "middle_name", label: "Middle Name", type: "text", required: false },
      { name: "last_name", label: "Last Name", type: "text", required: true },
      { name: "sitio", label: "Sitio", type: "select", required: true, options: SITIO_CHOICES },
      { name: "gender", label: "Gender", type: "select", required: true, options: ["Male", "Female"] },
      { name: "years_of_living", label: "Years of Living", type: "number", required: true, placeholder: "Years of residency" },
      { name: "purpose", label: "Purpose", type: "text", required: true, placeholder: "Specify purpose of certificate" },
    ],
    specialNote: "If the purpose is for a scholarship, the applicant must enter the student's full name in the Purpose field.",
  },
  "cedula": {
    title: "Cedula",
    backendType: "cedula",
    description: "Community Tax Certificate for legal transactions and official identification.",
    fields: [
      { name: "first_name", label: "First Name", type: "text", required: true },
      { name: "middle_name", label: "Middle Name", type: "text", required: false },
      { name: "last_name", label: "Last Name", type: "text", required: true },
      { name: "address", label: "Complete Address", type: "text", required: true, placeholder: "House No., Street, Sitio" },
      { name: "age", label: "Age", type: "number", required: true },
      { name: "birthday", label: "Birthday", type: "date", required: true },
      { name: "birthplace", label: "Birthplace", type: "text", required: true, placeholder: "City/Municipality of birth" },
      { name: "income", label: "Annual Income", type: "number", required: true, placeholder: "Annual income in PHP" },
    ],
  },
  "low-income": {
    title: "Certificate of Low Income",
    backendType: "low_income",
    description: "Request a certificate proving low income status.",
    fields: [
      { name: "first_name", label: "First Name", type: "text", required: true },
      { name: "middle_name", label: "Middle Name", type: "text", required: false },
      { name: "last_name", label: "Last Name", type: "text", required: true },
      { name: "sitio", label: "Sitio", type: "select", required: true, options: SITIO_CHOICES },
      { name: "monthly_income", label: "Monthly Income", type: "number", required: true, placeholder: "Monthly income in PHP" },
      { name: "work", label: "Work / Occupation", type: "text", required: true, placeholder: "e.g., Vendor, Jeepney Driver" },
      { name: "purpose", label: "Purpose", type: "text", required: true, placeholder: "Specify purpose of certificate" },
    ],
    specialNote: "If the purpose is for a scholarship, the applicant must enter the student's full name in the Purpose field.",
  },
  "no-income": {
    title: "Certificate of No Income",
    backendType: "no_income",
    description: "Request a certificate proving no income status.",
    fields: [
      { name: "first_name", label: "First Name", type: "text", required: true },
      { name: "middle_name", label: "Middle Name", type: "text", required: false },
      { name: "last_name", label: "Last Name", type: "text", required: true },
      { name: "address", label: "Complete Address", type: "text", required: true, placeholder: "House No., Street, Sitio" },
      { name: "purpose", label: "Purpose", type: "text", required: true, placeholder: "Specify purpose of certificate" },
    ],
    specialNote: "If the purpose is for a scholarship, the applicant must enter the student's full name in the Purpose field.",
  },
  "business-permit": {
    title: "Business Permit",
    backendType: "business_permit",
    description: "Barangay clearance to operate a business.",
    fields: [
      { name: "first_name", label: "First Name", type: "text", required: true },
      { name: "middle_name", label: "Middle Name", type: "text", required: false },
      { name: "last_name", label: "Last Name", type: "text", required: true },
      { name: "sitio", label: "Sitio", type: "select", required: true, options: SITIO_CHOICES },
      { name: "new_renewal", label: "New/Renewal", type: "select", required: true, options: ["New", "Renewal"] },
      { name: "business_type", label: "Business Type", type: "text", required: true, placeholder: "e.g., Sari-Sari Store, Bakeshop" },
      { name: "business_name", label: "Business Name", type: "text", required: true, placeholder: "Official business name" },
      { name: "business_address", label: "Business Address", type: "text", required: true, placeholder: "Exact business address" },
      { name: "capital", label: "Capital Investment", type: "number", required: true, placeholder: "Capital in PHP" },
      { name: "gross_income", label: "Gross Income", type: "number", required: true, placeholder: "Annual gross income" },
    ],
  },
  "identification": {
    title: "Certificate of Identification",
    backendType: "identification",
    description: "Request a Barangay Identification certificate.",
    fields: [
      { name: "first_name", label: "First Name", type: "text", required: true },
      { name: "middle_name", label: "Middle Name", type: "text", required: false },
      { name: "last_name", label: "Last Name", type: "text", required: true },
      { name: "sitio", label: "Sitio", type: "select", required: true, options: SITIO_CHOICES },
      { name: "age", label: "Age", type: "number", required: true },
      { name: "birthday", label: "Birthday", type: "date", required: true },
    ],
  },
  "attestation": {
    title: "Attestation",
    backendType: "attestation",
    description: "Request an attestation certificate.",
    fields: [
      { name: "first_name", label: "First Name", type: "text", required: true },
      { name: "middle_name", label: "Middle Name", type: "text", required: false },
      { name: "last_name", label: "Last Name", type: "text", required: true },
      { name: "sitio", label: "Sitio", type: "select", required: true, options: SITIO_CHOICES },
      { name: "age", label: "Age", type: "number", required: true },
      { name: "monthly_income", label: "Monthly Income", type: "number", required: true, placeholder: "Monthly income in PHP" },
      { name: "work", label: "Work / Occupation", type: "text", required: true, placeholder: "e.g., Driver, Housewife" },
      { name: "purpose", label: "Purpose", type: "text", required: true, placeholder: "Specify purpose of certificate" },
    ],
  },
  "jail-entrance": {
    title: "Jail Entrance Certificate",
    backendType: "jail_entrance",
    description: "Request a certificate for jail entrance visitation.",
    fields: [
      { name: "first_name", label: "First Name", type: "text", required: true },
      { name: "middle_name", label: "Middle Name", type: "text", required: false },
      { name: "last_name", label: "Last Name", type: "text", required: true },
      { name: "sitio", label: "Sitio", type: "select", required: true, options: SITIO_CHOICES },
      { name: "age", label: "Age", type: "number", required: true },
      { name: "relationship_to_prisoner", label: "Relationship to Prisoner", type: "text", required: true, placeholder: "e.g., Mother, Spouse" },
      { name: "prisoner_name", label: "Prisoner's Full Name", type: "text", required: true },
      { name: "prisoner_age", label: "Prisoner's Age", type: "number", required: true },
      { name: "jail_address", label: "Jail Address / Place", type: "text", required: true, placeholder: "e.g., Cebu City Jail Male Dorm" },
    ],
  },
  "solo-parent": {
    title: "Solo Parent Certificate",
    backendType: "solo_parent",
    description: "Request a Solo Parent Certificate.",
    fields: [
      { name: "first_name", label: "First Name", type: "text", required: true },
      { name: "middle_name", label: "Middle Name", type: "text", required: false },
      { name: "last_name", label: "Last Name", type: "text", required: true },
      { name: "sitio", label: "Sitio", type: "select", required: true, options: SITIO_CHOICES },
      { name: "number_of_children", label: "Number of Children", type: "number", required: true, placeholder: "Number of minor dependents" },
      { name: "purpose", label: "Purpose", type: "text", required: true, placeholder: "Specify purpose of certificate" },
    ],
  },
};

export default function DynamicDocumentRequestForm() {
  const router = useRouter();
  const params = useParams();
  const typeKey = typeof params?.type === "string" ? params.type : "";
  const config = DOCUMENT_CONFIGS[typeKey];

  const { createRequest } = useRequests();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  // Query authenticated resident's profile details to prefill the fields
  const { data: residents = [], isLoading: isLoadingResident } = useQuery<Resident[]>({
    queryKey: ["residents-me"],
    queryFn: async () => {
      const { data } = await api.get("/residents/");
      return data.results ?? data;
    },
  });

  const resident = residents[0];

  // Prefill fields when resident profile data is loaded
  useEffect(() => {
    if (resident && config) {
      const initialValues: Record<string, string> = {};
      config.fields.forEach((field) => {
        if (field.name === "first_name") initialValues.first_name = resident.first_name || "";
        else if (field.name === "middle_name") initialValues.middle_name = resident.middle_name || "";
        else if (field.name === "last_name") initialValues.last_name = resident.last_name || "";
        else if (field.name === "sitio") initialValues.sitio = resident.purok_sitio || "";
        else if (field.name === "address") initialValues.address = resident.address || "";
        else if (field.name === "gender") {
          // normalize gender
          const gen = resident.gender?.toLowerCase() || "";
          initialValues.gender = gen === "male" ? "Male" : gen === "female" ? "Female" : "";
        } else if (field.name === "birthday") initialValues.birthday = resident.date_of_birth || "";
      });
      setFormValues((prev) => ({ ...initialValues, ...prev }));
    }
  }, [resident, config]);

  if (!config) {
    return (
      <DashboardLayout allowedRoles={["resident"]}>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <AlertCircle size={40} className="text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-slate-800 dark:text-white">Document Type Not Found</h2>
          <p className="mt-2 text-sm text-slate-400">Please verify the URL or select a valid service.</p>
          <Link href="/resident/requests/new" className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold">
            Back to Selection
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleInputChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const purposeVal = formData.get("purpose") as string;

    const extraFields: Record<string, any> = {};
    config.fields.forEach((field) => {
      if (field.name !== "purpose") {
        extraFields[field.name] = formData.get(field.name);
      }
    });

    const payload = {
      certificate_type: config.backendType,
      purpose: purposeVal || "Request of document",
      extra_fields: extraFields,
    };

    try {
      await createRequest.mutateAsync(payload as any);
      router.push("/resident/requests");
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const dayOrdinal = new Date().getDate();

  return (
    <DashboardLayout allowedRoles={["resident"]}>
      {/* Header section */}
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/resident/requests/new"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/50 bg-white/80 dark:border-slate-800/40 dark:bg-slate-900/50 text-slate-500 hover:text-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
            {config.title}
          </h1>
          <p className="mt-2 text-xs text-slate-400 font-medium">{config.description}</p>
        </div>
      </div>

      {config.specialNote && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-xs font-semibold text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-400">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <div>
            <span className="font-extrabold">Special Note:</span> {config.specialNote}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormCard
              title={`${config.title} Request`}
              description="Please fill out the form requirements below to submit your application."
            >
              <FormSection title="Information Requirements">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {config.fields.map((field) => {
                    const val = formValues[field.name] ?? "";
                    if (field.type === "select") {
                      return (
                        <FormSelect
                          key={field.name}
                          name={field.name}
                          label={field.label}
                          required={field.required}
                          value={val}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                        >
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt} className="dark:bg-slate-950">
                              {opt}
                            </option>
                          ))}
                        </FormSelect>
                      );
                    }
                    return (
                      <FormInput
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder ?? `Enter ${field.label.toLowerCase()}`}
                        value={val}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        {...(field.type === "number" ? { min: 1 } : {})}
                      />
                    );
                  })}
                </div>
              </FormSection>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || isLoadingResident}
                  className="group flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-6 text-xs font-bold uppercase tracking-wider text-white dark:text-slate-950 shadow-md shadow-slate-950/10 hover:bg-blue-600 dark:hover:bg-cyan-50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                  Submit Request
                </button>
              </div>
            </FormCard>
          </form>
        </div>

        {/* Right Column: Live Interactive Preview Canvas */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Live Certificate Preview</h2>

          <div className="relative overflow-hidden rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-950 p-4 sm:p-8 shadow-xl min-h-[480px] flex flex-col justify-between select-none">
            {/* Watermark overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-8 pointer-events-none">
              <img src="/favicon.png" alt="Barangay Logo" className="w-[260px] h-[260px] object-contain" />
            </div>

            {/* Document Header */}
            <div className="text-center space-y-0.5 border-b border-slate-100 dark:border-slate-900/40 pb-4">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Republic of the Philippines
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">City of Cebu</p>
              <p className="text-xs font-extrabold text-blue-600 dark:text-cyan-400 uppercase tracking-wide py-0.5">
                Barangay Cogon Pardo
              </p>
              <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest leading-none">
                Office of the Barangay Captain
              </p>
            </div>

            {/* Document Title */}
            <div className="text-center py-4">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white tracking-widest uppercase border-b-2 border-slate-900/10 dark:border-white/10 pb-1.5 inline-block">
                {config.title}
              </h3>
            </div>

            {/* Document Content Body */}
            <div className="flex-1 py-4 space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <p className="text-[10px] font-extrabold tracking-widest text-slate-400">TO WHOM IT MAY CONCERN:</p>

              {config.backendType === "barangay_clearance" && (
                <p className="text-justify">
                  This is to certify that{" "}
                  <strong className="text-slate-800 dark:text-white font-bold underline decoration-blue-500/30 underline-offset-4">
                    {formValues.first_name || "____"}{" "}
                    {formValues.middle_name ? `${formValues.middle_name} ` : ""}
                    {formValues.last_name || "____"}
                  </strong>
                  , a resident of Sitio{" "}
                  <strong className="text-slate-800 dark:text-white font-bold underline decoration-blue-500/30 underline-offset-4">
                    {formValues.sitio || "________________"}
                  </strong>
                  , is a person of good moral character. This clearance is issued for the purpose of{" "}
                  <strong className="text-slate-800 dark:text-white font-bold underline decoration-cyan-500/30 underline-offset-4">
                    {formValues.purpose || "____________________________________"}
                  </strong>.
                </p>
              )}

              {config.backendType === "residency" && (
                <p className="text-justify">
                  This certifies that{" "}
                  <strong className="text-slate-800 dark:text-white font-bold underline decoration-blue-500/30 underline-offset-4">
                    {formValues.first_name || "____"}{" "}
                    {formValues.middle_name ? `${formValues.middle_name} ` : ""}
                    {formValues.last_name || "____"}
                  </strong>
                  , is a bonafide resident of Sitio{" "}
                  <strong className="text-slate-800 dark:text-white font-bold underline decoration-blue-500/30 underline-offset-4">
                    {formValues.sitio || "________________"}
                  </strong>
                  , Barangay Cogon Pardo, and has lived here for{" "}
                  <strong className="text-slate-800 dark:text-white font-bold underline decoration-blue-500/30 underline-offset-4">
                    {formValues.years_of_living || "____"}
                  </strong>{" "}
                  years. Issued for{" "}
                  <strong className="text-slate-800 dark:text-white font-bold underline decoration-cyan-500/30 underline-offset-4">
                    {formValues.purpose || "____________________________________"}
                  </strong>.
                </p>
              )}

              {config.backendType === "indigency" && (
                <p className="text-justify">
                  This is to certify that{" "}
                  <strong className="text-slate-800 dark:text-white font-bold underline decoration-blue-500/30 underline-offset-4">
                    {formValues.first_name || "____"}{" "}
                    {formValues.middle_name ? `${formValues.middle_name} ` : ""}
                    {formValues.last_name || "____"}
                  </strong>
                  , belonging to the{" "}
                  <strong className="text-slate-800 dark:text-white font-bold underline decoration-blue-500/30 underline-offset-4">
                    {formValues.gender || "____"}
                  </strong>{" "}
                  gender, has resided in Sitio{" "}
                  <strong className="text-slate-800 dark:text-white font-bold underline decoration-blue-500/30 underline-offset-4">
                    {formValues.sitio || "________________"}
                  </strong>{" "}
                  for{" "}
                  <strong className="text-slate-800 dark:text-white font-bold underline decoration-blue-500/30 underline-offset-4">
                    {formValues.years_of_living || "____"}
                  </strong>{" "}
                  years, and belongs to an indigent family. Issued for{" "}
                  <strong className="text-slate-800 dark:text-white font-bold underline decoration-cyan-500/30 underline-offset-4">
                    {formValues.purpose || "____________________________________"}
                  </strong>.
                </p>
              )}

              {config.backendType === "cedula" && (
                <div className="space-y-2">
                  <p>
                    Community Tax Certificate for{" "}
                    <strong>
                      {formValues.first_name} {formValues.last_name}
                    </strong>
                    .
                  </p>
                  <p>Address: {formValues.address || "________________"}</p>
                  <p>
                    Age: {formValues.age || "____"} | Birthday: {formValues.birthday || "____"}
                  </p>
                  <p>Birthplace: {formValues.birthplace || "________________"}</p>
                  <p>Annual Gross Income: PHP {formValues.income || "0.00"}</p>
                </div>
              )}

              {config.backendType === "low_income" && (
                <p className="text-justify">
                  This certifies that{" "}
                  <strong className="text-slate-800 dark:text-white font-bold underline decoration-blue-500/30 underline-offset-4">
                    {formValues.first_name || "____"}{" "}
                    {formValues.middle_name ? `${formValues.middle_name} ` : ""}
                    {formValues.last_name || "____"}
                  </strong>{" "}
                  resides in Sitio {formValues.sitio || "________________"}, working as a{" "}
                  <strong>{formValues.work || "________________"}</strong> with a monthly income of PHP{" "}
                  <strong>{formValues.monthly_income || "0.00"}</strong>, classifying as low-income. Issued for{" "}
                  <strong className="text-slate-800 dark:text-white font-bold underline decoration-cyan-500/30 underline-offset-4">
                    {formValues.purpose || "____________________"}
                  </strong>.
                </p>
              )}

              {config.backendType === "no_income" && (
                <p className="text-justify">
                  This certifies that{" "}
                  <strong className="text-slate-800 dark:text-white font-bold underline decoration-blue-500/30 underline-offset-4">
                    {formValues.first_name || "____"}{" "}
                    {formValues.middle_name ? `${formValues.middle_name} ` : ""}
                    {formValues.last_name || "____"}
                  </strong>
                  , residing at {formValues.address || "________________"}, has no source of income. Issued for{" "}
                  <strong className="text-slate-800 dark:text-white font-bold underline decoration-cyan-500/30 underline-offset-4">
                    {formValues.purpose || "____________________"}
                  </strong>.
                </p>
              )}

              {config.backendType === "business_permit" && (
                <div className="space-y-2">
                  <p>
                    Clearance to operate <strong>{formValues.business_name || "________________"}</strong> (
                    {formValues.business_type || "Type"}).
                  </p>
                  <p>Business Address: {formValues.business_address || "________________"}</p>
                  <p>
                    Capital: PHP {formValues.capital || "0.00"} | Gross Income: PHP{" "}
                    {formValues.gross_income || "0.00"}
                  </p>
                  <p>Applicant: {formValues.first_name} {formValues.last_name} ({formValues.new_renewal})</p>
                </div>
              )}

              {config.backendType === "identification" && (
                <p className="text-justify">
                  Barangay Identification Certificate issued to{" "}
                  <strong>
                    {formValues.first_name} {formValues.last_name}
                  </strong>{" "}
                  residing at Sitio {formValues.sitio || "________________"}. Age: {formValues.age || "____"},
                  Birthday: {formValues.birthday || "____"}.
                </p>
              )}

              {config.backendType === "attestation" && (
                <p className="text-justify">
                  This certifies that{" "}
                  <strong>
                    {formValues.first_name} {formValues.last_name}
                  </strong>{" "}
                  resides in Sitio {formValues.sitio || "____"}, is {formValues.age || "____"} years of age, works as{" "}
                  <strong>{formValues.work || "____"}</strong> with a monthly income of PHP{" "}
                  <strong>{formValues.monthly_income || "0.00"}</strong>. Attested for the purpose of{" "}
                  <strong>{formValues.purpose || "____"}</strong>.
                </p>
              )}

              {config.backendType === "jail_entrance" && (
                <p className="text-justify">
                  This certifies that{" "}
                  <strong>
                    {formValues.first_name} {formValues.last_name}
                  </strong>{" "}
                  resides in Sitio {formValues.sitio || "____"}, is {formValues.age || "____"} years of age, and is the{" "}
                  <strong>{formValues.relationship_to_prisoner || "____"}</strong> of prisoner{" "}
                  <strong>{formValues.prisoner_name || "____"}</strong> (Age: {formValues.prisoner_age || "____"}),
                  currently housed at <strong>{formValues.jail_address || "____"}</strong>.
                </p>
              )}

              {config.backendType === "solo_parent" && (
                <p className="text-justify">
                  This certifies that{" "}
                  <strong>
                    {formValues.first_name} {formValues.last_name}
                  </strong>{" "}
                  resides in Sitio {formValues.sitio || "____"}, and is recognized as a Solo Parent supporting{" "}
                  <strong>{formValues.number_of_children || "____"}</strong> children. Issued for{" "}
                  <strong>{formValues.purpose || "____"}</strong>.
                </p>
              )}

              <p className="text-justify">
                Given this <strong>{dayOrdinal}</strong> day of <strong>{todayFormatted.split(" ")[0]}</strong>,{" "}
                <strong>{new Date().getFullYear()}</strong> at Barangay Cogon Pardo, Cebu City, Philippines.
              </p>
            </div>

            {/* Document Footer Signatures */}
            <div className="flex justify-end pt-8">
              <div className="text-center w-48 space-y-1">
                <div className="h-0.5 bg-slate-900/10 dark:bg-white/10 w-full mb-1" />
                <p className="text-xs font-extrabold text-slate-800 dark:text-white leading-none">
                  HON. COGON PARDO CAPTAIN
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Barangay Captain
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
