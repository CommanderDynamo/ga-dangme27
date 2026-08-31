import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import eventPoster from '../assets/Event Poster.jpg';

const SPLASH_SESSION_KEY = 'gadangme-event-splash-shown';
const AUTO_DISMISS_MS = 6000;

const EventSplash = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Only the homepage — landing directly on /contact, /events, etc.
    // (a bookmark, a shared link, a refresh) should never surface this.
    if (pathname !== '/') return;

    let alreadyShown = true;
    try {
      alreadyShown = sessionStorage.getItem(SPLASH_SESSION_KEY) === '1';
    } catch {
      // sessionStorage unavailable (private mode, etc.) — just skip the splash
      return;
    }
    if (alreadyShown) return;

    setVisible(true);
    try {
      sessionStorage.setItem(SPLASH_SESSION_KEY, '1');
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [visible]);

  const dismiss = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), 400);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-5 bg-[#071a0c]/92 backdrop-blur-sm transition-opacity duration-400 ${
        closing ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-splash-flash'
      }`}
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Upcoming event announcement"
    >
      <div
        className={`relative flex flex-col items-center gap-5 max-w-sm w-full transition-transform duration-400 ${
          closing ? 'scale-95' : 'scale-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shadow-elevated hover:bg-secondary/90 transition-colors z-10"
        >
          <X size={18} />
        </button>

        <img
          src={eventPoster}
          alt="Save the date — HOMOWO Festival, Saturday 19 September 2026, in Amsterdam"
          className="w-full max-h-[70vh] object-contain rounded-2xl shadow-elevated border border-white/10"
        />

        <div className="flex items-center gap-4">
          <Link to="/events" onClick={dismiss} className="btn-heritage-gold text-sm">
            View Event Details
          </Link>
          <button
            onClick={dismiss}
            className="font-body text-xs text-white/55 hover:text-white/80 uppercase tracking-widest transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventSplash;
