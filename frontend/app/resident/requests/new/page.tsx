"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import Link from "next/link";
import { 
  ArrowLeft, 
  FileText, 
  Briefcase, 
  Home, 
  Shield, 
  Users, 
  ArrowRight, 
  Sparkles, 
  HeartHandshake, 
  Coins, 
  FileSignature, 
  CreditCard, 
  Lock, 
  Heart 
} from "lucide-react";

const SERVICES = [
  {
    id: "barangay-clearance",
    title: "Barangay Clearance",
    description: "Request a clearance for employment, business, or legal purposes.",
    icon: Shield,
    color: "from-blue-500 to-indigo-500",
    shadow: "shadow-blue-500/25",
    bgLight: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    id: "residency",
    title: "Certificate of Residency",
    description: "Proof of residence within the barangay jurisdiction.",
    icon: Home,
    color: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/25",
    bgLight: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "indigency",
    title: "Certificate of Indigency",
    description: "For medical, educational, or financial assistance applications.",
    icon: HeartHandshake,
    color: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/25",
    bgLight: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    id: "cedula",
    title: "Cedula",
    description: "Community Tax Certificate for legal transactions and identifications.",
    icon: FileText,
    color: "from-rose-500 to-red-500",
    shadow: "shadow-rose-500/25",
    bgLight: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    id: "low-income",
    title: "Certificate of Low Income",
    description: "Request a certificate proving low income status.",
    icon: Coins,
    color: "from-cyan-500 to-blue-500",
    shadow: "shadow-cyan-500/25",
    bgLight: "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
  {
    id: "no-income",
    title: "Certificate of No Income",
    description: "Request a certificate proving no income status.",
    icon: Coins,
    color: "from-teal-500 to-emerald-500",
    shadow: "shadow-teal-500/25",
    bgLight: "bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
  {
    id: "business-permit",
    title: "Business Permit",
    description: "Barangay clearance to operate a business.",
    icon: Briefcase,
    color: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/25",
    bgLight: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    id: "identification",
    title: "Barangay Identification",
    description: "Request a Barangay Identification certificate.",
    icon: CreditCard,
    color: "from-indigo-500 to-purple-500",
    shadow: "shadow-indigo-500/25",
    bgLight: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "attestation",
    title: "Attestation",
    description: "Request an attestation certificate.",
    icon: FileSignature,
    color: "from-fuchsia-500 to-rose-500",
    shadow: "shadow-fuchsia-500/25",
    bgLight: "bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
  },
  {
    id: "jail-entrance",
    title: "Jail Entrance Certificate",
    description: "Request a certificate for jail entrance visitation.",
    icon: Lock,
    color: "from-slate-600 to-slate-800",
    shadow: "shadow-slate-600/25",
    bgLight: "bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-300",
  },
  {
    id: "solo-parent",
    title: "Solo Parent Certificate",
    description: "Request a Solo Parent Certificate.",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    shadow: "shadow-pink-500/25",
    bgLight: "bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
];


export default function NewRequestMenu() {
  return (
    <DashboardLayout allowedRoles={["resident"]}>
      <div className="relative mb-10 flex flex-col gap-4">
        {/* Ambient Background Accents */}
        <div className="absolute -top-10 left-10 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl pointer-events-none dark:bg-blue-500/10" />
        <div className="absolute top-0 right-20 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl pointer-events-none dark:bg-purple-500/10" />
        
        <div>
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-blue-200/40 bg-blue-50/50 px-3 py-1 text-xs font-bold text-blue-600 backdrop-blur-md dark:border-blue-800/30 dark:bg-blue-950/20 dark:text-cyan-400">
            <Sparkles size={12} className="animate-pulse" />
            Application Hub
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/resident/requests"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200/60 bg-white/50 text-slate-500 backdrop-blur-md transition-all hover:bg-white hover:shadow-sm hover:text-slate-900 active:scale-95 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Select Service
              </h1>
              <p className="mt-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                Choose the type of certificate or assistance you need to file
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES.map((service) => (
          <Link
            key={service.id}
            href={`/resident/requests/new/${service.id}`}
            className="group relative flex flex-col h-full overflow-hidden rounded-[24px] border border-slate-200/50 bg-white/70 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800/50 dark:bg-slate-900/50"
          >
            {/* Background Gradient Accent on Hover */}
            <div className={`absolute -inset-0.5 bg-gradient-to-br ${service.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5 blur-xl`} />
            
            <div className="relative flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} shadow-lg ${service.shadow} transition-transform duration-300 group-hover:scale-110`}>
                  <service.icon size={24} className="text-white" />
                </div>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${service.bgLight} transition-all duration-300 group-hover:translate-x-1 group-hover:shadow-sm`}>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">{service.title}</h3>
              <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400 flex-1">
                {service.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
