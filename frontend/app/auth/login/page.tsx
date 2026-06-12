"use client";

import { Suspense, useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

function LoginForm() {
  const { login, user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-redirect logged-in users away from the login screen
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      switch (user.role) {
        case "admin":
          router.replace("/admin");
          break;
        case "staff":
          router.replace("/staff");
          break;
        case "resident":
        default:
          router.replace("/resident/dashboard");
          break;
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">Welcome back</h2>
        <p className="text-sm text-slate-400">Sign in to your account to continue</p>
      </div>

      {justRegistered && (
        <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700">
          Registration successful! Please sign in.
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email address"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#0F172A] placeholder:text-slate-300 outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-11 text-sm text-[#0F172A] placeholder:text-slate-300 outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
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
              Sign in
              <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-semibold text-[#3B82F6] hover:text-[#0066FF] transition">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* ── Left: Branding panel ──────────────────────────────────── */}
      <div className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-[#0066FF] via-[#3B82F6] to-[#0066FF] lg:flex">
        <div className="max-w-md space-y-6 px-12">
          <Image src="/favicon.png" alt="Cogon-Pardo Logo" width={56} height={56} className="rounded-2xl object-cover shadow-lg shadow-blue-900/30" />
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Barangay
            <br />
            Cogon-Pardo
            <br />
            <span className="text-blue-100/70">Portal</span>
          </h1>
          <p className="text-sm leading-relaxed text-blue-100/80">
            Request certificates, track your applications, and access barangay services — all in one place.
          </p>
        </div>
      </div>

      {/* ── Right: Login form ─────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center bg-white px-6">
        <Suspense fallback={<div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-200 border-t-[#3B82F6]" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
