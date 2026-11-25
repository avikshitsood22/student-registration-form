/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  RotateCcw,
  Send,
} from 'lucide-react';
import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AcademicDetailsStep } from './components/AcademicDetailsStep';
import { ConfirmationSummary } from './components/ConfirmationSummary';
import { DocumentsConfirmationStep } from './components/DocumentsConfirmationStep';
import { Footer } from './components/Footer';
import { HeroBanner } from './components/HeroBanner';
import { type ActiveModalType, InfoModals } from './components/InfoModals';
import { Navbar } from './components/Navbar';
import { PersonalDetailsStep } from './components/PersonalDetailsStep';
import { RegistrationStepper } from './components/RegistrationStepper';
import { INITIAL_FORM_DATA } from './data/academicOptions';
import type {
  AcademicProgram,
  FormErrors,
  FormFieldName,
  RegistrationStep,
  StudentFormData,
  SubmittedRegistration,
  TouchedFields,
} from './types/registration';
import {
  STEP_FIELDS,
  calculateCompletionPercentage,
  generateRegistrationId,
  validateAllSteps,
  validateField,
  validateStep,
} from './utils/validation';

const STORAGE_KEY = 'srp_submitted_registrations_v1';

/**
 * Main Student Registration Portal Application
 * Coordinates multi-step navigation, live field validation, progress calculation,
 * loading state on submission, and registration confirmation summaries.
 */
