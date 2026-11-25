import { ACADEMIC_PROGRAMS } from '../data/academicOptions';
import type {
  FormErrors,
  FormFieldName,
  RegistrationStep,
  StudentFormData,
} from '../types/registration';

/**
 * Real-time validation utilities, password strength scoring,
 * form completion calculator, and unique Registration ID generator.
 */

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$|^\d{10}$/;
const PIN_REGEX = /^\d{6}$/;
const NAME_REGEX = /^[a-zA-Z][a-zA-Z\s.'-]{1,79}$/;

/** Required fields mapped by registration step */
export const STEP_FIELDS: Record<RegistrationStep, FormFieldName[]> = {
  1: [
    'fullName',
    'fatherName',
    'motherName',
    'dateOfBirth',
    'gender',
    'email',
    'mobileNumber',
    'alternateMobile',
    'address',
    'city',
    'state',
    'pinCode',
    'nationality',
  ],
  2: [
    'previousSchool',
    'lastQualification',
    'passingYear',
    'scoreValue',
    'course',
    'department',
    'academicSession',
  ],
  3: [
    'studentPhoto',
    'previousMarksheet',
    'studentIdProof',
    'password',
    'confirmPassword',
    'acceptTerms',
  ],
};

/** Required fields counted toward the live form completion percentage */
export const REQUIRED_COMPLETION_FIELDS: FormFieldName[] = [
  'fullName',
  'fatherName',
  'motherName',
  'dateOfBirth',
  'gender',
  'email',
  'mobileNumber',
  'address',
  'city',
  'state',
  'pinCode',
  'nationality',
  'previousSchool',
  'lastQualification',
  'passingYear',
  'scoreValue',
  'course',
  'department',
  'academicSession',
  'studentPhoto',
  'previousMarksheet',
  'studentIdProof',
  'password',
  'confirmPassword',
  'acceptTerms',
];

export interface PasswordStrengthResult {
  score: number; // 0 to 4
  label: 'Empty' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  checks: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

/**
 * Evaluates password strength across 5 criteria and maps to a 0–4 scale.
 */
export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  if (!password) {
    return { score: 0, label: 'Empty', checks };
  }

  const passedCount = Object.values(checks).filter(Boolean).length;
  if (passedCount <= 2) return { score: 1, label: 'Weak', checks };
  if (passedCount === 3) return { score: 2, label: 'Fair', checks };
  if (passedCount === 4) return { score: 3, label: 'Good', checks };
  return { score: 4, label: 'Strong', checks };
}

/**
 * Validates a single field against current form state and returns an error message or undefined.
 */
export function validateField(
  field: FormFieldName,
  data: StudentFormData,
): string | undefined {
  switch (field) {
    case 'fullName': {
      const value = data.fullName.trim();
      if (!value) return 'Full name is required.';
      if (value.length < 2) return 'Enter at least 2 characters.';
      if (!NAME_REGEX.test(value)) return 'Use letters, spaces, dots, or hyphens only.';
      return undefined;
    }

    case 'fatherName': {
      const value = data.fatherName.trim();
      if (!value) return "Father's name is required.";
      if (value.length < 2) return 'Enter at least 2 characters.';
      if (!NAME_REGEX.test(value)) return 'Use letters, spaces, dots, or hyphens only.';
      return undefined;
    }

    case 'motherName': {
      const value = data.motherName.trim();
      if (!value) return "Mother's name is required.";
      if (value.length < 2) return 'Enter at least 2 characters.';
      if (!NAME_REGEX.test(value)) return 'Use letters, spaces, dots, or hyphens only.';
      return undefined;
    }

    case 'dateOfBirth': {
      if (!data.dateOfBirth) return 'Date of birth is required.';
      const dob = new Date(data.dateOfBirth);
      if (Number.isNaN(dob.getTime())) return 'Enter a valid date.';
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age -= 1;
      }
      if (dob > today) return 'Date of birth cannot be in the future.';
      if (age < 14) return 'Applicant must be at least 14 years old.';
      if (age > 85) return 'Please verify the date of birth entered.';
      return undefined;
    }

    case 'gender':
      return data.gender ? undefined : 'Please select your gender.';

    case 'email': {
      const value = data.email.trim();
      if (!value) return 'Email address is required.';
      if (!EMAIL_REGEX.test(value)) return 'Enter a valid email address (e.g., name@domain.com).';
      return undefined;
    }

    case 'mobileNumber': {
      const digits = data.mobileNumber.replace(/\D/g, '');
      if (!digits) return 'Mobile number is required.';
      if (!MOBILE_REGEX.test(digits)) return 'Enter a valid 10-digit mobile number.';
      return undefined;
    }

    case 'alternateMobile': {
      const raw = data.alternateMobile.trim();
      if (!raw) return undefined; // Optional field
      const digits = raw.replace(/\D/g, '');
      if (!MOBILE_REGEX.test(digits)) return 'Enter a valid 10-digit alternate mobile number.';
      const primaryDigits = data.mobileNumber.replace(/\D/g, '');
      if (primaryDigits && digits === primaryDigits) {
        return 'Alternate mobile number must differ from primary mobile.';
      }
      return undefined;
    }

    case 'address': {
      const value = data.address.trim();
      if (!value) return 'Complete residential address is required.';
      if (value.length < 10) return 'Please provide house/street details (min. 10 characters).';
      return undefined;
    }

    case 'city': {
      const value = data.city.trim();
      if (!value) return 'City is required.';
      if (value.length < 2) return 'Enter a valid city name.';
      return undefined;
    }

    case 'state':
      return data.state ? undefined : 'Please select your state or region.';

    case 'pinCode': {
      const digits = data.pinCode.replace(/\D/g, '');
      if (!digits) return 'PIN code is required.';
      if (!PIN_REGEX.test(digits)) return 'Enter a valid 6-digit PIN code.';
      return undefined;
    }

    case 'nationality':
      return data.nationality.trim() ? undefined : 'Nationality is required.';

    case 'previousSchool': {
      const value = data.previousSchool.trim();
      if (!value) return 'Previous school or college name is required.';
      if (value.length < 3) return 'Enter the full institution name.';
      return undefined;
    }

    case 'lastQualification':
      return data.lastQualification ? undefined : 'Select your last completed qualification.';

    case 'passingYear':
      return data.passingYear ? undefined : 'Select your passing year.';

    case 'scoreValue': {
      const raw = data.scoreValue.trim();
      if (!raw) {
        return data.scoreFormat === 'percentage'
          ? 'Percentage is required.'
          : 'CGPA is required.';
      }
      const num = Number(raw);
      if (Number.isNaN(num)) return 'Enter a valid numeric score.';
      if (data.scoreFormat === 'percentage') {
        if (num < 0 || num > 100) return 'Percentage must be between 0 and 100.';
      } else {
        if (num < 0 || num > 10) return 'CGPA must be between 0.0 and 10.0.';
      }
      return undefined;
    }

    case 'course':
      return data.course ? undefined : 'Select the course you are applying for.';

    case 'department':
      return data.department ? undefined : 'Select your preferred academic department.';

    case 'academicSession':
      return data.academicSession ? undefined : 'Select an academic session.';

    case 'studentPhoto':
      return data.studentPhoto ? undefined : 'Please upload a passport-size student photograph.';

    case 'previousMarksheet':
      return data.previousMarksheet ? undefined : 'Please upload your previous marksheet.';

    case 'studentIdProof':
      return data.studentIdProof ? undefined : 'Please upload a valid government or student ID proof.';

    case 'password': {
      const value = data.password;
      if (!value) return 'Create a portal account password.';
      const strength = evaluatePasswordStrength(value);
      if (!strength.checks.minLength) return 'Password must be at least 8 characters long.';
      if (!strength.checks.hasUppercase || !strength.checks.hasLowercase || !strength.checks.hasNumber) {
        return 'Include uppercase, lowercase, and at least one number.';
      }
      return undefined;
    }

    case 'confirmPassword': {
      if (!data.confirmPassword) return 'Please confirm your password.';
      if (data.confirmPassword !== data.password) return 'Passwords do not match.';
      return undefined;
    }

    case 'acceptTerms':
      return data.acceptTerms ? undefined : 'You must agree to the terms and declaration before submitting.';

    default:
      return undefined;
  }
}

/**
 * Validates every field belonging to a specific step.
 */
export function validateStep(step: RegistrationStep, data: StudentFormData): FormErrors {
  const errors: FormErrors = {};
  for (const field of STEP_FIELDS[step]) {
    const error = validateField(field, data);
    if (error) {
      errors[field] = error;
    }
  }
  return errors;
}

/**
 * Validates the entire form across all 3 steps.
 */
export function validateAllSteps(data: StudentFormData): FormErrors {
  return {
    ...validateStep(1, data),
    ...validateStep(2, data),
    ...validateStep(3, data),
  };
}

/**
 * Computes real-time completion percentage across all required fields (0–100).
 */
export function calculateCompletionPercentage(data: StudentFormData): number {
  let validCount = 0;
  for (const field of REQUIRED_COMPLETION_FIELDS) {
    if (!validateField(field, data)) {
      validCount += 1;
    }
  }
  return Math.round((validCount / REQUIRED_COMPLETION_FIELDS.length) * 100);
}

/**
 * Formats byte size into human-readable KB / MB labels.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Generates a unique, readable Student Registration ID such as SRP-2026-BT-49382.
 */
export function generateRegistrationId(courseName: string): string {
  const matched = ACADEMIC_PROGRAMS.find((program) => program.name === courseName);
  const courseCode = matched ? matched.code : 'GN';
  const year = new Date().getFullYear();
  const randomFive = Math.floor(10000 + Math.random() * 90000);
  return `SRP-${year}-${courseCode}-${randomFive}`;
}
