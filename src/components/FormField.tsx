import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  optionalNote?: string;
  error?: string;
  touched?: boolean;
  hasValue?: boolean;
  hint?: string;
  children: ReactNode;
}

/**
 * Consistent accessible field container providing required indicators,
 * real-time valid state feedback, and explicit icon-paired error messages.
 */
export function FormField({
  id,
  label,
  required = false,
  optionalNote,
  error,
  touched,
  hasValue,
  hint,
  children,
}: FormFieldProps) {
  const showError = Boolean(touched && error);
  const showValid = Boolean(touched && !error && hasValue);

  return (
    <div className="flex flex-col">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="text-sm font-medium text-[#0B1536] flex items-center gap-1"
        >
          <span>{label}</span>
          {required && (
            <span className="text-rose-600 font-semibold" aria-hidden="true">
              *
            </span>
          )}
          {optionalNote && (
            <span className="text-xs font-normal text-slate-400">({optionalNote})</span>
          )}
        </label>

        {showValid && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Valid</span>
          </span>
        )}
      </div>

      {children}

      {showError ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-rose-600"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

/**
 * Shared Tailwind class generator for rounded form inputs, selects, and textareas.
 */
export function getInputClassName(showError: boolean, showValid: boolean, extra = ''): string {
  const stateClasses = showError
    ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-500/20'
    : showValid
      ? 'border-emerald-400/80 bg-white focus:border-[#5B3CE0] focus:ring-[#5B3CE0]/20'
      : 'border-slate-200/90 bg-white/95 hover:border-slate-300 focus:border-[#5B3CE0] focus:ring-[#5B3CE0]/20';

  return `w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#0B1536] placeholder:text-slate-400 shadow-xs transition-all duration-150 focus:outline-none focus:ring-4 ${stateClasses} ${extra}`;
}
