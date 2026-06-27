import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const socialLinks = [
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
      </svg>
    ),
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="heritage-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            {/* Logotype — matches header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full border-2 border-secondary flex items-center justify-center flex-shrink-0">
                <span className="font-heading font-bold text-secondary text-base leading-none">G</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading font-semibold text-[1.05rem] text-white tracking-[-0.01em]">
                  GaDangme&thinsp;<em className="not-italic text-secondary">Union</em>
                </span>
                <span className="font-body text-[9.5px] font-semibold uppercase tracking-[0.28em] text-white/45 mt-0.5">
                  The Netherlands
                </span>
              </div>
            </div>

            <p className="font-body text-[13.5px] text-primary-foreground/62 leading-[1.8]">
              A community union for persons of GaDangme origin and speakers of the
              Ga and Dangme languages, building a home away from home in the Netherlands since 2012.
            </p>

            <div className="flex gap-2.5 mt-7">
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-secondary hover:border-secondary hover:text-secondary-foreground transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-5 relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-8 after:h-0.5 after:bg-secondary">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-3 mt-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/carousel', label: 'Highlights' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-body text-sm text-primary-foreground/70 hover:text-secondary hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-secondary/50" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-5 relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-8 after:h-0.5 after:bg-secondary">
              Community
            </h4>
            <nav className="flex flex-col gap-3 mt-2">
              {['Annual BBQ Gatherings', 'Cultural Celebrations', 'Community Meetings', 'Member Support', 'Youth & Heritage'].map((item) => (
                <span
                  key={item}
                  className="font-body text-sm text-primary-foreground/70 inline-flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-secondary/50" />
                  {item}
                </span>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-5 relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-8 after:h-0.5 after:bg-secondary">
              Contact Us
            </h4>
            <div className="font-body text-sm text-primary-foreground/70 space-y-4 mt-2">
              <p className="flex items-start gap-3">
                <span className="text-secondary mt-0.5">📍</span>
                The Netherlands
              </p>
              <a href="mailto:pnyanyo@gmail.com" className="flex items-start gap-3 hover:text-secondary transition-colors">
                <Mail size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                pnyanyo@gmail.com
              </a>
            </div>

            {/* Ga Proverb */}
            <div className="mt-8 p-4 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10">
              <p className="font-heading text-sm italic text-secondary">
                "Ashiii Gɔnti sɛɛ aŋmɔɔ kpɔ"
              </p>
              <p className="font-body text-xs text-primary-foreground/50 mt-1">
                — Ga Proverb
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="heritage-container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-primary-foreground/50">
            © {currentYear} GaDangme Union – The Netherlands. All rights reserved.
          </p>
          <p className="font-body text-xs text-primary-foreground/40">
            Est. January 19, 2012
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
