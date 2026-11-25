import { ArrowRight, CheckCircle2, Search, X } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { ACADEMIC_PROGRAMS } from '../data/academicOptions';
import type { AcademicProgram, SubmittedRegistration } from '../types/registration';

export type ActiveModalType = 'programs' | 'guidelines' | 'track' | 'terms' | 'reset' | null;

interface ModalShellProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  maxWidthClass?: string;
}

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
  maxWidthClass = 'max-w-2xl',
}: ModalShellProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#070E26]/65 p-4 backdrop-blur-sm no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className={`animate-modal-reveal relative flex max-h-[88vh] w-full ${maxWidthClass} flex-col overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 bg-gradient-to-r from-[#0B1536] to-[#231B6B] text-white">
          <div>
            <h2 id="modal-title" className="font-display text-lg sm:text-xl font-bold text-white">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-xs sm:text-sm text-purple-200">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

interface InfoModalsProps {
  activeModal: ActiveModalType;
  onClose: () => void;
  onSelectProgram: (program: AcademicProgram) => void;
  onConfirmReset: () => void;
  savedSubmissions: SubmittedRegistration[];
  onLoadSubmission: (submission: SubmittedRegistration) => void;
}

/**
 * Interactive modals for Programs Directory, Admission Guidelines,
 * Application Status Lookup, Terms & Conditions, and Reset Confirmation.
 */
