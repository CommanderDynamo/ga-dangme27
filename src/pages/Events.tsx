import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar, MapPin, Phone, CalendarPlus, CalendarClock, ArrowRight, History,
} from 'lucide-react';
import Layout from '@/components/Layout';
import { usePageMeta } from '@/hooks/use-page-meta';
import { albums, type Album } from './Gallery';
import eventPoster from '../assets/Event Poster.jpg';

// ─── Event status ───────────────────────────────────────────────────────────

type EventStatus = 'past' | 'current' | 'upcoming';

const getEventStatus = (startDate: string, endDate?: string): EventStatus => {
  const now = new Date();
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate ?? startDate}T23:59:59`);
  if (now > end) return 'past';
  if (now >= start) return 'current';
  return 'upcoming';
};

// ─── Data ────────────────────────────────────────────────────────────────────

const communities = [
  'Amsterdam', 'Almere', 'Denhaag', 'Eindhoven',
  'Enschede', 'Rotterdam', 'Tilburg', 'Utrecht',
];

const contactNumbers = [
  { raw: '+31613603026', display: '+31 6 13603026' },
  { raw: '+31615326643', display: '+31 6 15326643' },
];

const featuredEvent = {
  id: 'homowo-2026',
  title: 'HOMOWO Festival',
  dateLabel: 'Saturday, 19 September 2026',
  startDate: '2026-09-19',
  location: 'Amsterdam, The Netherlands',
  description:
    'Come and celebrate HOMOWO Festival with us in Amsterdam. Meet GaDangmes from across the Netherlands as we honour our heritage together.',
  image: eventPoster,
};

const featuredStatus = getEventStatus(featuredEvent.startDate);

const calendarUrl =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  `&text=${encodeURIComponent('HOMOWO Festival – GaDangme Netherlands')}` +
  '&dates=20260919/20260920' +
  `&details=${encodeURIComponent('Come and celebrate HOMOWO Festival with GaDangme Netherlands in Amsterdam.')}` +
  `&location=${encodeURIComponent('Amsterdam, The Netherlands')}`;

// Curated real highlights from the Gallery — no invented events, only ones we have actual coverage of.
const pastHighlightIds = ['2012-bbq', '2013-bbq', '5th-anniversary-thanksgiving', '2018-atadaan'];
const pastHighlights = pastHighlightIds
  .map((id) => albums.find((a) => a.id === id))
  .filter((a): a is Album => Boolean(a));

const albumDateLabel = (subtitle: string) => subtitle.split('·').pop()?.trim() ?? subtitle;

// ─── Small building blocks ──────────────────────────────────────────────────

const SectionNav = () => (
  <div className="sticky top-16 md:top-[72px] z-30 bg-background/95 backdrop-blur-sm border-b border-border/70">
    <div className="heritage-container">
      <nav className="flex gap-2 py-3.5 overflow-x-auto scrollbar-hide" aria-label="Event categories">
        {[
          { href: '#upcoming', label: 'Upcoming' },
          { href: '#current', label: 'Current' },
          { href: '#past', label: 'Past' },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="shrink-0 px-4 py-2 rounded-full font-body text-sm font-semibold text-muted-foreground border border-border hover:border-primary hover:text-primary transition-colors duration-200"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  </div>
);

const EmptyState = ({
  icon: Icon, title, body, ctaLabel, ctaHref,
}: { icon: typeof CalendarClock; title: string; body: string; ctaLabel: string; ctaHref: string }) => (
  <div className="text-center py-16 px-6 bg-heritage-warm rounded-2xl border-2 border-dashed border-border">
    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="font-subheading text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="font-body text-sm text-muted-foreground max-w-md mx-auto mb-7 leading-relaxed">{body}</p>
    <a href={ctaHref} className="btn-heritage-outline">{ctaLabel}</a>
  </div>
);

const FeaturedEventCard = ({ live }: { live: boolean }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
    {/* Poster */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl overflow-hidden shadow-elevated border border-border/60 mx-auto max-w-md lg:max-w-full"
    >
      <img
        src={featuredEvent.image}
        alt="HOMOWO Festival 2026 — GaDangme Netherlands event poster, Saturday 19 September 2026 in Amsterdam"
        className="w-full h-auto"
      />
    </motion.div>

    {/* Details */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="amber-rule" />
        <span className="section-eyebrow">{live ? 'Happening Now' : 'Community Celebration'}</span>
      </div>
      <h2 className="heritage-heading text-foreground text-3xl md:text-4xl mb-4">
        {featuredEvent.title}
      </h2>
      <p className="heritage-text text-muted-foreground mb-8">{featuredEvent.description}</p>

      <div className="space-y-5 mb-8">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 flex-shrink-0">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-subheading text-base font-semibold text-foreground mb-0.5">Date</h3>
            <p className="font-body text-sm text-muted-foreground">{featuredEvent.dateLabel}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 flex-shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-subheading text-base font-semibold text-foreground mb-0.5">Location</h3>
            <p className="font-body text-sm text-muted-foreground">{featuredEvent.location}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 flex-shrink-0">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-subheading text-base font-semibold text-foreground mb-0.5">Contact</h3>
            <div className="flex flex-col gap-0.5">
              {contactNumbers.map(({ raw, display }) => (
                <a
                  key={raw}
                  href={`tel:${raw}`}
                  className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {display}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-9">
        <h3 className="font-subheading text-base font-semibold text-foreground mb-3">
          Come meet the GaDangmes from across the Netherlands
        </h3>
        <div className="flex flex-wrap gap-2">
          {communities.map((c) => (
            <span
              key={c}
              className="px-3 py-1.5 rounded-full bg-heritage-warm border border-border font-body text-xs font-semibold text-foreground"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {!live && (
        <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="btn-heritage-gold">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Add to Calendar
        </a>
      )}
    </motion.div>
  </div>
);

// ─── Page ────────────────────────────────────────────────────────────────────

const Events = () => {
  usePageMeta({
    title: 'Events',
    description: 'Save the date: HOMOWO Festival with GaDangme Netherlands, Saturday 19 September 2026 in Amsterdam.',
    image: '/og-events-poster.jpg',
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#071a0c]/50 via-primary to-primary" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-secondary/55 to-transparent" />
        <div className="relative heritage-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 mb-4 bg-secondary/20 text-secondary rounded-full font-body text-sm border border-secondary/30">
              Community Calendar
            </span>
            <h1 className="heritage-heading text-primary-foreground mb-6 text-4xl md:text-6xl">
              Events
            </h1>
            <p className="heritage-text text-primary-foreground/80 text-lg max-w-xl">
              What's next, what's happening now, and a look back at the celebrations
              that built our community across the Netherlands.
            </p>
          </motion.div>
        </div>
      </section>

      <SectionNav />

      {/* Upcoming */}
      <section id="upcoming" className="heritage-section bg-background scroll-mt-32">
        <div className="heritage-container">
          <div className="flex items-center gap-3 mb-10">
            <span className="amber-rule" />
            <span className="section-eyebrow">Upcoming Events</span>
          </div>

          {featuredStatus === 'upcoming' ? (
            <FeaturedEventCard live={false} />
          ) : (
            <EmptyState
              icon={CalendarClock}
              title="No Upcoming Events Scheduled"
              body="We don't have a future event on the calendar just yet. Check back soon, or browse our past celebrations below."
              ctaLabel="View Past Events"
              ctaHref="#past"
            />
          )}
        </div>
      </section>

      {/* Current */}
      <section id="current" className="heritage-section bg-heritage-warm scroll-mt-32">
        <div className="heritage-container">
          <div className="flex items-center gap-3 mb-10">
            <span className="amber-rule" />
            <span className="section-eyebrow">Current Events</span>
          </div>

          {featuredStatus === 'current' ? (
            <FeaturedEventCard live />
          ) : (
            <EmptyState
              icon={CalendarClock}
              title="No Events In Progress"
              body="Nothing is running at this exact moment. See what's coming up next, or browse our past celebrations below."
              ctaLabel="View Upcoming Events"
              ctaHref="#upcoming"
            />
          )}
        </div>
      </section>

      {/* Past */}
      <section id="past" className="heritage-section bg-background scroll-mt-32">
        <div className="heritage-container">
          <div className="flex items-center gap-3 mb-10">
            <span className="amber-rule" />
            <span className="section-eyebrow">Past Events</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {featuredStatus === 'past' && (
              <Link to="/gallery" className="card-heritage group block">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <p className="font-body text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
                    {featuredEvent.dateLabel}
                  </p>
                  <h3 className="font-subheading text-base font-semibold text-foreground mb-2">
                    {featuredEvent.title}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold">
                    View in Gallery <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            )}

            {pastHighlights.map((album) => (
              <Link key={album.id} to="/gallery" className="card-heritage group block">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <p className="font-body text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
                    {albumDateLabel(album.subtitle)}
                  </p>
                  <h3 className="font-subheading text-base font-semibold text-foreground mb-2">
                    {album.title}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold">
                    View in Gallery <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <History className="w-4 h-4 text-secondary" />
            <p className="font-body text-sm text-muted-foreground">
              This is a small selection — every celebration we've documented lives in the full gallery.
            </p>
          </div>

          <Link to="/gallery" className="btn-heritage-outline group">
            Browse Full Gallery
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Events;
