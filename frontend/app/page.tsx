"use client";

import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  FileText,
  Clock,
  CheckCircle2,
  Users,
  Shield,
  Award,
  Building,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Smartphone,
  ChevronRight
} from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Simulated Metrics for visual premium SaaS experience
  const metrics = [
    { label: "Total Requests Fulfilled", value: "14,820+", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
    { label: "Avg. Processing Time", value: "12 Mins", icon: Clock, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
    { label: "Registered Residents", value: "8,940+", icon: Users, color: "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/20" },
    { label: "Satisfaction Rate", value: "99.8%", icon: Award, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
  ];

  // Primary Certificate Offerings
  const services = [
    {
      title: "Barangay Clearance",
      description: "Official clearance document required for employment, postal ID, and general transactions.",
      time: "5-10 mins",
      badge: "Most Requested",
      icon: Shield,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Certificate of Residency",
      description: "Certifies that you are a bonafide resident of Barangay Cogon Pardo with stated duration.",
      time: "5 mins",
      badge: "Instant Approval",
      icon: MapPin,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Certificate of Indigency",
      description: "Required for acquiring medical assistance, social service support, and school scholarship grants.",
      time: "5-10 mins",
      badge: "Free of Charge",
      icon: Award,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Business Permit Clearance",
      description: "Required for commercial ventures and stores establishing operations inside the barangay limits.",
      time: "15 mins",
      badge: "Business Essential",
      icon: Building,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {/* ── Header / Navigation ─────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-white/20 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl flex items-center justify-center">
              <Image
                src="/favicon.png"
                alt="Cogon-Pardo Logo"
                width={32}
                height={32}
                className="rounded-lg object-cover"
              />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Cogon-Pardo <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Portal</span>
            </span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#services" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition dark:text-slate-400 dark:hover:text-cyan-400">Services</a>
            <a href="#metrics" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition dark:text-slate-400 dark:hover:text-cyan-400">Statistics</a>
            <a href="#about" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition dark:text-slate-400 dark:hover:text-cyan-400">About</a>
            <Link href="/careers" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition dark:text-slate-400 dark:hover:text-cyan-400">Careers</Link>
          </nav>

          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
            ) : isAuthenticated && user ? (
              <Link
                href={
                  user.role === "admin" ? "/admin" : user.role === "staff" ? "/staff" : "/resident/dashboard"
                }
                className="group flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-white px-4 py-2 text-xs font-bold text-white dark:text-slate-950 shadow-sm transition hover:scale-[1.02] hover:bg-blue-600 dark:hover:bg-cyan-100"
              >
                Go to Dashboard
                <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/10 transition hover:scale-[1.02] hover:bg-blue-700 active:scale-[0.98]"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="relative px-6 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">

            {/* Left Content Column */}
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-blue-50/50 px-3.5 py-1.5 text-xs font-semibold text-blue-600 backdrop-blur-md dark:border-blue-800/30 dark:bg-blue-950/20 dark:text-blue-400">
                <Sparkles size={12} className="animate-spin duration-1000" />
                Next-Gen Civic Services
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                Empowering Cogon Pardo with <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  Instant Civic Access
                </span>
              </h1>

              <p className="text-base text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed sm:text-lg">
                Request certificates, track applications in real-time, and access barangay services from any device. Built for transparency, speed, and community trust.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href={isAuthenticated ? "/resident/dashboard" : "/auth/register"}
                  className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-6 text-sm font-semibold text-white dark:text-slate-950 shadow-lg shadow-slate-950/10 hover:bg-blue-600 dark:hover:bg-cyan-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Apply for Certificate
                  <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                </Link>

                <a
                  href="#services"
                  className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white/50 backdrop-blur-md px-6 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                >
                  View Requirements
                </a>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-200/50 dark:border-slate-800/30 max-w-md">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 shadow-sm">JD</div>
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-cyan-100 flex items-center justify-center text-[10px] font-bold text-cyan-600 shadow-sm">MA</div>
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-600 shadow-sm">CR</div>
                </div>
                <div className="text-xs text-slate-400">
                  Trusted by over <strong className="text-slate-600 dark:text-slate-300">8,000+ residents</strong> for daily requests
                </div>
              </div>
            </div>

            {/* Right Visual Dashboard Mockup Column */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 blur-3xl opacity-60 rounded-full" />

              {/* Glassmorphic Mockup Container */}
              <div className="relative glass-panel rounded-3xl p-6 shadow-2xl border border-white/50 dark:border-white/5 shadow-blue-500/5 scale-100 animate-glow-pulse">

                {/* Floating Widget 1 */}
                <div className="absolute -left-10 top-12 glass-card p-3 shadow-lg flex items-center gap-3 animate-bounce duration-7000 max-w-[190px]">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Clearance Status</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Ready for Pickup</p>
                  </div>
                </div>

                {/* Main Mockup Screen */}
                <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 p-4 border border-slate-100 dark:border-slate-800 shadow-inner">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-400" />
                      <div className="h-2 w-2 rounded-full bg-yellow-400" />
                      <div className="h-2 w-2 rounded-full bg-green-400" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">cogonpardo.portal/dashboard</span>
                  </div>

                  <div className="pt-4 space-y-4">
                    <div className="h-8 w-2/3 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />

                    {/* Mock Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-900/50">
                        <span className="text-[9px] text-slate-400 block">Queue Status</span>
                        <span className="text-sm font-bold text-blue-600">Active Queue</span>
                      </div>
                      <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-900/50">
                        <span className="text-[9px] text-slate-400 block">Service Load</span>
                        <span className="text-sm font-bold text-emerald-500">Low (Fast-Track)</span>
                      </div>
                    </div>

                    {/* Progress Timeline in Mock */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                        <span>Application</span>
                        <span>Verification</span>
                        <span>Release</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Widget 2 */}
                <div className="absolute -right-8 bottom-12 glass-card p-3 shadow-lg flex items-center gap-3 animate-pulse duration 7000 max-w-[180px]">
                  <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-sm">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Residency Request</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">5 Mins Process</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats Strip Section ─────────────────────────────────── */}
      <section id="metrics" className="px-6 py-12 relative border-y border-slate-200/40 bg-white/20 dark:bg-slate-950/20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="glass-card glass-card-hover p-5 flex items-center gap-4"
              >
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${metric.color}`}>
                  <metric.icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{metric.value}</p>
                  <p className="text-xs text-slate-400 font-medium">{metric.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Section ────────────────────────────────────── */}
      <section id="services" className="px-6 py-20 lg:py-28 relative">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Service Offerings</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Modern Civic Documents, Accelerated
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm">
              Standardized certificate issuance with zero administrative delays. Apply in minutes and receive instant status alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="group relative overflow-hidden glass-card glass-card-hover p-6 flex flex-col justify-between h-[280px]"
              >
                <div className="space-y-4">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-sm`}>
                    <service.icon size={18} />
                  </div>
                  <div>
                    <span className="inline-block rounded-md bg-blue-50/70 dark:bg-slate-900/60 border border-blue-100/30 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider mb-2">
                      {service.badge}
                    </span>
                    <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">{service.title}</h3>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-3">{service.description}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100/40 dark:border-slate-800/30 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Release: <strong className="text-slate-600 dark:text-slate-300 font-semibold">{service.time}</strong></span>
                  <Link
                    href={isAuthenticated ? "/resident/dashboard" : "/auth/register"}
                    className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                  >
                    Apply <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Highlight / About Section ────────────────────── */}
      <section id="about" className="px-6 py-20 bg-slate-900 text-white rounded-[2rem] mx-6 my-10 relative overflow-hidden">
        {/* Subtle grid in background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">

            {/* Video or dynamic visual showcase of mobile responsiveness */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-[280px] h-[520px] rounded-[2.5rem] border-8 border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
                {/* Speaker */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-slate-800 z-20" />
                {/* Mobile UI Preview */}
                <div className="h-full w-full p-4 pt-10 flex flex-col justify-between bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-bold">Barangay Cogon Pardo</span>
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    </div>

                    <div className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-2">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Recent Request</span>
                      <span className="text-xs font-bold text-white block">Certificate of Residency</span>
                      <span className="inline-block rounded-md bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[8px] font-bold text-emerald-400">
                        Released
                      </span>
                    </div>

                    {/* Timeline vertical style in mobile */}
                    <div className="space-y-3 pt-3 pl-2 border-l border-slate-800">
                      <div className="relative pl-4 text-[10px]">
                        <div className="absolute left-[-11px] top-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
                        <span className="font-semibold text-white block">Submitted</span>
                        <span className="text-slate-500">Today, 2:10 PM</span>
                      </div>
                      <div className="relative pl-4 text-[10px]">
                        <div className="absolute left-[-11px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                        <span className="font-semibold text-white block">Approved & Signed</span>
                        <span className="text-slate-500">Today, 2:15 PM</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-blue-600 py-2.5 text-center text-xs font-bold text-white shadow-lg">
                    Check Portal Status
                  </div>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Mobile-First Engineering</span>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                Request on the Go. Track in Real Time.
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                The Cogon Pardo Portal is engineered to run seamlessly across all smartphones, tablets, and desktop computers. Check request statuses while walking, upload document requirements with a phone camera, and receive automatic release notifications.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-cyan-950 border border-cyan-800/30 flex items-center justify-center text-cyan-400">
                    <Smartphone size={16} />
                  </div>
                  <h4 className="text-sm font-bold text-white">Fully Optimized UI</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Designed for modern mobile browsers with tap-friendly controls and responsive fluid layouts.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-950 border border-blue-800/30 flex items-center justify-center text-blue-400">
                    <Layers size={16} />
                  </div>
                  <h4 className="text-sm font-bold text-white">Encrypted Validation</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Every generated certificate features a cryptographic QR token for instant validation by agencies.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Careers Call to Action ──────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-20 bg-slate-950 text-white border-t border-slate-900">
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_45%)]" />

        <div className="mx-auto max-w-4xl relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400 backdrop-blur-md uppercase tracking-wider">
            <Users size={12} className="shrink-0" />
            We Are Hiring
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Empower Cogon Pardo Through Public Service
          </h2>

          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Are you passionate about community growth, civic-tech, and public administration? Join our barangay office as a staff member. Apply today!
          </p>

          <div className="pt-4">
            <Link
              href="/careers"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-slate-950 shadow-xl shadow-slate-950/20 hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Explore Staff Vacancies
              <ArrowRight size={16} className="text-slate-950" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-slate-200/40 bg-white/40 dark:border-slate-800/30 dark:bg-slate-950/40 py-12 px-6 backdrop-blur-md">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white block">
              Barangay Cogon-Pardo Portal
            </span>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              A modern municipal portal empowering citizens and accelerating municipal document processing with bleeding-edge technology.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider block">Office Address</span>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <MapPin size={12} className="shrink-0" />
              Barangay Hall, Cogon Pardo, Cebu City, Philippines
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar size={12} className="shrink-0" />
              Office Hours: Monday - Friday, 8:00 AM - 5:00 PM
            </span>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider block">Citizen Gateway</span>
            <div className="flex gap-4">
              <Link href="/auth/login" className="text-xs text-slate-400 hover:text-blue-600 transition">Sign In</Link>
              <Link href="/auth/register" className="text-xs text-slate-400 hover:text-blue-600 transition">Create Account</Link>
            </div>
            <p className="text-[10px] text-slate-400">
              © {new Date().getFullYear()} Barangay Cogon Pardo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
