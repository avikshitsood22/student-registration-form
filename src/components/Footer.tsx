import { Clock, Mail, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  onOpenPrograms: () => void;
  onOpenGuidelines: () => void;
  onOpenTrackModal: () => void;
  onOpenTerms: () => void;
}

/**
 * Clean university footer with admissions contact details, quick portal links,
 * and copyright information.
 */
export function Footer({
  onOpenPrograms,
  onOpenGuidelines,
  onOpenTrackModal,
  onOpenTerms,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="support-footer" className="bg-[#0B1536] text-slate-300 no-print">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Column 1: Brand & Admissions Statement */}
          <div className="space-y-3">
            <h2 className="font-display text-lg font-bold text-white">
              Student Registration Portal
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              Centralized online enrollment desk for undergraduate, postgraduate, and doctoral
              admissions. Designed for fast verification and transparent application tracking.
            </p>
          </div>

          {/* Column 2: Quick Portal Actions */}
          <div>
            <h3 className="text-sm font-semibold text-white">Admissions Resources</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={onOpenPrograms}
                  className="cursor-pointer text-slate-300 hover:text-white transition-colors"
                >
                  Academic Programs Directory
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenGuidelines}
                  className="cursor-pointer text-slate-300 hover:text-white transition-colors"
                >
                  Document Upload Guidelines
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTrackModal}
                  className="cursor-pointer text-slate-300 hover:text-white transition-colors"
                >
                  Track Application Status
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTerms}
                  className="cursor-pointer text-slate-300 hover:text-white transition-colors"
                >
                  Terms &amp; Admissions Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Admissions Office Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-white">Admissions Help Desk</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
                <span>Admissions Block A, University Campus Road, Academic Enclave — 560001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
                <a
                  href="tel:+9118002026400"
                  className="font-mono text-xs sm:text-sm hover:text-white transition-colors tabular-nums"
                >
                  +91 1800-202-6400 (Toll Free)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
                <a
                  href="mailto:admissions@universityportal.edu"
                  className="hover:text-white transition-colors break-all"
                >
                  admissions@universityportal.edu
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
                <span>Mon – Sat · 9:00 AM to 6:00 PM IST</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>© {currentYear} Student Registration Portal · Office of University Admissions. All rights reserved.</p>
          <p>Online Enrollment System · Academic Year 2026–2027</p>
        </div>
      </div>
    </footer>
  );
}
