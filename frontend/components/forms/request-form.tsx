"use client";

import { useState } from "react";
import { InputField, SelectField, TextareaField } from "./form-fields";
import { Loader2 } from "lucide-react";
import { useRequests } from "@/hooks/use-requests";

const CERT_TYPES = [
  { value: "barangay_clearance", label: "Barangay Clearance" },
  { value: "residency", label: "Certificate of Residency" },
  { value: "indigency", label: "Certificate of Indigency" },
  { value: "business_permit", label: "Business Permit" },
  { value: "cedula", label: "Cedula" },
  { value: "low_income", label: "Certificate of Low Income" },
  { value: "no_income", label: "Certificate of No Income" },
  { value: "identification", label: "Certificate of Identification" },
];

interface RequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function RequestForm({ onSuccess, onCancel }: RequestFormProps) {
  const { createRequest } = useRequests();
  const [form, setForm] = useState({
    certificate_type: "",
    purpose: "",
    notes: "",
    resident: "",
  });

  const update = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRequest.mutateAsync(form);
      onSuccess?.();
    } catch {
      // handled by react-query
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SelectField
        label="Certificate Type"
        value={form.certificate_type}
        onChange={(e) => update("certificate_type", e.target.value)}
        options={CERT_TYPES}
        placeholder="Select certificate type"
        required
      />
      <InputField
        label="Purpose"
        value={form.purpose}
        onChange={(e) => update("purpose", e.target.value)}
        placeholder="Specify purpose of request"
        required
      />
      <TextareaField
        label="Notes (optional)"
        value={form.notes}
        onChange={(e) => update("notes", e.target.value)}
        placeholder="Specify any additional information"
        rows={3}
      />
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={createRequest.isPending}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {createRequest.isPending && <Loader2 size={14} className="animate-spin" />}
          Submit Request
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
