import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onOpenPrograms: () => void;
  onOpenGuidelines: () => void;
  onOpenTrackModal: () => void;
  onNavigateForm: () => void;
}

/**
 * Responsive university navigation bar following a balanced three-zone layout:
 * Brand identity, concise navigation links, and a single primary action.
 */
export function Navbar({
  onOpenPrograms,
  onOpenGuidelines,
  onOpenTrackModal,
  onNavigateForm,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileAction = (callback: () => void) => {
    setMobileMenuOpen(false);
    callback();
  };

  return (
    <header className="glass-nav sticky top-0 z-40 no-print">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: University Crest Logo + Single-Line Portal Title */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#5B3CE0] to-[#3B21A8] shadow-md shadow-[#5B3CE0]/30 shrink-0"
            aria-hidden="true"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3L2.5 8L12 13L21.5 8L12 3Z"
                stroke="white"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M6 10.5V16.2C6 17.8 8.7 19.5 12 19.5C15.3 19.5 18 17.8 18 16.2V10.5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M21.5 8V14.5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="font-display text-base sm:text-lg font-bold tracking-tight text-white">
            Student Registration Portal
          </span>
        </a>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-200"
        >
          <button
            type="button"
            onClick={onNavigateForm}
            className="cursor-pointer py-1 text-slate-200 hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-purple-400 after:transition-all after:duration-150 hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
          >
            Registration
          </button>
          <button
            type="button"
            onClick={onOpenPrograms}
            className="cursor-pointer py-1 text-slate-200 hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-purple-400 after:transition-all after:duration-150 hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
          >
            Programs
          </button>
          <button
            type="button"
            onClick={onOpenGuidelines}
            className="cursor-pointer py-1 text-slate-200 hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-purple-400 after:transition-all after:duration-150 hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
          >
            Guidelines
          </button>
          <a
            href="#support-footer"
            className="py-1 text-slate-200 hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-purple-400 after:transition-all after:duration-150 hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
          >
            Support
          </a>
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenTrackModal}
            className="hidden sm:inline-flex cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-[#5B3CE0] to-[#7255F0] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#5B3CE0]/25 transition-all duration-150 hover:brightness-110 active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Track Application
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex md:hidden h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0B1536]/98 px-4 py-4 animate-step-enter">
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => handleMobileAction(onNavigateForm)}
              className="flex h-11 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-100 hover:bg-white/10 transition-colors"
            >
              Registration Form
            </button>
            <button
              type="button"
              onClick={() => handleMobileAction(onOpenPrograms)}
              className="flex h-11 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-100 hover:bg-white/10 transition-colors"
            >
              Academic Programs
            </button>
            <button
              type="button"
              onClick={() => handleMobileAction(onOpenGuidelines)}
              className="flex h-11 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-100 hover:bg-white/10 transition-colors"
            >
              Admission Guidelines
            </button>
            <a
              href="#support-footer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-11 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-100 hover:bg-white/10 transition-colors"
            >
              Help Desk &amp; Support
            </a>
            <div className="mt-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => handleMobileAction(onOpenTrackModal)}
                className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#5B3CE0] to-[#7255F0] px-4 text-sm font-semibold text-white shadow-sm"
              >
                Track Application
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