export function InfoModals({
  activeModal,
  onClose,
  onSelectProgram,
  onConfirmReset,
  savedSubmissions,
  onLoadSubmission,
}: InfoModalsProps) {
  const [levelFilter, setLevelFilter] = useState<'All' | 'Undergraduate' | 'Postgraduate' | 'Doctoral'>(
    'All',
  );
  const [lookupId, setLookupId] = useState('');
  const [lookupError, setLookupError] = useState('');

  if (!activeModal) return null;

  if (activeModal === 'programs') {
    const filteredPrograms =
      levelFilter === 'All'
        ? ACADEMIC_PROGRAMS
        : ACADEMIC_PROGRAMS.filter((p) => p.level === levelFilter);

    return (
      <ModalShell
        title="Academic Programs Directory"
        subtitle="Select a degree program to pre-fill your course and department preferences."
        onClose={onClose}
        maxWidthClass="max-w-3xl"
      >
        <div className="space-y-5">
          {/* Interactive Level Filter Controls */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-100 p-1.5">
            {(['All', 'Undergraduate', 'Postgraduate', 'Doctoral'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setLevelFilter(level)}
                className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                  levelFilter === level
                    ? 'bg-[#0B1536] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0B1536]'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="divide-y divide-slate-200">
            {filteredPrograms.map((program) => (
              <div
                key={program.code}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-display text-base font-bold text-[#0B1536]">{program.name}</p>
                  <p className="text-xs text-slate-500">
                    {program.level}
                    <span className="mx-1.5" aria-hidden="true">
                      ·
                    </span>
                    {program.duration}
                    <span className="mx-1.5" aria-hidden="true">
                      ·
                    </span>
                    {program.eligibility}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectProgram(program);
                    onClose();
                  }}
                  className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#EFEAFF] px-4 text-xs font-semibold text-[#4C2EC4] transition-colors hover:bg-[#5B3CE0] hover:text-white whitespace-nowrap"
                >
                  <span>Select Program</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </ModalShell>
    );
  }

  if (activeModal === 'guidelines') {
    return (
      <ModalShell
        title="Admission Guidelines & Checklist"
        subtitle="Keep these documents and details ready before completing your online application."
        onClose={onClose}
      >
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <div>
            <h3 className="font-display text-base font-bold text-[#0B1536]">
              01. Step-by-Step Registration Flow
            </h3>
            <ol className="mt-2.5 space-y-2 list-decimal pl-5">
              <li>
                <strong>Personal Details:</strong> Enter your legal name, parent names, date of
                birth, verified email, 10-digit mobile number, and residential address with PIN code.
              </li>
              <li>
                <strong>Academic Details:</strong> Provide your previous institution name, latest
                qualification, passing year, score (Percentage or CGPA), and desired course.
              </li>
              <li>
                <strong>Documents &amp; Confirmation:</strong> Upload your photograph, marksheet,
                and ID proof, set a secure portal password, and confirm the declaration.
              </li>
            </ol>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <h3 className="font-display text-base font-bold text-[#0B1536]">
              02. Digital Document Specifications
            </h3>
            <ul className="mt-2.5 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#5B3CE0]" aria-hidden="true" />
                <span>
                  <strong>Student Photograph:</strong> Recent passport-style color photo in JPG,
                  PNG, or WEBP format (maximum 2 MB).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#5B3CE0]" aria-hidden="true" />
                <span>
                  <strong>Previous Marksheet:</strong> Scanned copy of your latest qualifying
                  marksheet in PDF, JPG, or PNG format (maximum 5 MB).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#5B3CE0]" aria-hidden="true" />
                <span>
                  <strong>Student ID Proof:</strong> Government-issued ID or current institution ID
                  card in PDF, JPG, or PNG format (maximum 5 MB).
                </span>
              </li>
            </ul>
          </div>

          <div className="flex justify-end border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-10 cursor-pointer rounded-xl bg-[#0B1536] px-5 text-sm font-semibold text-white hover:bg-[#13204A] transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      </ModalShell>
    );
  }

  if (activeModal === 'track') {
    const handleSearch = () => {
      const normalized = lookupId.trim().toUpperCase();
      if (!normalized) {
        setLookupError('Please enter a Student Registration ID.');
        return;
      }
      const match = savedSubmissions.find(
        (item) => item.registrationId.toUpperCase() === normalized,
      );
      if (!match) {
        setLookupError(
          'No registration found with that ID in this browser session. Submit a form first to generate an ID.',
        );
        return;
      }
      setLookupError('');
      onLoadSubmission(match);
      onClose();
    };

    return (
      <ModalShell
        title="Track Your Application"
        subtitle="Enter your generated Student Registration ID to view your confirmation slip."
        onClose={onClose}
      >
        <div className="space-y-6">
          <div>
            <label htmlFor="track-id-input" className="block text-sm font-medium text-[#0B1536]">
              Student Registration ID
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id="track-id-input"
                type="text"
                placeholder="e.g., SRP-2026-BT-48291"
                value={lookupId}
                onChange={(e) => {
                  setLookupId(e.target.value);
                  setLookupError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 font-mono text-sm uppercase text-[#0B1536] focus:border-[#5B3CE0] focus:outline-none focus:ring-4 focus:ring-[#5B3CE0]/15"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5B3CE0] to-[#7255F0] px-5 text-sm font-semibold text-white hover:brightness-110 transition-all whitespace-nowrap"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>Find Slip</span>
              </button>
            </div>
            {lookupError && <p className="mt-2 text-xs font-medium text-rose-600">{lookupError}</p>}
          </div>

          <div className="border-t border-slate-200 pt-5">
            <h3 className="text-xs font-semibold text-slate-500">
              Recent Registrations on This Device ({savedSubmissions.length})
            </h3>
            {savedSubmissions.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">
                No completed registrations yet. Complete the 3-step form to generate your Student
                Registration ID.
              </p>
            ) : (
              <div className="mt-3 divide-y divide-slate-200 rounded-xl border border-slate-200">
                {savedSubmissions.map((item) => (
                  <div
                    key={item.registrationId}
                    className="flex flex-col gap-2 p-3.5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-mono text-sm font-semibold text-[#5B3CE0]">
                        {item.registrationId}
                      </p>
                      <p className="text-xs text-slate-600">
                        {item.data.fullName} · {item.data.course}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onLoadSubmission(item);
                        onClose();
                      }}
                      className="cursor-pointer self-start sm:self-auto rounded-lg bg-[#EFEAFF] px-3 py-1.5 text-xs font-semibold text-[#4C2EC4] hover:bg-[#5B3CE0] hover:text-white transition-colors whitespace-nowrap"
                    >
                      View Summary
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ModalShell>
    );
  }

  if (activeModal === 'terms') {
    return (
      <ModalShell
        title="Terms, Declaration & Privacy Policy"
        subtitle="University Admissions & Student Registration Regulations"
        onClose={onClose}
      >
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            1. <strong>Accuracy of Information:</strong> Applicants certify that all academic
            records, personal identification details, and uploaded documents submitted through the
            Student Registration Portal are authentic and verifiable.
          </p>
          <p>
            2. <strong>Document Verification:</strong> Provisional registration is confirmed upon
            generation of the Student Registration ID. Final admission remains subject to physical
            or digital verification of original academic marksheets and government ID proof.
          </p>
          <p>
            3. <strong>Data Confidentiality:</strong> Personal information and uploaded files are
            used solely for admissions evaluation, enrollment records, and official university
            communications.
          </p>
          <p>
            4. <strong>Account Security:</strong> Applicants are responsible for safeguarding
            their portal credentials and Student Registration ID for future status inquiries.
          </p>
          <div className="flex justify-end border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-10 cursor-pointer rounded-xl bg-[#0B1536] px-5 text-sm font-semibold text-white hover:bg-[#13204A] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </ModalShell>
    );
  }

  // activeModal === 'reset'
  return (
    <ModalShell
      title="Reset Registration Form?"
      subtitle="This will clear all entered fields and uploaded files across all three steps."
      onClose={onClose}
      maxWidthClass="max-w-md"
    >
      <div className="space-y-5">
        <p className="text-sm text-slate-600 leading-relaxed">
          Are you sure you want to start over? Any unsaved entries in Personal Details, Academic
          Details, and Document Uploads will be permanently cleared.
        </p>
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 cursor-pointer rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            className="h-10 cursor-pointer rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
          >
            Reset Form
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
