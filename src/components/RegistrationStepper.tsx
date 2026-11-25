import { Check } from 'lucide-react';
import type { RegistrationStep } from '../types/registration';

interface RegistrationStepperProps {
  currentStep: RegistrationStep;
  completedSteps: Record<RegistrationStep, boolean>;
  completionPercentage: number;
  onSelectStep: (step: RegistrationStep) => void;
}

const STEPS: { id: RegistrationStep; indexLabel: string; title: string; subtitle: string }[] = [
  {
    id: 1,
    indexLabel: '01',
    title: 'Personal Details',
    subtitle: 'Identity, contact & address',
  },
  {
    id: 2,
    indexLabel: '02',
    title: 'Academic Details',
    subtitle: 'Qualifications & program choice',
  },
  {
    id: 3,
    indexLabel: '03',
    title: 'Documents & Confirmation',
    subtitle: 'Uploads, security & review',
  },
];

/**
 * Displays both the real-time form completion percentage bar
 * and interactive three-step registration navigation.
 */
export function RegistrationStepper({
  currentStep,
  completedSteps,
  completionPercentage,
  onSelectStep,
}: RegistrationStepperProps) {
  return (
    <div className="border-b border-slate-200/80 pb-7">
      {/* Live Form Completion Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[#5B3CE0]">
              Application Progress
            </p>
            <p className="text-sm text-slate-600">
              Step {currentStep} of 3 — {STEPS[currentStep - 1].title}
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-lg font-semibold text-[#0B1536] tabular-nums">
              {completionPercentage}%
            </span>
            <p className="text-xs text-slate-500">Form completed</p>
          </div>
        </div>

        <div
          className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80"
          role="progressbar"
          aria-valuenow={completionPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Registration form completion percentage"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0B1536] via-[#4C2EC4] to-[#7255F0] transition-all duration-300 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Interactive 3-Step Horizontal Navigation */}
      <nav aria-label="Registration steps" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps[step.id] && !isActive;
          const canJump = step.id <= currentStep || completedSteps[(step.id - 1) as RegistrationStep];

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                if (canJump) onSelectStep(step.id);
              }}
              disabled={!canJump}
              aria-current={isActive ? 'step' : undefined}
              className={`group flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B3CE0] ${
                isActive
                  ? 'bg-gradient-to-r from-[#0B1536] to-[#1E2E68] text-white shadow-md shadow-[#0B1536]/15 cursor-default'
                  : isCompleted
                    ? 'bg-[#EFEAFF]/75 text-[#0B1536] hover:bg-[#EFEAFF] cursor-pointer border border-[#5B3CE0]/20'
                    : canJump
                      ? 'bg-white/70 text-slate-700 hover:bg-white cursor-pointer border border-slate-200/90'
                      : 'bg-slate-50/80 text-slate-400 cursor-not-allowed border border-slate-200/60'
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : isCompleted
                      ? 'bg-[#5B3CE0] text-white'
                      : 'bg-slate-200/70 text-slate-500'
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" strokeWidth={2.5} /> : step.indexLabel}
              </span>

              <div className="min-w-0">
                <p
                  className={`truncate text-sm font-semibold ${
                    isActive ? 'text-white' : isCompleted ? 'text-[#0B1536]' : 'text-slate-700'
                  }`}
                >
                  {step.title}
                </p>
                <p
                  className={`truncate text-xs ${
                    isActive ? 'text-purple-100/90' : 'text-slate-500'
                  }`}
                >
                  {step.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
