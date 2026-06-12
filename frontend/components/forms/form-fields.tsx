"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function InputField({ label, error, className, ...props }: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <input
        className={cn(
          "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-300 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
          error && "border-red-300 focus:border-red-400 focus:ring-red-100",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function SelectField({ label, error, options, placeholder, className, ...props }: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <select
        className={cn(
          "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
          error && "border-red-300 focus:border-red-400 focus:ring-red-100",
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextareaField({ label, error, className, ...props }: TextareaFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <textarea
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 resize-none",
          error && "border-red-300 focus:border-red-400 focus:ring-red-100",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
