import type { AcademicProgram, StudentFormData } from '../types/registration';

/**
 * Dropdown options and academic program catalog for the registration form.
 */

export const INITIAL_FORM_DATA: StudentFormData = {
  fullName: '',
  fatherName: '',
  motherName: '',
  dateOfBirth: '',
  gender: '',
  email: '',
  mobileNumber: '',
  alternateMobile: '',
  address: '',
  city: '',
  state: '',
  pinCode: '',
  nationality: 'Indian',

  previousSchool: '',
  lastQualification: '',
  passingYear: '',
  scoreFormat: 'percentage',
  scoreValue: '',
  course: '',
  department: '',
  academicSession: '2026–2027 (Fall Intake)',

  studentPhoto: null,
  previousMarksheet: null,
  studentIdProof: null,
  password: '',
  confirmPassword: '',
  acceptTerms: false,
};

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'] as const;

export const STATE_OPTIONS = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi (NCT)',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Chandigarh',
  'International / Outside India',
] as const;

export const NATIONALITY_OPTIONS = [
  'Indian',
  'American',
  'British',
  'Canadian',
  'Australian',
  'Singaporean',
  'Emirati',
  'German',
  'Nepalese',
  'Sri Lankan',
  'Other',
] as const;

export const QUALIFICATION_OPTIONS = [
  '10th / Secondary School Certificate',
  '12th / Senior Secondary (Science)',
  '12th / Senior Secondary (Commerce)',
  '12th / Senior Secondary (Humanities)',
  'Polytechnic / 3-Year Diploma',
  "Bachelor's Degree (B.Tech / B.Sc / B.A / B.Com / BBA)",
  "Master's Degree (M.Tech / M.Sc / MBA / MCA / M.A)",
] as const;

export const PASSING_YEAR_OPTIONS: string[] = Array.from(
  { length: 2026 - 1995 + 1 },
  (_, index) => String(2026 - index),
);

export const ACADEMIC_PROGRAMS: AcademicProgram[] = [
  {
    code: 'BT',
    name: 'B.Tech — Bachelor of Technology',
    level: 'Undergraduate',
    duration: '4 Years',
    eligibility: '12th Science (PCM) with minimum 60% aggregate',
    recommendedDepartments: [
      'Computer Science & Engineering',
      'Artificial Intelligence & Data Science',
      'Electronics & Communication',
      'Mechanical & Robotics Engineering',
      'Civil & Structural Engineering',
    ],
  },
  {
    code: 'BS',
    name: 'B.Sc (Hons) — Bachelor of Science',
    level: 'Undergraduate',
    duration: '3 Years',
    eligibility: '12th Science with minimum 55% aggregate',
    recommendedDepartments: [
      'Artificial Intelligence & Data Science',
      'Biotechnology & Life Sciences',
      'Physics & Applied Mathematics',
      'Computer Science & Engineering',
    ],
  },
  {
    code: 'BB',
    name: 'BBA — Bachelor of Business Administration',
    level: 'Undergraduate',
    duration: '3 Years',
    eligibility: '12th in any stream with minimum 55% aggregate',
    recommendedDepartments: [
      'Business Administration & Management',
      'Economics & Financial Studies',
    ],
  },
  {
    code: 'BC',
    name: 'B.Com (Hons) — Bachelor of Commerce',
    level: 'Undergraduate',
    duration: '3 Years',
    eligibility: '12th Commerce / Mathematics with minimum 55% aggregate',
    recommendedDepartments: [
      'Economics & Financial Studies',
      'Business Administration & Management',
    ],
  },
  {
    code: 'BA',
    name: 'B.A (Hons) — Bachelor of Arts',
    level: 'Undergraduate',
    duration: '3 Years',
    eligibility: '12th in any stream with minimum 50% aggregate',
    recommendedDepartments: [
      'Humanities & Public Policy',
      'Economics & Financial Studies',
      'Architecture & Urban Design',
    ],
  },
  {
    code: 'AR',
    name: 'B.Arch — Bachelor of Architecture',
    level: 'Undergraduate',
    duration: '5 Years',
    eligibility: '12th with Mathematics & valid design aptitude score',
    recommendedDepartments: [
      'Architecture & Urban Design',
      'Civil & Structural Engineering',
    ],
  },
  {
    code: 'MT',
    name: 'M.Tech — Master of Technology',
    level: 'Postgraduate',
    duration: '2 Years',
    eligibility: 'B.Tech / B.E. in relevant discipline with 60% or 6.5 CGPA',
    recommendedDepartments: [
      'Computer Science & Engineering',
      'Artificial Intelligence & Data Science',
      'Electronics & Communication',
      'Mechanical & Robotics Engineering',
    ],
  },
  {
    code: 'MS',
    name: 'M.Sc — Master of Science',
    level: 'Postgraduate',
    duration: '2 Years',
    eligibility: 'B.Sc in relevant discipline with minimum 55% aggregate',
    recommendedDepartments: [
      'Artificial Intelligence & Data Science',
      'Biotechnology & Life Sciences',
      'Physics & Applied Mathematics',
    ],
  },
  {
    code: 'MB',
    name: 'MBA — Master of Business Administration',
    level: 'Postgraduate',
    duration: '2 Years',
    eligibility: "Bachelor's degree in any discipline with minimum 55% aggregate",
    recommendedDepartments: [
      'Business Administration & Management',
      'Economics & Financial Studies',
    ],
  },
  {
    code: 'MC',
    name: 'MCA — Master of Computer Applications',
    level: 'Postgraduate',
    duration: '2 Years',
    eligibility: 'BCA / B.Sc (CS/IT) or graduation with Mathematics',
    recommendedDepartments: [
      'Computer Science & Engineering',
      'Artificial Intelligence & Data Science',
    ],
  },
  {
    code: 'PD',
    name: 'Ph.D — Doctor of Philosophy',
    level: 'Doctoral',
    duration: '3–5 Years',
    eligibility: "Master's degree with minimum 60% aggregate & research proposal",
    recommendedDepartments: [
      'Computer Science & Engineering',
      'Artificial Intelligence & Data Science',
      'Biotechnology & Life Sciences',
      'Physics & Applied Mathematics',
      'Economics & Financial Studies',
      'Humanities & Public Policy',
    ],
  },
];

export const DEPARTMENT_OPTIONS = [
  'Computer Science & Engineering',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication',
  'Mechanical & Robotics Engineering',
  'Civil & Structural Engineering',
  'Business Administration & Management',
  'Economics & Financial Studies',
  'Biotechnology & Life Sciences',
  'Physics & Applied Mathematics',
  'Architecture & Urban Design',
  'Humanities & Public Policy',
] as const;

export const ACADEMIC_SESSION_OPTIONS = [
  '2026–2027 (Fall Intake)',
  '2026–2027 (Spring Intake)',
  '2027–2028 (Fall Intake)',
  '2027–2028 (Spring Intake)',
] as const;
