import { GENDER_OPTIONS, NATIONALITY_OPTIONS, STATE_OPTIONS } from '../data/academicOptions';
import type {
  FormErrors,
  FormFieldName,
  StudentFormData,
  TouchedFields,
} from '../types/registration';
import { FormField, getInputClassName } from './FormField';

interface PersonalDetailsStepProps {
  data: StudentFormData;
  errors: FormErrors;
  touched: TouchedFields;
  onChange: <K extends FormFieldName>(field: K, value: StudentFormData[K]) => void;
  onBlur: (field: FormFieldName) => void;
}

/**
 * Step 1: Student Personal Details
 * Collects identity, parent details, contact channels, and residential address.
 */
export function PersonalDetailsStep({
  data,
  errors,
  touched,
  onChange,
  onBlur,
}: PersonalDetailsStepProps) {
  const isInvalid = (field: FormFieldName) => Boolean(touched[field] && errors[field]);
  const isValid = (field: FormFieldName) =>
    Boolean(touched[field] && !errors[field] && String(data[field] ?? '').trim().length > 0);

  return (
    <div className="space-y-8 animate-step-enter">
      {/* Section Heading */}
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B1536]">
          01. Personal &amp; Contact Information
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Enter your details exactly as they appear on your official academic transcripts and ID.
        </p>
      </div>

      {/* Subsection A: Student & Parent Identity */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-[#4C2EC4] pb-2 border-b border-slate-200/80">
          Student &amp; Family Details
        </h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FormField
            id="fullName"
            label="Full Name"
            required
            error={errors.fullName}
            touched={touched.fullName}
            hasValue={Boolean(data.fullName.trim())}
          >
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="e.g., Aarav Sharma"
              value={data.fullName}
              onChange={(e) => onChange('fullName', e.target.value)}
              onBlur={() => onBlur('fullName')}
              aria-invalid={isInvalid('fullName')}
              aria-describedby={isInvalid('fullName') ? 'fullName-error' : undefined}
              className={getInputClassName(isInvalid('fullName'), isValid('fullName'))}
            />
          </FormField>

          <FormField
            id="fatherName"
            label="Father's Name"
            required
            error={errors.fatherName}
            touched={touched.fatherName}
            hasValue={Boolean(data.fatherName.trim())}
          >
            <input
              id="fatherName"
              name="fatherName"
              type="text"
              placeholder="e.g., Rajesh Sharma"
              value={data.fatherName}
              onChange={(e) => onChange('fatherName', e.target.value)}
              onBlur={() => onBlur('fatherName')}
              aria-invalid={isInvalid('fatherName')}
              aria-describedby={isInvalid('fatherName') ? 'fatherName-error' : undefined}
              className={getInputClassName(isInvalid('fatherName'), isValid('fatherName'))}
            />
          </FormField>

          <FormField
            id="motherName"
            label="Mother's Name"
            required
            error={errors.motherName}
            touched={touched.motherName}
            hasValue={Boolean(data.motherName.trim())}
          >
            <input
              id="motherName"
              name="motherName"
              type="text"
              placeholder="e.g., Meera Sharma"
              value={data.motherName}
              onChange={(e) => onChange('motherName', e.target.value)}
              onBlur={() => onBlur('motherName')}
              aria-invalid={isInvalid('motherName')}
              aria-describedby={isInvalid('motherName') ? 'motherName-error' : undefined}
              className={getInputClassName(isInvalid('motherName'), isValid('motherName'))}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FormField
            id="dateOfBirth"
            label="Date of Birth"
            required
            error={errors.dateOfBirth}
            touched={touched.dateOfBirth}
            hasValue={Boolean(data.dateOfBirth)}
            hint="Applicant must be at least 14 years old."
          >
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              max={new Date().toISOString().split('T')[0]}
              value={data.dateOfBirth}
              onChange={(e) => onChange('dateOfBirth', e.target.value)}
              onBlur={() => onBlur('dateOfBirth')}
              aria-invalid={isInvalid('dateOfBirth')}
              aria-describedby={isInvalid('dateOfBirth') ? 'dateOfBirth-error' : undefined}
              className={getInputClassName(isInvalid('dateOfBirth'), isValid('dateOfBirth'))}
            />
          </FormField>

          <FormField
            id="gender"
            label="Gender"
            required
            error={errors.gender}
            touched={touched.gender}
            hasValue={Boolean(data.gender)}
          >
            <select
              id="gender"
              name="gender"
              value={data.gender}
              onChange={(e) => onChange('gender', e.target.value)}
              onBlur={() => onBlur('gender')}
              aria-invalid={isInvalid('gender')}
              aria-describedby={isInvalid('gender') ? 'gender-error' : undefined}
              className={getInputClassName(isInvalid('gender'), isValid('gender'))}
            >
              <option value="">Select gender</option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id="nationality"
            label="Nationality"
            required
            error={errors.nationality}
            touched={touched.nationality}
            hasValue={Boolean(data.nationality)}
          >
            <select
              id="nationality"
              name="nationality"
              value={data.nationality}
              onChange={(e) => onChange('nationality', e.target.value)}
              onBlur={() => onBlur('nationality')}
              aria-invalid={isInvalid('nationality')}
              aria-describedby={isInvalid('nationality') ? 'nationality-error' : undefined}
              className={getInputClassName(isInvalid('nationality'), isValid('nationality'))}
            >
              <option value="">Select nationality</option>
              {NATIONALITY_OPTIONS.map((nation) => (
                <option key={nation} value={nation}>
                  {nation}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </div>

      {/* Subsection B: Contact Information */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-[#4C2EC4] pb-2 border-b border-slate-200/80">
          Contact Details
        </h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FormField
            id="email"
            label="Email Address"
            required
            error={errors.email}
            touched={touched.email}
            hasValue={Boolean(data.email.trim())}
            hint="Confirmation ID & updates will be linked here."
          >
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="student@example.com"
              value={data.email}
              onChange={(e) => onChange('email', e.target.value)}
              onBlur={() => onBlur('email')}
              aria-invalid={isInvalid('email')}
              aria-describedby={isInvalid('email') ? 'email-error' : undefined}
              className={getInputClassName(isInvalid('email'), isValid('email'))}
            />
          </FormField>

          <FormField
            id="mobileNumber"
            label="Mobile Number"
            required
            error={errors.mobileNumber}
            touched={touched.mobileNumber}
            hasValue={Boolean(data.mobileNumber.trim())}
            hint="10-digit primary mobile number."
          >
            <input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="9876543210"
              value={data.mobileNumber}
              onChange={(e) => onChange('mobileNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
              onBlur={() => onBlur('mobileNumber')}
              aria-invalid={isInvalid('mobileNumber')}
              aria-describedby={isInvalid('mobileNumber') ? 'mobileNumber-error' : undefined}
              className={getInputClassName(
                isInvalid('mobileNumber'),
                isValid('mobileNumber'),
                'font-mono tabular-nums',
              )}
            />
          </FormField>

          <FormField
            id="alternateMobile"
            label="Alternate Mobile Number"
            optionalNote="Optional"
            error={errors.alternateMobile}
            touched={touched.alternateMobile}
            hasValue={Boolean(data.alternateMobile.trim())}
            hint="Parent or guardian emergency contact."
          >
            <input
              id="alternateMobile"
              name="alternateMobile"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="9123456789"
              value={data.alternateMobile}
              onChange={(e) =>
                onChange('alternateMobile', e.target.value.replace(/\D/g, '').slice(0, 10))
              }
              onBlur={() => onBlur('alternateMobile')}
              aria-invalid={isInvalid('alternateMobile')}
              aria-describedby={isInvalid('alternateMobile') ? 'alternateMobile-error' : undefined}
              className={getInputClassName(
                isInvalid('alternateMobile'),
                isValid('alternateMobile'),
                'font-mono tabular-nums',
              )}
            />
          </FormField>
        </div>
      </div>

      {/* Subsection C: Residential Address */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-[#4C2EC4] pb-2 border-b border-slate-200/80">
          Residential Address
        </h3>

        <FormField
          id="address"
          label="Complete Address"
          required
          error={errors.address}
          touched={touched.address}
          hasValue={Boolean(data.address.trim())}
        >
          <textarea
            id="address"
            name="address"
            rows={2}
            placeholder="House / Flat No., Building Name, Street, Locality / Landmark"
            value={data.address}
            onChange={(e) => onChange('address', e.target.value)}
            onBlur={() => onBlur('address')}
            aria-invalid={isInvalid('address')}
            aria-describedby={isInvalid('address') ? 'address-error' : undefined}
            className={getInputClassName(isInvalid('address'), isValid('address'), 'resize-y min-h-[76px]')}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FormField
            id="city"
            label="City"
            required
            error={errors.city}
            touched={touched.city}
            hasValue={Boolean(data.city.trim())}
          >
            <input
              id="city"
              name="city"
              type="text"
              autoComplete="address-level2"
              placeholder="e.g., Bengaluru"
              value={data.city}
              onChange={(e) => onChange('city', e.target.value)}
              onBlur={() => onBlur('city')}
              aria-invalid={isInvalid('city')}
              aria-describedby={isInvalid('city') ? 'city-error' : undefined}
              className={getInputClassName(isInvalid('city'), isValid('city'))}
            />
          </FormField>

          <FormField
            id="state"
            label="State / Region"
            required
            error={errors.state}
            touched={touched.state}
            hasValue={Boolean(data.state)}
          >
            <select
              id="state"
              name="state"
              value={data.state}
              onChange={(e) => onChange('state', e.target.value)}
              onBlur={() => onBlur('state')}
              aria-invalid={isInvalid('state')}
              aria-describedby={isInvalid('state') ? 'state-error' : undefined}
              className={getInputClassName(isInvalid('state'), isValid('state'))}
            >
              <option value="">Select state</option>
              {STATE_OPTIONS.map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id="pinCode"
            label="PIN Code"
            required
            error={errors.pinCode}
            touched={touched.pinCode}
            hasValue={Boolean(data.pinCode.trim())}
            hint="6-digit postal index number."
          >
            <input
              id="pinCode"
              name="pinCode"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="560001"
              value={data.pinCode}
              onChange={(e) => onChange('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
              onBlur={() => onBlur('pinCode')}
              aria-invalid={isInvalid('pinCode')}
              aria-describedby={isInvalid('pinCode') ? 'pinCode-error' : undefined}
              className={getInputClassName(
                isInvalid('pinCode'),
                isValid('pinCode'),
                'font-mono tabular-nums',
              )}
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
