import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home',       path: '/' },
  { name: 'About',      path: '/about' },
  { name: 'Highlights', path: '/carousel' },
  { name: 'Gallery',    path: '/gallery' },
  { name: 'Contact Us', path: '/contact' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-primary/[0.97] backdrop-blur-xl shadow-elevated py-0'
          : 'bg-gradient-to-b from-[#061a1a]/70 to-transparent py-1'
      }`}
    >
      <nav className="heritage-container">
        <div className="flex items-center justify-between h-16 md:h-[72px]">

          {/* ── Logo / Wordmark ──────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-3.5 group" aria-label="GaDangme Union home">
            {/* Monogram emblem */}
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full border-2 border-secondary flex items-center justify-center transition-all duration-300 group-hover:bg-secondary/15">
                <span className="font-heading font-bold text-secondary text-base leading-none">G</span>
              </div>
              {/* Pulse ring on hover */}
              <div className="absolute inset-0 rounded-full border border-secondary/30 scale-100 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500" />
            </div>

            {/* Text wordmark */}
            <div className="flex flex-col leading-none">
              <span className="font-heading font-semibold text-[1.05rem] text-white tracking-[-0.01em] leading-tight">
                GaDangme&thinsp;<em className="not-italic text-secondary">Union</em>
              </span>
              <span className="font-body text-[9.5px] font-semibold uppercase tracking-[0.28em] text-white/50 mt-0.5">
                The Netherlands
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ──────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const isContact = link.path === '/contact';
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 font-body text-[13.5px] font-semibold tracking-wide rounded-md transition-all duration-200 ${
                    isContact
                      ? isActive
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-secondary/15 text-secondary border border-secondary/30 hover:bg-secondary hover:text-secondary-foreground'
                      : isActive
                      ? 'text-secondary'
                      : 'text-white/75 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                  {/* Active underline for non-contact links */}
                  {isActive && !isContact && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-secondary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Mobile menu toggle ───────────────────────────────── */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white rounded-md hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile menu panel ───────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-primary/[0.97] backdrop-blur-xl border-t border-white/8"
          >
            <div className="heritage-container py-5">
              <div className="flex flex-col gap-0.5">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.07 }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center py-3 px-4 rounded-lg font-body text-[15px] font-semibold transition-all duration-200 ${
                        location.pathname === link.path
                          ? 'text-secondary bg-secondary/12'
                          : 'text-white/75 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {location.pathname === link.path && (
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-3 flex-shrink-0" />
                      )}
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
