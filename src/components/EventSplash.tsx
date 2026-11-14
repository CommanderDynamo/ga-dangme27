import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import eventPoster from '../assets/Event Poster.jpg';

const CLOSE_ANIMATION_MS = 300;

// Optional: stop showing the splash after this date (e.g. new Date('2026-09-20T00:00:00')).
// null = always show.
const HIDE_AFTER: Date | null = null;

const POSTER_ALT = 'Save the date — HOMOWO Festival, Saturday 19 September 2026, in Amsterdam';

// Lives in memory, so it resets on every refresh / new visit, but survives
// in-app navigation. That means: refresh the homepage -> splash shows again;
// click around the site and come back to Home -> it doesn't pop up again.
let shownThisPageLoad = false;

const EventSplash = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const dismiss = useCallback(() => {
    setClosing(true);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setVisible(false), CLOSE_ANIMATION_MS);
  }, []);

  // Decide once, when the page first loads, whether to show the splash.
  useEffect(() => {
    // Homepage only: landing on /contact, /events etc. never shows it.
    if (pathname !== '/') return;
    if (HIDE_AFTER && new Date() >= HIDE_AFTER) return;
    if (shownThisPageLoad) return;

    shownThisPageLoad = true;
    setVisible(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While open: Esc closes, the page behind doesn't scroll, focus starts on Close.
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [visible, dismiss]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  if (!visible) return null;

  return (
    // Tapping anywhere on the dark background closes it.
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#071a0c]/90 p-5 backdrop-blur-sm transition-opacity duration-300 ${
        closing ? 'pointer-events-none opacity-0' : 'animate-splash-flash opacity-100'
      }`}
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Upcoming event announcement"
    >
      {/* Close button: pinned to the top-right of the screen so it's always easy to find */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={dismiss}
        aria-label="Close announcement"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-elevated transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-[#071a0c]"
      >
        <X size={22} />
      </button>

      <div className="flex w-full max-w-sm flex-col items-center gap-5">
        {/* Taps on the poster and buttons don't close it; everything else does. */}
        <img
          src={eventPoster}
          alt={POSTER_ALT}
          onClick={(e) => e.stopPropagation()}
          className={`max-h-[70vh] w-full rounded-2xl border border-white/10 object-contain shadow-elevated transition-transform duration-300 ${
            closing ? 'scale-95' : 'scale-100'
          }`}
        />

        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
          <Link to="/events" onClick={dismiss} className="btn-heritage-gold text-sm">
            View Event Details
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="font-body text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventSplash;