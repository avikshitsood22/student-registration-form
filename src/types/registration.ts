/**
 * Core data models for the Student Registration Portal.
 */

export type RegistrationStep = 1 | 2 | 3;

export type ScoreFormat = 'percentage' | 'cgpa';

export interface UploadedFileInfo {
  name: string;
  size: number;
  type: string;
  /** Data URL preview for student photographs or image documents */
  previewUrl?: string;
}

export interface StudentFormData {
  // Step 1: Personal Details
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  mobileNumber: string;
  alternateMobile: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  nationality: string;

  // Step 2: Academic Details
  previousSchool: string;
  lastQualification: string;
  passingYear: string;
  scoreFormat: ScoreFormat;
  scoreValue: string;
  course: string;
  department: string;
  academicSession: string;

  // Step 3: Documents & Confirmation
  studentPhoto: UploadedFileInfo | null;
  previousMarksheet: UploadedFileInfo | null;
  studentIdProof: UploadedFileInfo | null;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export type FormFieldName = keyof StudentFormData;

export type FormErrors = Partial<Record<FormFieldName, string>>;

export type TouchedFields = Partial<Record<FormFieldName, boolean>>;

export interface SubmittedRegistration {
  registrationId: string;
  submittedAt: string;
  data: Omit<StudentFormData, 'password' | 'confirmPassword'>;
}

export interface AcademicProgram {
  code: string;
  name: string;
  level: 'Undergraduate' | 'Postgraduate' | 'Doctoral';
  duration: string;
  eligibility: string;
  recommendedDepartments: string[];
}
