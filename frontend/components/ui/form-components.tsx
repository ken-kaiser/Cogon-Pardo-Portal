import React from "react";
import { UploadCloud } from "lucide-react";

export function FormCard({ children, title, description }: { children: React.ReactNode, title: string, description?: string }) {
  return (
    <div className="w-full rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl shadow-sm overflow-hidden">
      <div className="border-b border-slate-100/50 dark:border-slate-800/40 bg-slate-50/30 dark:bg-slate-950/20 px-6 py-5">
        <h2 className="text-lg font-extrabold text-slate-800 dark:text-white leading-none">{title}</h2>
        {description && <p className="mt-2 text-xs text-slate-400 font-medium leading-normal">{description}</p>}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

export function FormSection({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <div className="mb-8 last:mb-0">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100/50 dark:border-slate-800/30 pb-2">
        {title}
      </h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

export function FormInput({ label, required, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string, required?: boolean }) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        required={required}
        className="h-11 w-full rounded-xl border border-slate-200/60 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/30 px-4 text-base md:text-sm text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none transition duration-200 focus:border-blue-500 dark:focus:border-cyan-500 focus:ring-4 focus:ring-blue-100/50 dark:focus:ring-cyan-950/20"
        {...props}
      />
    </div>
  );
}

export function FormSelect({ label, required, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, required?: boolean, children: React.ReactNode }) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        required={required}
        className="h-11 w-full rounded-xl border border-slate-200/60 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/30 px-4 text-base md:text-sm text-slate-800 dark:text-white outline-none transition duration-200 focus:border-blue-500 dark:focus:border-cyan-500 focus:ring-4 focus:ring-blue-100/50 dark:focus:ring-cyan-950/20 appearance-none"
        {...props}
      >
        <option value="" className="dark:bg-slate-950">Select an option</option>
        {children}
      </select>
    </div>
  );
}

export function FormUpload({ label, required, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string, required?: boolean }) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200/60 dark:border-slate-800/50 border-dashed rounded-xl bg-white/40 dark:bg-slate-900/20 transition duration-300 hover:border-blue-500 dark:hover:border-cyan-500 hover:bg-blue-50/10">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloud className="w-8 h-8 mb-2 text-slate-400 dark:text-slate-500" />
          <p className="mb-1 text-xs text-slate-500 dark:text-slate-400"><span className="font-bold text-slate-700 dark:text-slate-200">Click to upload</span> or drag and drop</p>
          <p className="text-[10px] text-slate-400">PDF, JPG, PNG (MAX. 5MB)</p>
        </div>
        <input 
          type="file" 
          required={required} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          {...props} 
        />
      </div>
    </div>
  );
}