export default function App() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1);
  const [formData, setFormData] = useState<StudentFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [stepErrorBanner, setStepErrorBanner] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<SubmittedRegistration | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [savedSubmissions, setSavedSubmissions] = useState<SubmittedRegistration[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SubmittedRegistration[]) : [];
    } catch {
      return [];
    }
  });

  const formCardRef = useRef<HTMLDivElement | null>(null);

  // Sync saved submissions to localStorage so "Track Application" works seamlessly
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSubmissions.slice(0, 10)));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [savedSubmissions]);

  // Real-time form completion percentage across all required fields
  const completionPercentage = useMemo(
    () => calculateCompletionPercentage(formData),
    [formData],
  );

  // Determine which steps have zero validation errors
  const completedSteps = useMemo<Record<RegistrationStep, boolean>>(
    () => ({
      1: Object.keys(validateStep(1, formData)).length === 0,
      2: Object.keys(validateStep(2, formData)).length === 0,
      3: Object.keys(validateStep(3, formData)).length === 0,
    }),
    [formData],
  );

  const scrollToFormTop = () => {
    formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /**
   * Updates any field value and re-validates immediately for real-time feedback.
   */
  const handleFieldChange = <K extends FormFieldName>(field: K, value: StudentFormData[K]) => {
    setFormData((prev) => {
      const updated: StudentFormData = { ...prev, [field]: value };

      // Re-validate active field (and linked fields like password/confirmPassword or mobile numbers)
      setErrors((prevErrors) => {
        const nextErrors = { ...prevErrors };
        const fieldError = validateField(field, updated);
        if (fieldError) {
          nextErrors[field] = fieldError;
        } else {
          delete nextErrors[field];
        }

        if (field === 'password' && touched.confirmPassword) {
          const confirmErr = validateField('confirmPassword', updated);
          if (confirmErr) nextErrors.confirmPassword = confirmErr;
          else delete nextErrors.confirmPassword;
        }

        if (field === 'mobileNumber' && touched.alternateMobile) {
          const altErr = validateField('alternateMobile', updated);
          if (altErr) nextErrors.alternateMobile = altErr;
          else delete nextErrors.alternateMobile;
        }

        if (field === 'scoreFormat' && touched.scoreValue) {
          const scoreErr = validateField('scoreValue', updated);
          if (scoreErr) nextErrors.scoreValue = scoreErr;
          else delete nextErrors.scoreValue;
        }

        return nextErrors;
      });

      return updated;
    });

    if (stepErrorBanner) {
      setStepErrorBanner('');
    }
  };

  /**
   * Marks a field as touched on blur and runs validation immediately.
   */
  const handleFieldBlur = (field: FormFieldName) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validateField(field, formData);
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldError) next[field] = fieldError;
      else delete next[field];
      return next;
    });
  };

  /**
   * Marks every field in a step as touched and returns whether the step is valid.
   */
  const touchAndValidateStep = (step: RegistrationStep): boolean => {
    const stepErrors = validateStep(step, formData);
    const stepTouched: TouchedFields = {};
    for (const field of STEP_FIELDS[step]) {
      stepTouched[field] = true;
    }

    setTouched((prev) => ({ ...prev, ...stepTouched }));
    setErrors((prev) => {
      const cleaned = { ...prev };
      for (const field of STEP_FIELDS[step]) {
        delete cleaned[field];
      }
      return { ...cleaned, ...stepErrors };
    });

    const errorCount = Object.keys(stepErrors).length;
    if (errorCount > 0) {
      setStepErrorBanner(
        `Please review ${errorCount} ${
          errorCount === 1 ? 'field' : 'fields'
        } highlighted below before continuing.`,
      );
      return false;
    }

    setStepErrorBanner('');
    return true;
  };

  const handleNextStep = () => {
    if (!touchAndValidateStep(currentStep)) {
      scrollToFormTop();
      return;
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as RegistrationStep);
      scrollToFormTop();
    }
  };

  const handlePreviousStep = () => {
    setStepErrorBanner('');
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as RegistrationStep);
      scrollToFormTop();
    }
  };

  const handleStepSelect = (targetStep: RegistrationStep) => {
    if (targetStep === currentStep) return;
    if (targetStep < currentStep) {
      setStepErrorBanner('');
      setCurrentStep(targetStep);
      scrollToFormTop();
      return;
    }
    if (touchAndValidateStep(currentStep)) {
      setCurrentStep(targetStep);
      scrollToFormTop();
    }
  };

  /**
   * Validates all 3 steps, displays a smooth submission loading animation,
   * generates a unique Student Registration ID, and displays the confirmation summary.
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const allErrors = validateAllSteps(formData);
    const allTouched: TouchedFields = {};
    (Object.keys(formData) as FormFieldName[]).forEach((key) => {
      allTouched[key] = true;
    });

    setTouched(allTouched);
    setErrors(allErrors);

    const errorFields = Object.keys(allErrors) as FormFieldName[];
    if (errorFields.length > 0) {
      // Jump to the earliest step containing an error
      const firstInvalidStep: RegistrationStep = STEP_FIELDS[1].some((f) => allErrors[f])
        ? 1
        : STEP_FIELDS[2].some((f) => allErrors[f])
          ? 2
          : 3;

      setCurrentStep(firstInvalidStep);
      setStepErrorBanner(
        `Please complete ${errorFields.length} required ${
          errorFields.length === 1 ? 'field' : 'fields'
        } before submitting your registration.`,
      );
      scrollToFormTop();
      return;
    }

    setStepErrorBanner('');
    setIsSubmitting(true);

    // Smooth loading animation before generating the official registration confirmation
    window.setTimeout(() => {
      const { password: _password, confirmPassword: _confirmPassword, ...safeData } = formData;
      const newRecord: SubmittedRegistration = {
        registrationId: generateRegistrationId(formData.course),
        submittedAt: new Date().toISOString(),
        data: safeData,
      };

      setSavedSubmissions((prev) => [newRecord, ...prev]);
      setSubmittedRecord(newRecord);
      setIsSubmitting(false);
      scrollToFormTop();
    }, 1250);
  };

  const handleResetConfirmed = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setTouched({});
    setStepErrorBanner('');
    setSubmittedRecord(null);
    setCurrentStep(1);
    scrollToFormTop();
  };

  const handleProgramSelectedFromDirectory = (program: AcademicProgram) => {
    setSubmittedRecord(null);
    handleFieldChange('course', program.name);
    if (program.recommendedDepartments[0]) {
      handleFieldChange('department', program.recommendedDepartments[0]);
    }
    setTouched((prev) => ({ ...prev, course: true, department: true }));
    scrollToFormTop();
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#F4F6FB] overflow-x-hidden">
      {/* Subtle Ambient Background Gradient Mesh & Floating Decorative Elements */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-[460px] w-[460px] rounded-full bg-[#5B3CE0]/12 blur-3xl animate-float-slow" />
        <div className="absolute top-[38%] -right-28 h-[520px] w-[520px] rounded-full bg-[#1D3068]/10 blur-3xl animate-float-delayed" />
        <div className="absolute -bottom-32 left-[24%] h-[420px] w-[420px] rounded-full bg-[#7255F0]/10 blur-3xl animate-float-slow" />
      </div>

      {/* Responsive Header & Navigation Bar */}
      <Navbar
        onOpenPrograms={() => setActiveModal('programs')}
        onOpenGuidelines={() => setActiveModal('guidelines')}
        onOpenTrackModal={() => setActiveModal('track')}
        onNavigateForm={() => {
          setSubmittedRecord(null);
          scrollToFormTop();
        }}
      />

      {/* Institutional Hero Banner */}
      <HeroBanner />

      {/* Main Registration Workspace */}
      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 -mt-14 pb-20 sm:px-6 lg:px-8">
        <div
          ref={formCardRef}
          className="glass-panel scroll-mt-24 rounded-3xl p-5 sm:p-8 lg:p-10"
        >
          {submittedRecord ? (
            <ConfirmationSummary
              submission={submittedRecord}
              onStartNewRegistration={handleResetConfirmed}
            />
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              {/* Stepper & Live Completion Indicator */}
              <RegistrationStepper
                currentStep={currentStep}
                completedSteps={completedSteps}
                completionPercentage={completionPercentage}
                onSelectStep={handleStepSelect}
              />

              {/* Inline Step Validation Alert Banner */}
              {stepErrorBanner && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm font-medium text-rose-700 animate-step-enter"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" aria-hidden="true" />
                  <span>{stepErrorBanner}</span>
                </div>
              )}

              {/* Active Step Content */}
              <div>
                {currentStep === 1 && (
                  <PersonalDetailsStep
                    data={formData}
                    errors={errors}
                    touched={touched}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                  />
                )}

                {currentStep === 2 && (
                  <AcademicDetailsStep
                    data={formData}
                    errors={errors}
                    touched={touched}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                  />
                )}

                {currentStep === 3 && (
                  <DocumentsConfirmationStep
                    data={formData}
                    errors={errors}
                    touched={touched}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    onOpenTerms={() => setActiveModal('terms')}
                  />
                )}
              </div>

              {/* Navigation & Form Action Bar */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200/90 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      disabled={isSubmitting}
                      className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-[#0B1536] transition-all duration-150 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B3CE0] whitespace-nowrap"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      <span>Previous</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveModal('reset')}
                    disabled={isSubmitting}
                    className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-transparent px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 whitespace-nowrap"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    <span>Reset Form</span>
                  </button>
                </div>

                <div className="flex items-center justify-end">
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex h-11 w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0B1536] via-[#2B1F76] to-[#5B3CE0] px-6 text-sm font-semibold text-white shadow-md shadow-[#5B3CE0]/25 transition-all duration-150 hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B3CE0] whitespace-nowrap"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex h-11 w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0B1536] via-[#4C2EC4] to-[#6B4AF5] px-7 text-sm font-semibold text-white shadow-lg shadow-[#5B3CE0]/30 transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:cursor-wait disabled:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B3CE0] whitespace-nowrap"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          <span>Processing Registration...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" aria-hidden="true" />
                          <span>Submit Registration</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* University Footer with Copyright & Contact Details */}
      <Footer
        onOpenPrograms={() => setActiveModal('programs')}
        onOpenGuidelines={() => setActiveModal('guidelines')}
        onOpenTrackModal={() => setActiveModal('track')}
        onOpenTerms={() => setActiveModal('terms')}
      />

      {/* Interactive Support & Action Modals */}
      <InfoModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onSelectProgram={handleProgramSelectedFromDirectory}
        onConfirmReset={handleResetConfirmed}
        savedSubmissions={savedSubmissions}
        onLoadSubmission={(record) => {
          setSubmittedRecord(record);
          scrollToFormTop();
        }}
      />
    </div>
  );
}
