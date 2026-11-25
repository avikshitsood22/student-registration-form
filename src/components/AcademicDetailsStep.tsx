import { BookOpen } from 'lucide-react';
import {
  ACADEMIC_PROGRAMS,
  ACADEMIC_SESSION_OPTIONS,
  DEPARTMENT_OPTIONS,
  PASSING_YEAR_OPTIONS,
  QUALIFICATION_OPTIONS,
} from '../data/academicOptions';
import type {
  FormErrors,
  FormFieldName,
  ScoreFormat,
  StudentFormData,
  TouchedFields,
} from '../types/registration';
import { FormField, getInputClassName } from './FormField';

interface AcademicDetailsStepProps {
  data: StudentFormData;
  errors: FormErrors;
  touched: TouchedFields;
  onChange: <K extends FormFieldName>(field: K, value: StudentFormData[K]) => void;
  onBlur: (field: FormFieldName) => void;
}

/**
 * Step 2: Academic Details
 * Captures previous academic credentials and target program preferences.
 */
export function AcademicDetailsStep({
  data,
  errors,
  touched,
  onChange,
  onBlur,
}: AcademicDetailsStepProps) {
  const isInvalid = (field: FormFieldName) => Boolean(touched[field] && errors[field]);
  const isValid = (field: FormFieldName) =>
    Boolean(touched[field] && !errors[field] && String(data[field] ?? '').trim().length > 0);

  const selectedProgram = ACADEMIC_PROGRAMS.find((p) => p.name === data.course);

  const handleScoreFormatChange = (format: ScoreFormat) => {
    onChange('scoreFormat', format);
    if (data.scoreValue) {
      onBlur('scoreValue');
    }
  };

  return (
    <div className="space-y-8 animate-step-enter">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B1536]">
          02. Academic Background &amp; Course Selection
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Provide your most recent academic qualification and choose your intended degree program.
        </p>
      </div>

      {/* Subsection A: Prior Academic Record */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-[#4C2EC4] pb-2 border-b border-slate-200/80">
          Previous Qualification
        </h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            id="previousSchool"
            label="Previous School / College Name"
            required
            error={errors.previousSchool}
            touched={touched.previousSchool}
            hasValue={Boolean(data.previousSchool.trim())}
          >
            <input
              id="previousSchool"
              name="previousSchool"
              type="text"
              placeholder="e.g., St. Xavier's Senior Secondary School"
              value={data.previousSchool}
              onChange={(e) => onChange('previousSchool', e.target.value)}
              onBlur={() => onBlur('previousSchool')}
              aria-invalid={isInvalid('previousSchool')}
              aria-describedby={isInvalid('previousSchool') ? 'previousSchool-error' : undefined}
              className={getInputClassName(isInvalid('previousSchool'), isValid('previousSchool'))}
            />
          </FormField>

          <FormField
            id="lastQualification"
            label="Last Qualification"
            required
            error={errors.lastQualification}
            touched={touched.lastQualification}
            hasValue={Boolean(data.lastQualification)}
          >
            <select
              id="lastQualification"
              name="lastQualification"
              value={data.lastQualification}
              onChange={(e) => onChange('lastQualification', e.target.value)}
              onBlur={() => onBlur('lastQualification')}
              aria-invalid={isInvalid('lastQualification')}
              aria-describedby={
                isInvalid('lastQualification') ? 'lastQualification-error' : undefined
              }
              className={getInputClassName(
                isInvalid('lastQualification'),
                isValid('lastQualification'),
              )}
            >
              <option value="">Select last qualification</option>
              {QUALIFICATION_OPTIONS.map((qual) => (
                <option key={qual} value={qual}>
                  {qual}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            id="passingYear"
            label="Passing Year"
            required
            error={errors.passingYear}
            touched={touched.passingYear}
            hasValue={Boolean(data.passingYear)}
          >
            <select
              id="passingYear"
              name="passingYear"
              value={data.passingYear}
              onChange={(e) => onChange('passingYear', e.target.value)}
              onBlur={() => onBlur('passingYear')}
              aria-invalid={isInvalid('passingYear')}
              aria-describedby={isInvalid('passingYear') ? 'passingYear-error' : undefined}
              className={getInputClassName(
                isInvalid('passingYear'),
                isValid('passingYear'),
                'font-mono tabular-nums',
              )}
            >
              <option value="">Select passing year</option>
              {PASSING_YEAR_OPTIONS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id="scoreValue"
            label="Percentage / CGPA"
            required
            error={errors.scoreValue}
            touched={touched.scoreValue}
            hasValue={Boolean(data.scoreValue.trim())}
            hint={
              data.scoreFormat === 'percentage'
                ? 'Enter aggregate percentage between 0 and 100.'
                : 'Enter cumulative grade point average between 0.0 and 10.0.'
            }
          >
            <div className="flex items-stretch gap-2">
              <input
                id="scoreValue"
                name="scoreValue"
                type="number"
                step="0.01"
                min={0}
                max={data.scoreFormat === 'percentage' ? 100 : 10}
                placeholder={data.scoreFormat === 'percentage' ? 'e.g., 88.5' : 'e.g., 8.9'}
                value={data.scoreValue}
                onChange={(e) => onChange('scoreValue', e.target.value)}
                onBlur={() => onBlur('scoreValue')}
                aria-invalid={isInvalid('scoreValue')}
                aria-describedby={isInvalid('scoreValue') ? 'scoreValue-error' : undefined}
                className={getInputClassName(
                  isInvalid('scoreValue'),
                  isValid('scoreValue'),
                  'font-mono tabular-nums flex-1',
                )}
              />

              {/* Segmented interactive format selector */}
              <div
                className="inline-flex shrink-0 items-center rounded-xl border border-slate-200 bg-slate-100/90 p-1"
                role="group"
                aria-label="Score format"
              >
                <button
                  type="button"
                  onClick={() => handleScoreFormatChange('percentage')}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                    data.scoreFormat === 'percentage'
                      ? 'bg-[#0B1536] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#0B1536]'
                  }`}
                >
                  %
                </button>
                <button
                  type="button"
                  onClick={() => handleScoreFormatChange('cgpa')}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                    data.scoreFormat === 'cgpa'
                      ? 'bg-[#0B1536] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#0B1536]'
                  }`}
                >
                  CGPA
                </button>
              </div>
            </div>
          </FormField>
        </div>
      </div>

      {/* Subsection B: Program Preferences */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-[#4C2EC4] pb-2 border-b border-slate-200/80">
          Admission Program &amp; Session
        </h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FormField
            id="course"
            label="Course Applying For"
            required
            error={errors.course}
            touched={touched.course}
            hasValue={Boolean(data.course)}
          >
            <select
              id="course"
              name="course"
              value={data.course}
              onChange={(e) => onChange('course', e.target.value)}
              onBlur={() => onBlur('course')}
              aria-invalid={isInvalid('course')}
              aria-describedby={isInvalid('course') ? 'course-error' : undefined}
              className={getInputClassName(isInvalid('course'), isValid('course'))}
            >
              <option value="">Select course</option>
              {ACADEMIC_PROGRAMS.map((program) => (
                <option key={program.code} value={program.name}>
                  {program.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id="department"
            label="Preferred Department"
            required
            error={errors.department}
            touched={touched.department}
            hasValue={Boolean(data.department)}
          >
            <select
              id="department"
              name="department"
              value={data.department}
              onChange={(e) => onChange('department', e.target.value)}
              onBlur={() => onBlur('department')}
              aria-invalid={isInvalid('department')}
              aria-describedby={isInvalid('department') ? 'department-error' : undefined}
              className={getInputClassName(isInvalid('department'), isValid('department'))}
            >
              <option value="">Select department</option>
              {selectedProgram && (
                <optgroup label={`Recommended for ${selectedProgram.name.split(' — ')[0]}`}>
                  {selectedProgram.recommendedDepartments.map((dept) => (
                    <option key={`rec-${dept}`} value={dept}>
                      {dept}
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="All University Departments">
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </optgroup>
            </select>
          </FormField>

          <FormField
            id="academicSession"
            label="Academic Session"
            required
            error={errors.academicSession}
            touched={touched.academicSession}
            hasValue={Boolean(data.academicSession)}
          >
            <select
              id="academicSession"
              name="academicSession"
              value={data.academicSession}
              onChange={(e) => onChange('academicSession', e.target.value)}
              onBlur={() => onBlur('academicSession')}
              aria-invalid={isInvalid('academicSession')}
              aria-describedby={
                isInvalid('academicSession') ? 'academicSession-error' : undefined
              }
              className={getInputClassName(
                isInvalid('academicSession'),
                isValid('academicSession'),
              )}
            >
              <option value="">Select academic session</option>
              {ACADEMIC_SESSION_OPTIONS.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Helpful contextual program eligibility note when a course is selected */}
        {selectedProgram && (
          <div className="flex items-start gap-3 rounded-xl border border-[#5B3CE0]/20 bg-[#EFEAFF]/55 px-4 py-3.5 text-sm text-[#0B1536] animate-step-enter">
            <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#5B3CE0]" aria-hidden="true" />
            <div className="space-y-0.5">
              <p className="font-semibold">
                {selectedProgram.name}
                <span className="mx-2 text-slate-400" aria-hidden="true">
                  ·
                </span>
                <span className="font-normal text-slate-600">
                  {selectedProgram.level} ({selectedProgram.duration})
                </span>
              </p>
              <p className="text-xs text-slate-600">
                Standard eligibility: {selectedProgram.eligibility}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
