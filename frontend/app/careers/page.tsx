"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  BookOpen,
  ShieldAlert,
  UploadCloud,
  CheckSquare,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  Search,
  CheckCircle2,
  FileText,
  Clock,
  Briefcase,
  AlertCircle,
  RotateCcw,
  Trash2
} from "lucide-react";
import api from "@/lib/api";
import { SkeletonPulse } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";

type Step = 1 | 2 | 3 | 4 | 5;

export default function CareersPage() {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"apply" | "track">("apply");
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // ── Form States ────────────────────────────────────────────────
  const [personal, setPersonal] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    sitio: "",
  });

  const [education, setEducation] = useState({
    highest_education: "college_graduate",
    school_institution: "",
    year_graduated: "",
  });

  const [background, setBackground] = useState({
    has_criminal_record: false,
    background_details: "",
  });

  const [files, setFiles] = useState<{
    resume: File | null;
    nbi_clearance: File | null;
    police_clearance: File | null;
    government_id: File | null;
  }>({
    resume: null,
    nbi_clearance: null,
    police_clearance: null,
    government_id: null,
  });

  const [consent, setConsent] = useState(false);

  // Pre-fill if user is logged in and there is no draft restored
  useEffect(() => {
    if (authUser) {
      setPersonal((prev) => {
        // Only pre-fill if the fields are currently empty
        return {
          ...prev,
          first_name: prev.first_name || authUser.first_name || "",
          last_name: prev.last_name || authUser.last_name || "",
          email: prev.email || authUser.email || "",
          phone_number: prev.phone_number || authUser.phone_number || "",
        };
      });
    }
  }, [authUser]);

  // ── UI States ──────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // ── Tracker States ─────────────────────────────────────────────
  const [trackId, setTrackId] = useState("");
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");

  // ── Local Logged In Applications ──────────────────────────────
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [myAppsLoading, setMyAppsLoading] = useState(false);

  useEffect(() => {
    if (authUser) {
      setMyAppsLoading(true);
      api.get("/applicants/status/")
        .then(({ data }) => setMyApplications(data.results ?? data))
        .catch(() => { })
        .finally(() => setMyAppsLoading(false));
    }
  }, [authUser, successId]);

  // ── Drafts Auto-Saving States & Helpers ──────────────────────────
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [isDraftInitialized, setIsDraftInitialized] = useState(false);

  // Check for existing draft on mount
  useEffect(() => {
    const rawDraft = localStorage.getItem("cogon_pardo_careers_draft");
    if (rawDraft) {
      try {
        const parsed = JSON.parse(rawDraft);
        if (
          parsed.personal?.first_name ||
          parsed.personal?.last_name ||
          parsed.personal?.email ||
          parsed.education?.school_institution
        ) {
          setShowDraftPrompt(true);
        }
      } catch (e) {
        // invalid draft
      }
    }
    setIsDraftInitialized(true);
  }, []);

  // Save draft whenever changes are made
  useEffect(() => {
    if (isDraftInitialized && activeTab === "apply" && !successId) {
      const draft = { personal, education, background };
      localStorage.setItem("cogon_pardo_careers_draft", JSON.stringify(draft));
    }
  }, [personal, education, background, activeTab, successId, isDraftInitialized]);

  const restoreDraft = () => {
    const rawDraft = localStorage.getItem("cogon_pardo_careers_draft");
    if (rawDraft) {
      try {
        const parsed = JSON.parse(rawDraft);
        if (parsed.personal) setPersonal(parsed.personal);
        if (parsed.education) setEducation(parsed.education);
        if (parsed.background) setBackground(parsed.background);
      } catch (e) {
        // error parsing draft
      }
    }
    setShowDraftPrompt(false);
  };

  const clearDraft = () => {
    localStorage.removeItem("cogon_pardo_careers_draft");
    setShowDraftPrompt(false);
  };

  // ── Multi-Step Validations ─────────────────────────────────────
  const canGoNext = () => {
    if (currentStep === 1) {
      return (
        personal.first_name &&
        personal.last_name &&
        personal.email &&
        personal.phone_number &&
        personal.sitio
      );
    }
    if (currentStep === 2) {
      return education.school_institution && education.year_graduated;
    }
    if (currentStep === 3) {
      return true; // details are optional
    }
    if (currentStep === 4) {
      return files.resume !== null; // Resume is mandatory
    }
    if (currentStep === 5) {
      return consent;
    }
    return false;
  };

  const handleNext = () => {
    if (canGoNext() && currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  // ── File Helpers ────────────────────────────────────────────────
  const handleFileChange = (type: keyof typeof files, file: File | null) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  // ── Submit Logic ───────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!canGoNext()) return;
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Submit Application details
      const payload = {
        first_name: personal.first_name,
        last_name: personal.last_name,
        email: personal.email,
        phone_number: personal.phone_number,
        sitio: personal.sitio,
        highest_education: education.highest_education,
        school_institution: education.school_institution,
        year_graduated: parseInt(education.year_graduated) || 0,
        has_criminal_record: background.has_criminal_record,
        background_details: background.background_details,
        consent_checkbox: consent,
      };

      const { data: appData } = await api.post("/applicants/apply/", payload);
      const appUuid = appData.id;

      // 2. Upload attachments sequentially
      const uploadPromises = [];
      for (const [key, file] of Object.entries(files)) {
        if (file) {
          const fd = new FormData();
          fd.append("applicant_id", appUuid);
          fd.append("document_type", key);
          fd.append("file", file);
          uploadPromises.push(api.post("/applicants/upload-document/", fd));
        }
      }

      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }

      // Successful submittal clears draft
      localStorage.removeItem("cogon_pardo_careers_draft");
      setSuccessId(appUuid);
    } catch (err: any) {
      const details = err.response?.data;
      if (details && typeof details === "object") {
        const firstErr = Object.values(details)[0];
        setErrorMsg(Array.isArray(firstErr) ? firstErr[0] : String(firstErr));
      } else {
        setErrorMsg("Failed to submit application. Please check details.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Track Logic ────────────────────────────────────────────────
  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId) return;
    setTrackLoading(true);
    setTrackError("");
    setTrackingResult(null);

    try {
      const { data } = await api.get(`/applicants/${trackId}/`);
      setTrackingResult(data);
    } catch {
      setTrackError("Application ID not found. Please review the ID.");
    } finally {
      setTrackLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-200/50";
      case "interview_scheduled":
        return "text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-200/50";
      case "approved":
        return "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50";
      case "rejected":
        return "text-rose-500 bg-rose-50 dark:bg-rose-950/20 border-rose-200/50";
      case "hired":
        return "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200/50";
      default:
        return "text-slate-400 bg-slate-50 border-slate-200";
    }
  };

  const progressPercent = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      {/* ── Navbar header ─────────────────────────────────────────── */}
      <header className="border-b border-slate-100 dark:border-slate-900 bg-white/70 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/favicon.png" alt="Cogon Pardo Logo" width={32} height={32} className="rounded-xl object-cover" />
            <span className="text-sm font-extrabold uppercase tracking-wider">Cogon-Pardo Portal</span>
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 transition">
              Back to Home
            </Link>
            <Link href="/auth/login" className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-4 py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm transition hover:scale-[1.02] hover:bg-blue-600 dark:hover:bg-cyan-100 active:scale-[0.98]">
              Citizen Login
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main content area ─────────────────────────────────────── */}
      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-12">
        {/* Title panel */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/40 bg-blue-50/50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-blue-600 backdrop-blur-md dark:border-blue-800/30 dark:bg-blue-950/20 dark:text-cyan-400">
            <Sparkles size={12} className="animate-pulse" />
            Join Our Staff
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Careers & Recruitment Portal</h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Apply as a barangay administrator, officer, or service staff member. Empower Cogon-Pardo through public service.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center border-b border-slate-200 dark:border-slate-800/80 mb-10">
          <button
            onClick={() => setActiveTab("apply")}
            className={`px-6 py-3.5 text-xs font-bold uppercase tracking-widest border-b-2 transition ${activeTab === "apply" ? "border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-600"}`}
          >
            Submit Application
          </button>
          <button
            onClick={() => {
              setActiveTab("track");
              setShowDraftPrompt(false);
            }}
            className={`px-6 py-3.5 text-xs font-bold uppercase tracking-widest border-b-2 transition ${activeTab === "track" ? "border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-600"}`}
          >
            Track Progress
          </button>
        </div>

        {/* Draft Restoration Prompt Banner */}
        {activeTab === "apply" && showDraftPrompt && (
          <div className="mb-6 max-w-2xl mx-auto rounded-2xl border border-blue-100 bg-blue-50/40 p-4 shadow-sm animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-800">Incomplete Form Draft Detected</p>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">We found a previously saved application form draft. Would you like to restore your progress?</p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={restoreDraft}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 hover:bg-blue-700 transition"
              >
                <RotateCcw size={10} />
                Restore
              </button>
              <button
                onClick={clearDraft}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 hover:bg-slate-50 transition"
              >
                <Trash2 size={10} />
                Clear
              </button>
            </div>
          </div>
        )}

        {activeTab === "apply" ? (
          successId ? (
            /* Success confirmation overlay */
            <div className="glass-card p-10 text-center space-y-6 max-w-xl mx-auto border-emerald-500/20 shadow-xl shadow-emerald-950/5 animate-fade-in">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-500 mb-4 animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Application Received!</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Thank you for applying. Your profile is saved inside the hiring pipeline system. Please record your Application ID below to track reviews.
              </p>
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Application Reference ID</p>
                <p className="text-md font-mono font-bold text-blue-600 dark:text-cyan-400 select-all mt-1">{successId}</p>
              </div>
              <div className="pt-4 flex justify-center gap-4">
                <button
                  onClick={() => {
                    setSuccessId(null);
                    setCurrentStep(1);
                    setPersonal({ first_name: "", last_name: "", email: "", phone_number: "", sitio: "" });
                    setEducation({ highest_education: "college_graduate", school_institution: "", year_graduated: "" });
                    setBackground({ has_criminal_record: false, background_details: "" });
                    setFiles({ resume: null, nbi_clearance: null, police_clearance: null, government_id: null });
                    setConsent(false);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-900 transition"
                >
                  Submit Another
                </button>
                <button
                  onClick={() => {
                    setTrackId(successId);
                    setActiveTab("track");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/10 transition"
                >
                  Track Status
                </button>
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-900 transition flex items-center justify-center"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            /* Multi-step form wizard */
            <div className="glass-card border-slate-100/50 p-6 md:p-8 max-w-2xl mx-auto shadow-xl">
              {/* Progress Circles */}
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800/50 pb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
                {[
                  { s: 1, label: "Profile", icon: User },
                  { s: 2, label: "Education", icon: BookOpen },
                  { s: 3, label: "Background", icon: ShieldAlert },
                  { s: 4, label: "Documents", icon: UploadCloud },
                  { s: 5, label: "Review", icon: CheckSquare },
                ].map((stepObj) => (
                  <div key={stepObj.s} className="flex items-center gap-2 mr-4">
                    <button
                      type="button"
                      disabled={stepObj.s > currentStep && !canGoNext()}
                      onClick={() => setCurrentStep(stepObj.s as Step)}
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border transition duration-300 ${currentStep === stepObj.s
                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                          : currentStep > stepObj.s
                            ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 text-emerald-500"
                            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                        }`}
                    >
                      {currentStep > stepObj.s ? <CheckCircle2 size={12} /> : stepObj.s}
                    </button>
                    <span
                      className={`text-xs font-bold ${currentStep === stepObj.s ? "text-slate-800 dark:text-white font-extrabold" : "text-slate-400"
                        }`}
                    >
                      {stepObj.label}
                    </span>
                    {stepObj.s < 5 && <div className="h-[1px] w-8 bg-slate-200 dark:bg-slate-800 ml-2" />}
                  </div>
                ))}
              </div>

              {/* Dynamic Gradient Moving Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Wizard Completion Progress</span>
                  <span className="font-mono text-blue-600">{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-xs text-red-600">
                  {errorMsg}
                </div>
              )}

              {/* Form Step Contents */}
              <div className="min-h-[280px]">
                {/* STEP 1: Personal Profile */}
                {currentStep === 1 && (
                  <div key={1} className="space-y-5 animate-fade-in">
                    <h3 className="text-md font-bold text-slate-800 dark:text-white">Personal Profile</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">First Name</label>
                        <input
                          type="text"
                          required
                          value={personal.first_name}
                          onChange={(e) => setPersonal((p) => ({ ...p, first_name: e.target.value }))}
                          placeholder="First name"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#0F172A] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Last Name</label>
                        <input
                          type="text"
                          required
                          value={personal.last_name}
                          onChange={(e) => setPersonal((p) => ({ ...p, last_name: e.target.value }))}
                          placeholder="Last name"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#0F172A] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                      <input
                        type="email"
                        required
                        value={personal.email}
                        onChange={(e) => setPersonal((p) => ({ ...p, email: e.target.value }))}
                        placeholder="Email address"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#0F172A] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={personal.phone_number}
                        onChange={(e) => setPersonal((p) => ({ ...p, phone_number: e.target.value }))}
                        placeholder="Contact number"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#0F172A] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Purok / Sitio</label>
                      <select
                        required
                        value={personal.sitio}
                        onChange={(e) => setPersonal((p) => ({ ...p, sitio: e.target.value }))}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#0F172A] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                      >
                        <option value="" disabled>Select Sitio</option>
                        <option value="All Season 1">All Season 1</option>
                        <option value="All Season 2">All Season 2</option>
                        <option value="All Season 3">All Season 3</option>
                        <option value="Apple">Apple</option>
                        <option value="Caimito">Caimito</option>
                        <option value="Elma">Elma</option>
                        <option value="Laguna 1">Laguna 1</option>
                        <option value="Laguna 2">Laguna 2</option>
                        <option value="Little Hawaii">Little Hawaii</option>
                        <option value="Lourdes Extension">Lourdes Extension</option>
                        <option value="Lourdes Proper">Lourdes Proper</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* STEP 2: Educational Background */}
                {currentStep === 2 && (
                  <div key={2} className="space-y-5 animate-fade-in">
                    <h3 className="text-md font-bold text-slate-800 dark:text-white">Educational Background</h3>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Highest Education Attained</label>
                      <select
                        value={education.highest_education}
                        onChange={(e) => setEducation((p) => ({ ...p, highest_education: e.target.value }))}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#0F172A] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                      >
                        <option value="high_school">High School Graduate</option>
                        <option value="vocational">Vocational Course</option>
                        <option value="college_undergrad">College Undergraduate</option>
                        <option value="college_graduate">College Graduate</option>
                        <option value="post_graduate">Post-Graduate</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">School / Institution</label>
                      <input
                        type="text"
                        required
                        value={education.school_institution}
                        onChange={(e) => setEducation((p) => ({ ...p, school_institution: e.target.value }))}
                        placeholder="School or university name"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#0F172A] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Year Graduated</label>
                      <input
                        type="number"
                        required
                        value={education.year_graduated}
                        onChange={(e) => setEducation((p) => ({ ...p, year_graduated: e.target.value }))}
                        placeholder="Graduation year"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#0F172A] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: Background Check */}
                {currentStep === 3 && (
                  <div key={3} className="space-y-5 animate-fade-in">
                    <h3 className="text-md font-bold text-slate-800 dark:text-white">Background Check</h3>
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 p-4 rounded-xl">
                      <input
                        type="checkbox"
                        id="has_criminal"
                        checked={background.has_criminal_record}
                        onChange={(e) => setBackground((p) => ({ ...p, has_criminal_record: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-slate-300 transition cursor-pointer"
                      />
                      <label htmlFor="has_criminal" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                        Do you have any past pending or solved criminal/civil record cases?
                      </label>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        If yes, provide details (otherwise you may leave it empty)
                      </label>
                      <textarea
                        rows={4}
                        value={background.background_details}
                        onChange={(e) => setBackground((p) => ({ ...p, background_details: e.target.value }))}
                        placeholder="Specify any relevant background details"
                        className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm text-[#0F172A] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4: Document Uploads */}
                {currentStep === 4 && (
                  <div key={4} className="space-y-5 animate-fade-in">
                    <div>
                      <h3 className="text-md font-bold text-slate-800 dark:text-white">Document Uploads</h3>
                      <p className="text-xs text-slate-400 mt-1">Please attach your documents. Resume / CV is mandatory.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: "resume", label: "Resume / CV (Required)", mandatory: true },
                        { key: "nbi_clearance", label: "NBI Clearance", mandatory: false },
                        { key: "police_clearance", label: "Police Clearance", mandatory: false },
                        { key: "government_id", label: "Government Valid ID", mandatory: false },
                      ].map((item) => (
                        <div key={item.key} className="border border-dashed border-slate-200 rounded-xl p-4 flex flex-col justify-between bg-slate-50/20 dark:bg-slate-900/10">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                          <div className="mt-3 flex items-center justify-between gap-4">
                            <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[140px] font-semibold">
                              {files[item.key as keyof typeof files]?.name || "No file uploaded"}
                            </span>
                            <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-white text-[10px] font-bold uppercase tracking-wider text-white dark:text-slate-950 px-2.5 py-1.5 shadow-sm hover:opacity-90 active:scale-95 transition">
                              <FileText size={10} />
                              Select
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0] || null;
                                  handleFileChange(item.key as keyof typeof files, f);
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 5: Review & Consent */}
                {currentStep === 5 && (
                  <div key={5} className="space-y-5 animate-fade-in">
                    <h3 className="text-md font-bold text-slate-800 dark:text-white">Review & Consent</h3>

                    {/* Review card panel */}
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/50 p-4 rounded-xl space-y-3.5 text-xs">
                      <div>
                        <p className="font-bold text-[10px] uppercase text-slate-400">Position Applicant</p>
                        <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-200">{personal.first_name} {personal.last_name}</p>
                      </div>
                      <div>
                        <p className="font-bold text-[10px] uppercase text-slate-400">Email & Contact</p>
                        <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-200">{personal.email} ({personal.phone_number})</p>
                      </div>
                      <div>
                        <p className="font-bold text-[10px] uppercase text-slate-400">Purok / Sitio District</p>
                        <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-200">Sitio {personal.sitio}</p>
                      </div>
                      <div>
                        <p className="font-bold text-[10px] uppercase text-slate-400">Education Details</p>
                        <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-200">
                          {education.highest_education.replace(/_/g, " ").toUpperCase()} - {education.school_institution} ({education.year_graduated})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-blue-50/20 dark:bg-blue-950/10 border border-blue-200/40 p-4 rounded-xl">
                      <input
                        type="checkbox"
                        id="consent"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-slate-300 mt-0.5 transition cursor-pointer"
                      />
                      <label htmlFor="consent" className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer select-none font-semibold">
                        I hereby declare that all information submitted is true and complete to the best of my knowledge. I consent to background screenings and verify that the attached documents are authentic.
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Back / Next controls */}
              <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800/50 flex justify-between">
                {currentStep > 1 ? (
                  <button
                    onClick={handleBack}
                    className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50 transition active:scale-95"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <button
                    onClick={handleNext}
                    disabled={!canGoNext()}
                    className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-slate-900 dark:bg-white px-5 text-xs font-bold uppercase tracking-wider text-white dark:text-slate-950 hover:bg-blue-600 dark:hover:bg-slate-100 disabled:opacity-40 transition active:scale-95"
                  >
                    Next
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !canGoNext()}
                    className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-blue-600 text-white px-6 text-xs font-bold uppercase tracking-wider hover:bg-blue-700 disabled:opacity-40 shadow-md shadow-blue-500/10 transition active:scale-95"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                    Submit Application
                  </button>
                )}
              </div>
            </div>
          )
        ) : (
          /* Tracker panel */
          <div className="space-y-8 max-w-xl mx-auto">
            {/* Input Search Form */}
            <div className="glass-card p-6 border-slate-100/50 shadow-lg">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Track via Reference ID</h3>
              <form onSubmit={handleTrackSubmit} className="flex gap-3">
                <input
                  type="text"
                  required
                  placeholder="Application reference identifier"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-xs font-mono text-[#0F172A] outline-none"
                />
                <button
                  type="submit"
                  disabled={trackLoading}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-blue-600 dark:hover:bg-slate-100 transition active:scale-95"
                >
                  {trackLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                </button>
              </form>
              {trackError && <p className="mt-3 text-xs text-red-500 font-bold">{trackError}</p>}
            </div>

            {/* Tracking Result Roadmap */}
            {trackingResult && (
              <div className="glass-card p-6 border-slate-100/50 shadow-md animate-fade-in space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Position Candidate</p>
                    <h4 className="font-extrabold text-slate-800 dark:text-white mt-0.5">
                       {trackingResult.first_name} {trackingResult.last_name}
                    </h4>
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${getStatusColor(trackingResult.status)}`}>
                    {trackingResult.status_display}
                  </span>
                </div>

                {/* Progress Roadmap */}
                <div className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800/80 space-y-6">
                  {[
                    { key: "pending", title: "Application Submitted", desc: "Profile saved inside Cogon Pardo recruitment database.", done: true },
                    { key: "interview_scheduled", title: "Interview Scheduled", desc: "Background screenings completed. Interview invitations sent.", done: ["interview_scheduled", "approved", "hired"].includes(trackingResult.status) },
                    { key: "hired", title: "Hired & Activated", desc: "Hiring complete. User is registered as staff.", done: trackingResult.status === "hired" }
                  ].map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute left-[-29px] top-1.5 h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center ${step.done ? "bg-emerald-500 border-emerald-500 text-white" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300"}`}>
                        {step.done && <CheckSquare size={6} />}
                      </div>
                      <h5 className={`text-xs font-bold ${step.done ? "text-slate-800 dark:text-white" : "text-slate-400"}`}>{step.title}</h5>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logged in User Applications List */}
            {authUser && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">My Submitted Applications</h3>
                {myAppsLoading ? (
                  <div className="space-y-3">
                    <SkeletonPulse className="h-16 w-full" />
                    <SkeletonPulse className="h-16 w-full" />
                  </div>
                ) : myApplications.length > 0 ? (
                  <div className="space-y-3">
                    {myApplications.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => {
                          setTrackingResult(app);
                          setTrackId(app.id);
                        }}
                        className="glass-card p-4 border-slate-100/50 flex justify-between items-center cursor-pointer hover:border-slate-300 transition"
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-white">
                            Applied: {new Date(app.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400 select-all">{app.id}</p>
                        </div>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                          {app.status_display}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-medium">No submitted applications found.</p>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 dark:border-slate-900 py-8 bg-white/40 dark:bg-slate-950/20 text-center">
        <p className="text-[10px] text-slate-400 font-medium">
          © {new Date().getFullYear()} Barangay Cogon-Pardo. Civic-Tech Recruitment Portal.
        </p>
      </footer>
    </div>
  );
}
