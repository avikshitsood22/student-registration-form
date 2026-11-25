import {
  AlertCircle,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { type ChangeEvent, useRef, useState } from 'react';
import type {
  FormErrors,
  FormFieldName,
  StudentFormData,
  TouchedFields,
  UploadedFileInfo,
} from '../types/registration';
import { evaluatePasswordStrength, formatFileSize } from '../utils/validation';
import { FormField, getInputClassName } from './FormField';

interface DocumentsConfirmationStepProps {
  data: StudentFormData;
  errors: FormErrors;
  touched: TouchedFields;
  onChange: <K extends FormFieldName>(field: K, value: StudentFormData[K]) => void;
  onBlur: (field: FormFieldName) => void;
  onOpenTerms: () => void;
}

type DocumentFieldKey = 'studentPhoto' | 'previousMarksheet' | 'studentIdProof';

interface DocumentSlotConfig {
  field: DocumentFieldKey;
  label: string;
  accept: string;
  allowedTypes: string[];
  formatHint: string;
  maxSizeMB: number;
  isPhoto?: boolean;
}

const DOCUMENT_SLOTS: DocumentSlotConfig[] = [
  {
    field: 'studentPhoto',
    label: 'Student Photograph',
    accept: 'image/jpeg,image/png,image/webp',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    formatHint: 'JPG, PNG, or WEBP · Max 2 MB',
    maxSizeMB: 2,
    isPhoto: true,
  },
  {
    field: 'previousMarksheet',
    label: 'Previous Marksheet',
    accept: 'application/pdf,image/jpeg,image/png',
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    formatHint: 'PDF, JPG, or PNG · Max 5 MB',
    maxSizeMB: 5,
  },
  {
    field: 'studentIdProof',
    label: 'Student ID Proof',
    accept: 'application/pdf,image/jpeg,image/png',
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    formatHint: 'Aadhaar, Passport, or School ID · PDF/JPG/PNG · Max 5 MB',
    maxSizeMB: 5,
  },
];

/**
 * Step 3: Documents & Confirmation
 * Handles document uploads with live preview/validation, password security
 * with show/hide toggles and strength meter, and Terms acceptance.
 */
export function DocumentsConfirmationStep({
  data,
  errors,
  touched,
  onChange,
  onBlur,
  onOpenTerms,
}: DocumentsConfirmationStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<Partial<Record<DocumentFieldKey, string>>>({});

  const fileInputRefs = useRef<Record<DocumentFieldKey, HTMLInputElement | null>>({
    studentPhoto: null,
    previousMarksheet: null,
    studentIdProof: null,
  });

  const strength = evaluatePasswordStrength(data.password);

  const isInvalid = (field: FormFieldName) => Boolean(touched[field] && errors[field]);
  const isValid = (field: FormFieldName) =>
    Boolean(touched[field] && !errors[field] && String(data[field] ?? '').trim().length > 0);

  const handleFileChange = (slot: DocumentSlotConfig, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate MIME type
    if (!slot.allowedTypes.includes(file.type)) {
      setUploadErrors((prev) => ({
        ...prev,
        [slot.field]: `Unsupported format. Allowed: ${slot.formatHint}`,
      }));
      event.target.value = '';
      return;
    }

    // Validate file size
    const maxBytes = slot.maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadErrors((prev) => ({
        ...prev,
        [slot.field]: `File exceeds ${slot.maxSizeMB} MB limit (${formatFileSize(file.size)}).`,
      }));
      event.target.value = '';
      return;
    }

    setUploadErrors((prev) => ({ ...prev, [slot.field]: undefined }));

    // Generate live image preview for image uploads
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const uploadedInfo: UploadedFileInfo = {
          name: file.name,
          size: file.size,
          type: file.type,
          previewUrl: typeof reader.result === 'string' ? reader.result : undefined,
        };
        onChange(slot.field, uploadedInfo);
        onBlur(slot.field);
      };
      reader.readAsDataURL(file);
    } else {
      const uploadedInfo: UploadedFileInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
      };
      onChange(slot.field, uploadedInfo);
      onBlur(slot.field);
    }
  };

  const handleRemoveFile = (field: DocumentFieldKey) => {
    onChange(field, null);
    setUploadErrors((prev) => ({ ...prev, [field]: undefined }));
    const inputEl = fileInputRefs.current[field];
    if (inputEl) {
      inputEl.value = '';
    }
    onBlur(field);
  };

  const strengthBarColor =
    strength.score <= 1
      ? 'bg-rose-500'
      : strength.score === 2
        ? 'bg-amber-500'
        : strength.score === 3
          ? 'bg-indigo-500'
          : 'bg-emerald-600';

  const strengthTextColor =
    strength.score <= 1
      ? 'text-rose-600'
      : strength.score === 2
        ? 'text-amber-700'
        : strength.score === 3
          ? 'text-indigo-700'
          : 'text-emerald-700';

  return (
    <div className="space-y-8 animate-step-enter">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B1536]">
          03. Document Uploads &amp; Portal Security
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Upload clear digital copies of your required documents and set your portal password.
        </p>
      </div>

      {/* Subsection A: Document Upload Dropzones */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-[#4C2EC4] pb-2 border-b border-slate-200/80">
          Required Documents
        </h3>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {DOCUMENT_SLOTS.map((slot) => {
            const fileValue = data[slot.field];
            const activeError =
              uploadErrors[slot.field] || (touched[slot.field] ? errors[slot.field] : undefined);

            return (
              <div key={slot.field} className="flex flex-col">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <label
                    htmlFor={slot.field}
                    className="text-sm font-medium text-[#0B1536] flex items-center gap-1"
                  >
                    <span>{slot.label}</span>
                    <span className="text-rose-600 font-semibold" aria-hidden="true">
                      *
                    </span>
                  </label>

                  {fileValue && !activeError && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Uploaded</span>
                    </span>
                  )}
                </div>

                <input
                  ref={(el) => {
                    fileInputRefs.current[slot.field] = el;
                  }}
                  id={slot.field}
                  name={slot.field}
                  type="file"
                  accept={slot.accept}
                  onChange={(e) => handleFileChange(slot, e)}
                  className="sr-only"
                />

                {!fileValue ? (
                  <label
                    htmlFor={slot.field}
                    className={`group flex min-h-[156px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-5 text-center transition-all duration-150 ${
                      activeError
                        ? 'border-rose-400 bg-rose-50/40 hover:bg-rose-50/70'
                        : 'border-slate-300/90 bg-white/75 hover:border-[#5B3CE0] hover:bg-[#EFEAFF]/35'
                    }`}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFEAFF] text-[#5B3CE0] transition-transform duration-150 group-hover:scale-105">
                      {slot.isPhoto ? (
                        <ImageIcon className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <UploadCloud className="h-5 w-5" aria-hidden="true" />
                      )}
                    </span>
                    <span className="mt-3 text-sm font-semibold text-[#0B1536]">
                      Click to upload file
                    </span>
                    <span className="mt-1 text-xs text-slate-500">{slot.formatHint}</span>
                  </label>
                ) : (
                  <div className="flex min-h-[156px] flex-col justify-between rounded-2xl border border-emerald-300/80 bg-white/95 p-4 shadow-xs">
                    <div className="flex items-start gap-3">
                      {fileValue.previewUrl ? (
                        <img
                          src={fileValue.previewUrl}
                          alt={`${slot.label} preview`}
                          className="h-14 w-14 shrink-0 rounded-xl object-cover border border-slate-200"
                        />
                      ) : (
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EFEAFF] text-[#5B3CE0]">
                          <FileText className="h-6 w-6" aria-hidden="true" />
                        </span>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#0B1536]">
                          {fileValue.name}
                        </p>
                        <p className="mt-0.5 font-mono text-xs text-slate-500 tabular-nums">
                          {formatFileSize(fileValue.size)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                      <label
                        htmlFor={slot.field}
                        className="cursor-pointer text-xs font-semibold text-[#5B3CE0] hover:text-[#4C2EC4] transition-colors"
                      >
                        Replace file
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(slot.field)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeError && (
                  <p role="alert" className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-rose-600">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{activeError}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Subsection B: Portal Account Password */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-[#4C2EC4] pb-2 border-b border-slate-200/80">
          Student Portal Credentials
        </h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <FormField
              id="password"
              label="Create Password"
              required
              error={errors.password}
              touched={touched.password}
              hasValue={Boolean(data.password)}
            >
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Enter a strong password"
                  value={data.password}
                  onChange={(e) => onChange('password', e.target.value)}
                  onBlur={() => onBlur('password')}
                  aria-invalid={isInvalid('password')}
                  aria-describedby={isInvalid('password') ? 'password-error' : undefined}
                  className={getInputClassName(
                    isInvalid('password'),
                    isValid('password'),
                    'pr-11',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center text-slate-500 hover:text-[#0B1536] focus-visible:outline-none focus-visible:text-[#5B3CE0]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </FormField>

            {/* Live Password Strength Meter */}
            {data.password.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Password strength</span>
                  <span className={`font-semibold ${strengthTextColor}`}>{strength.label}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((segment) => (
                    <span
                      key={segment}
                      className={`h-1.5 rounded-full transition-colors duration-200 ${
                        strength.score >= segment ? strengthBarColor : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <ul className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 text-xs text-slate-500">
                  <li
                    className={`flex items-center gap-1.5 ${
                      strength.checks.minLength ? 'text-emerald-700 font-medium' : ''
                    }`}
                  >
                    <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>8+ characters</span>
                  </li>
                  <li
                    className={`flex items-center gap-1.5 ${
                      strength.checks.hasUppercase ? 'text-emerald-700 font-medium' : ''
                    }`}
                  >
                    <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>Uppercase letter</span>
                  </li>
                  <li
                    className={`flex items-center gap-1.5 ${
                      strength.checks.hasLowercase ? 'text-emerald-700 font-medium' : ''
                    }`}
                  >
                    <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>Lowercase letter</span>
                  </li>
                  <li
                    className={`flex items-center gap-1.5 ${
                      strength.checks.hasNumber ? 'text-emerald-700 font-medium' : ''
                    }`}
                  >
                    <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>Number (0–9)</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <FormField
            id="confirmPassword"
            label="Confirm Password"
            required
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
            hasValue={Boolean(data.confirmPassword)}
            hint="Re-enter your password to confirm."
          >
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Confirm your password"
                value={data.confirmPassword}
                onChange={(e) => onChange('confirmPassword', e.target.value)}
                onBlur={() => onBlur('confirmPassword')}
                aria-invalid={isInvalid('confirmPassword')}
                aria-describedby={
                  isInvalid('confirmPassword') ? 'confirmPassword-error' : undefined
                }
                className={getInputClassName(
                  isInvalid('confirmPassword'),
                  isValid('confirmPassword'),
                  'pr-11',
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center text-slate-500 hover:text-[#0B1536] focus-visible:outline-none focus-visible:text-[#5B3CE0]"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </FormField>
        </div>
      </div>

      {/* Subsection C: Applicant Declaration & Terms */}
      <div className="space-y-3 border-t border-slate-200/80 pt-6">
        <div
          className={`rounded-2xl border p-4 transition-colors ${
            isInvalid('acceptTerms')
              ? 'border-rose-300 bg-rose-50/40'
              : 'border-slate-200/90 bg-white/75'
          }`}
        >
          <label
            htmlFor="acceptTerms"
            className="flex cursor-pointer items-start gap-3.5 text-sm text-slate-700"
          >
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              checked={data.acceptTerms}
              onChange={(e) => {
                onChange('acceptTerms', e.target.checked);
                onBlur('acceptTerms');
              }}
              aria-invalid={isInvalid('acceptTerms')}
              aria-describedby={isInvalid('acceptTerms') ? 'acceptTerms-error' : undefined}
              className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-[#5B3CE0]"
            />
            <span className="leading-relaxed">
              I hereby declare that all personal, academic, and document details submitted in this
              form are true and accurate to the best of my knowledge. I agree to the University{' '}
              <button
                type="button"
                onClick={onOpenTerms}
                className="cursor-pointer font-semibold text-[#5B3CE0] underline decoration-[#5B3CE0]/40 underline-offset-2 hover:text-[#4C2EC4]"
              >
                Terms and Conditions
              </button>{' '}
              and Admissions Policy.{' '}
              <span className="text-rose-600 font-semibold" aria-hidden="true">
                *
              </span>
            </span>
          </label>
        </div>

        {isInvalid('acceptTerms') && (
          <p
            id="acceptTerms-error"
            role="alert"
            className="flex items-center gap-1.5 text-xs font-medium text-rose-600"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{errors.acceptTerms}</span>
          </p>
        )}

        <p className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#5B3CE0]" aria-hidden="true" />
          <span>
            Your registration data is validated before confirmation and a unique Student
            Registration ID is generated immediately.
          </span>
        </p>
      </div>
    </div>
  );
}
