import {
  Check,
  CheckCircle2,
  Copy,
  FileCheck2,
  Printer,
  RotateCcw,
} from 'lucide-react';
import { useState } from 'react';
import type { SubmittedRegistration } from '../types/registration';
import { formatFileSize } from '../utils/validation';

interface ConfirmationSummaryProps {
  submission: SubmittedRegistration;
  onStartNewRegistration: () => void;
}

/**
 * Displays the official post-submission confirmation banner, generated
 * Student Registration ID with one-click copy, and printable admission summary.
 */
export function ConfirmationSummary({
  submission,
  onStartNewRegistration,
}: ConfirmationSummaryProps) {
  const [copied, setCopied] = useState(false);
  const { registrationId, submittedAt, data } = submission;

  const formattedDate = new Date(submittedAt).toLocaleString(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const formattedDob = data.dateOfBirth
    ? new Date(`${data.dateOfBirth}T00:00:00`).toLocaleDateString(undefined, {
        dateStyle: 'medium',
      })
    : '—';

  const initials = data.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(registrationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Graceful fallback if clipboard API is restricted
      setCopied(false);
    }
  };

  return (
    <div className="animate-step-enter space-y-8">
      {/* Success Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0B1536] via-[#17265A] to-[#4C2EC4] p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-300 border border-emerald-300/30">
              <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium tracking-wide text-purple-200">
                Registration Submitted Successfully
              </p>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Welcome, {data.fullName}
              </h2>
              <p className="mt-1.5 text-sm text-slate-200/90">
                Your application for <strong className="font-semibold text-white">{data.course}</strong>{' '}
                has been recorded on {formattedDate}.
              </p>
            </div>
          </div>

          {/* Generated Student Registration ID Box */}
          <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-md shrink-0">
            <p className="text-xs font-medium text-purple-200">Student Registration ID</p>
            <div className="mt-1.5 flex items-center gap-3">
              <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-white tabular-nums">
                {registrationId}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                aria-label="Copy Registration ID"
                className="no-print inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official Registration Confirmation Slip */}
      <div className="print-surface rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-8">
        {/* Applicant Identity Strip */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            {data.studentPhoto?.previewUrl ? (
              <img
                src={data.studentPhoto.previewUrl}
                alt={`${data.fullName} photograph`}
                className="h-20 w-20 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B1536] to-[#5B3CE0] font-display text-2xl font-bold text-white">
                {initials || 'ST'}
              </div>
            )}
            <div>
              <h3 className="font-display text-xl font-bold text-[#0B1536]">{data.fullName}</h3>
              <p className="mt-0.5 text-sm text-slate-600">{data.email}</p>
              <p className="mt-1 text-xs text-slate-500">
                {data.academicSession}
                <span className="mx-2 text-slate-300" aria-hidden="true">
                  ·
                </span>
                {data.department}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs font-medium text-slate-500">Application Status</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              <span>Confirmed &amp; Pending Verification</span>
            </p>
          </div>
        </div>

        {/* Summary Grid: Personal Details */}
        <div>
          <h4 className="text-sm font-semibold text-[#4C2EC4] pb-2 border-b border-slate-200/80">
            Personal Details
          </h4>
          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Father&apos;s Name</dt>
              <dd className="mt-0.5 font-medium text-[#0B1536]">{data.fatherName}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Mother&apos;s Name</dt>
              <dd className="mt-0.5 font-medium text-[#0B1536]">{data.motherName}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Date of Birth</dt>
              <dd className="mt-0.5 font-medium text-[#0B1536] tabular-nums">{formattedDob}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Gender &amp; Nationality</dt>
              <dd className="mt-0.5 font-medium text-[#0B1536]">
                {data.gender} · {data.nationality}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Primary Mobile</dt>
              <dd className="mt-0.5 font-mono font-medium text-[#0B1536] tabular-nums">
                {data.mobileNumber}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Alternate Mobile</dt>
              <dd className="mt-0.5 font-mono font-medium text-[#0B1536] tabular-nums">
                {data.alternateMobile || 'Not provided'}
              </dd>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <dt className="text-xs text-slate-500">Complete Residential Address</dt>
              <dd className="mt-0.5 font-medium text-[#0B1536]">
                {data.address}, {data.city}, {data.state} —{' '}
                <span className="font-mono tabular-nums">{data.pinCode}</span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Summary Grid: Academic Details */}
        <div>
          <h4 className="text-sm font-semibold text-[#4C2EC4] pb-2 border-b border-slate-200/80">
            Academic Details
          </h4>
          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <div className="sm:col-span-2 lg:col-span-2">
              <dt className="text-xs text-slate-500">Previous School / College</dt>
              <dd className="mt-0.5 font-medium text-[#0B1536]">{data.previousSchool}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Last Qualification</dt>
              <dd className="mt-0.5 font-medium text-[#0B1536]">{data.lastQualification}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Passing Year</dt>
              <dd className="mt-0.5 font-mono font-medium text-[#0B1536] tabular-nums">
                {data.passingYear}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Score Obtained</dt>
              <dd className="mt-0.5 font-mono font-medium text-[#0B1536] tabular-nums">
                {data.scoreValue}
                {data.scoreFormat === 'percentage' ? '%' : ' CGPA'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Academic Session</dt>
              <dd className="mt-0.5 font-medium text-[#0B1536]">{data.academicSession}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-slate-500">Course Applying For</dt>
              <dd className="mt-0.5 font-medium text-[#0B1536]">{data.course}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Preferred Department</dt>
              <dd className="mt-0.5 font-medium text-[#0B1536]">{data.department}</dd>
            </div>
          </dl>
        </div>

        {/* Summary Grid: Uploaded Documents */}
        <div>
          <h4 className="text-sm font-semibold text-[#4C2EC4] pb-2 border-b border-slate-200/80">
            Submitted Documents
          </h4>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: 'Student Photograph', file: data.studentPhoto },
              { label: 'Previous Marksheet', file: data.previousMarksheet },
              { label: 'Student ID Proof', file: data.studentIdProof },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5"
              >
                <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#0B1536]">{item.label}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-600">
                    {item.file ? item.file.name : 'Not attached'}
                  </p>
                  {item.file && (
                    <p className="font-mono text-[11px] text-slate-400 tabular-nums">
                      {formatFileSize(item.file.size)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="no-print flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
        <button
          type="button"
          onClick={onStartNewRegistration}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-[#0B1536] transition-all duration-150 hover:bg-slate-50 hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B3CE0] whitespace-nowrap"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>New Registration</span>
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0B1536] via-[#2B1F76] to-[#5B3CE0] px-6 text-sm font-semibold text-white shadow-md shadow-[#5B3CE0]/25 transition-all duration-150 hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B3CE0] whitespace-nowrap"
        >
          <Printer className="h-4 w-4" aria-hidden="true" />
          <span>Print Confirmation Slip</span>
        </button>
      </div>
    </div>
  );
}
