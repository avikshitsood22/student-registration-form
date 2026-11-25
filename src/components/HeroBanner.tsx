import { useState } from 'react';

const HERO_IMAGE_PATH = '/src/assets/images/university_campus_hero_1795581004748.jpg';

/**
 * Institutional admissions hero banner pairing our architectural campus photograph
 * with a deep navy-purple atmospheric scrim and clean editorial metadata.
 */
export function HeroBanner() {
  const [imageError, setImageError] = useState(false);

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[#0B1536] text-white no-print"
    >
      {/* Background Campus Photograph + Fallback Architectural Gradient */}
      <div className="absolute inset-0">
        {!imageError ? (
          <img
            src={HERO_IMAGE_PATH}
            alt="Illuminated university academic hall and glass library courtyard at twilight"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover object-center opacity-45"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#070E26] via-[#13204A] to-[#3B21A8]" />
        )}
        {/* Measured high-contrast scrim ensuring WCAG AA readability across all widths */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070E26]/95 via-[#0B1536]/82 to-[#2B176E]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1536] via-transparent to-[#070E26]/40" />
      </div>

      {/* Subtle Ambient Floating Decorative Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[10%] h-72 w-72 rounded-full bg-[#5B3CE0]/25 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-[8%] h-64 w-64 rounded-full bg-[#38BDF8]/15 blur-3xl animate-float-delayed"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-24 sm:px-6 sm:pt-16 sm:pb-28 lg:px-8">
        <div className="max-w-3xl">
          {/* Clean Unboxed Institutional Metadata Line (Zero-Pill Discipline) */}
          <p className="text-xs sm:text-sm font-medium tracking-wide text-purple-200/95">
            Office of Admissions
            <span className="mx-2 text-white/40" aria-hidden="true">
              ·
            </span>
            Academic Session 2026–2027
            <span className="mx-2 text-white/40" aria-hidden="true">
              ·
            </span>
            Online Enrollment Open
          </p>

          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-[1.15]">
            Begin Your Academic Journey With Seamless Online Registration
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200/90 sm:text-lg">
            Complete the three-step admission form below with your personal details, academic
            records, and verified documents to receive your official Student Registration ID
            immediately upon submission.
          </p>

          {/* Key Institutional Facts Strip (Unboxed Typography) */}
          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-white/15 pt-6 sm:grid-cols-3 max-w-2xl">
            <div>
              <dt className="text-xs font-medium text-slate-300">Application Process</dt>
              <dd className="mt-1 font-display text-lg font-semibold text-white tabular-nums">
                3 Guided Steps
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-300">Document Verification</dt>
              <dd className="mt-1 font-display text-lg font-semibold text-white">
                Instant Upload
              </dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-xs font-medium text-slate-300">Confirmation Slip</dt>
              <dd className="mt-1 font-display text-lg font-semibold text-white">
                Unique Student ID
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
