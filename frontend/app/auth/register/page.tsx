"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ArrowRight, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    sitio: "",
    password: "",
    password_confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (form.password !== form.password_confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(form);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: Record<string, string[] | string> };
      };
      const data = axiosErr.response?.data;

      if (data && typeof data === "object") {
        // Collect field-level errors from DRF validation
        const errors: Record<string, string[]> = {};
        const generalErrors: string[] = [];

        for (const [key, value] of Object.entries(data)) {
          const messages = Array.isArray(value) ? value : [String(value)];
          if (key === "non_field_errors" || key === "detail") {
            generalErrors.push(...messages);
          } else {
            errors[key] = messages;
          }
        }

        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          // Also set the first error as the general message
          const firstField = Object.keys(errors)[0];
          const label = firstField.replace(/_/g, " ");
          setError(`${label}: ${errors[firstField][0]}`);
        } else if (generalErrors.length > 0) {
          setError(generalErrors[0]);
        } else {
          setError("Registration failed. Please check your details.");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (field: string) =>
    fieldErrors[field]?.[0] || null;

  return (
    <div className="flex min-h-screen">
      {/* ── Left: Branding panel ──────────────────────────────────── */}
      <div className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-[#0066FF] via-[#3B82F6] to-[#0066FF] lg:flex">
        <div className="max-w-md space-y-6 px-12">
          <Image src="/favicon.png" alt="Cogon-Pardo Logo" width={56} height={56} className="rounded-2xl object-cover shadow-lg shadow-blue-900/30" />
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Join the
            <br />
            Cogon-Pardo
            <br />
            <span className="text-blue-100/70">Community</span>
          </h1>
          <p className="text-sm leading-relaxed text-blue-100/80">
            Create your account to access digital barangay services. Request certificates,
            track applications, and stay updated.
          </p>
        </div>
      </div>

      {/* ── Right: Register form ──────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Back to Home Inline Link */}
          <div className="mb-6">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 transition"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
              Back to home
            </Link>
          </div>

          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Image src="/favicon.png" alt="Cogon-Pardo Logo" width={36} height={36} className="rounded-xl object-cover" />
            <span className="text-base font-semibold text-[#0F172A]">Cogon-Pardo Portal</span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">Create account</h2>
            <p className="text-sm text-slate-400">Fill in your details to get started</p>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  First Name
                </label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(e) => updateField("first_name", e.target.value)}
                  required
                  placeholder="First name"
                  className={`h-11 w-full rounded-xl border bg-white px-4 text-sm text-[#0F172A] placeholder:text-slate-300 outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 ${fieldError("first_name") ? "border-red-300" : "border-slate-200"}`}
                />
                {fieldError("first_name") && (
                  <p className="text-xs text-red-500">{fieldError("first_name")}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Last Name
                </label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(e) => updateField("last_name", e.target.value)}
                  required
                  placeholder="Last name"
                  className={`h-11 w-full rounded-xl border bg-white px-4 text-sm text-[#0F172A] placeholder:text-slate-300 outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 ${fieldError("last_name") ? "border-red-300" : "border-slate-200"}`}
                />
                {fieldError("last_name") && (
                  <p className="text-xs text-red-500">{fieldError("last_name")}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
                placeholder="Email address"
                className={`h-11 w-full rounded-xl border bg-white px-4 text-sm text-[#0F172A] placeholder:text-slate-300 outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 ${fieldError("email") ? "border-red-300" : "border-slate-200"}`}
              />
              {fieldError("email") && (
                <p className="text-xs text-red-500">{fieldError("email")}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone_number}
                onChange={(e) => updateField("phone_number", e.target.value)}
                placeholder="Contact number"
                className={`h-11 w-full rounded-xl border bg-white px-4 text-sm text-[#0F172A] placeholder:text-slate-300 outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 ${fieldError("phone_number") ? "border-red-300" : "border-slate-200"}`}
              />
              {fieldError("phone_number") && (
                <p className="text-xs text-red-500">{fieldError("phone_number")}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Purok / Sitio
              </label>
              <select
                value={form.sitio}
                onChange={(e) => updateField("sitio", e.target.value)}
                required
                className={`h-11 w-full rounded-xl border bg-white px-4 text-sm text-[#0F172A] outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 ${fieldError("sitio") ? "border-red-300" : "border-slate-200"}`}
              >
                <option value="" disabled>Select your Sitio</option>
                <option value="All Season 1">All Season 1</option>
                <option value="All Season 2">All Season 2</option>
                <option value="All Season 3">All Season 3</option>
                <option value="Caimito">Caimito</option>
                <option value="Elma">Elma</option>
                <option value="Laguna 1">Laguna 1</option>
                <option value="Laguna 2">Laguna 2</option>
                <option value="Little Hawaii">Little Hawaii</option>
                <option value="Lourdes Extension">Lourdes Extension</option>
                <option value="Lourdes Proper">Lourdes Proper</option>
              </select>
              {fieldError("sitio") && (
                <p className="text-xs text-red-500">{fieldError("sitio")}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  required
                  minLength={8}
                  placeholder="Password"
                  className={`h-11 w-full rounded-xl border bg-white px-4 pr-11 text-sm text-[#0F172A] placeholder:text-slate-300 outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 ${fieldError("password") ? "border-red-300" : "border-slate-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldError("password") && (
                <p className="text-xs text-red-500">{fieldError("password")}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.password_confirm}
                onChange={(e) => updateField("password_confirm", e.target.value)}
                required
                placeholder="Confirm password"
                className={`h-11 w-full rounded-xl border bg-white px-4 text-sm text-[#0F172A] placeholder:text-slate-300 outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 ${fieldError("password_confirm") ? "border-red-300" : "border-slate-200"}`}
              />
              {fieldError("password_confirm") && (
                <p className="text-xs text-red-500">{fieldError("password_confirm")}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] text-sm font-semibold text-white transition hover:bg-[#0066FF] active:scale-[0.98] disabled:opacity-50 shadow-md shadow-blue-500/20"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-[#3B82F6] hover:text-[#0066FF] transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
