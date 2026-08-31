import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar, MapPin, Phone, CalendarPlus, CalendarClock, ArrowRight, History, CheckCircle2, Loader2,
} from 'lucide-react';
import Layout from '@/components/Layout';
import { usePageMeta } from '@/hooks/use-page-meta';
import { useEvents, getEventStatus, FALLBACK_EVENT, type EventRow } from '@/hooks/use-events';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { albums, type Album } from './Gallery';

// ─── Event status ───────────────────────────────────────────────────────────

const formatDateLabel = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

const buildCalendarUrl = (event: EventRow) => {
  const start = event.start_date.replace(/-/g, '');
  const endDate = new Date(`${event.end_date ?? event.start_date}T00:00:00`);
  endDate.setDate(endDate.getDate() + 1); // Google Calendar's all-day end date is exclusive
  const end = endDate.toISOString().slice(0, 10).replace(/-/g, '');
  return (
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(`${event.title} – GaDangme Netherlands`)}` +
    `&dates=${start}/${end}` +
    `&details=${encodeURIComponent(event.description ?? '')}` +
    `&location=${encodeURIComponent(event.location ?? '')}`
  );
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

const RsvpForm = ({ eventId }: { eventId: string }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setSubmitting(true);
    const { error } = await supabase
      .from('rsvps')
      .insert({ event_id: eventId, name: name.trim(), email: email.trim(), guest_count: guestCount });
    setSubmitting(false);

    if (error) {
      toast({
        title: 'Could not submit RSVP',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-5 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-subheading text-sm font-semibold text-foreground">You're on the list!</p>
          <p className="font-body text-xs text-muted-foreground mt-0.5">We can't wait to see you there.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 rounded-xl bg-heritage-warm border border-border space-y-3">
      <h3 className="font-subheading text-base font-semibold text-foreground">RSVP for this event</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          required
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-heritage"
        />
        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-heritage"
        />
      </div>
      <div className="flex items-center gap-3">
        <label htmlFor="guest-count" className="font-body text-sm text-muted-foreground shrink-0">
          Guests (incl. you)
        </label>
        <input
          id="guest-count"
          type="number"
          min={1}
          max={20}
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
          className="input-heritage w-20"
        />
      </div>
      <button type="submit" disabled={submitting} className="btn-heritage-gold w-full sm:w-auto disabled:opacity-60">
        {submitting ? 'Submitting…' : 'RSVP'}
      </button>
    </form>
  );
};

const FeaturedEventCard = ({ event, live }: { event: EventRow; live: boolean }) => (
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
        src={event.poster_url ?? '/og-events-poster.jpg'}
        alt={`${event.title} — ${formatDateLabel(event.start_date)}${event.location ? `, ${event.location}` : ''}`}
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
        {event.title}
      </h2>
      {event.description && (
        <p className="heritage-text text-muted-foreground mb-8">{event.description}</p>
      )}

      <div className="space-y-5 mb-8">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 flex-shrink-0">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-subheading text-base font-semibold text-foreground mb-0.5">Date</h3>
            <p className="font-body text-sm text-muted-foreground">{formatDateLabel(event.start_date)}</p>
          </div>
        </div>

        {event.location && (
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 flex-shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-subheading text-base font-semibold text-foreground mb-0.5">Location</h3>
              <p className="font-body text-sm text-muted-foreground">{event.location}</p>
            </div>
          </div>
        )}

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
        <a href={buildCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className="btn-heritage-gold mb-9 inline-flex">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Add to Calendar
        </a>
      )}

      {/* RSVPs only make sense for real, database-backed events */}
      {event.id && <RsvpForm eventId={event.id} />}
    </motion.div>
  </div>
);

const PastEventCard = ({ title, dateLabel, image }: { title: string; dateLabel: string; image: string }) => (
  <Link to="/gallery" className="card-heritage group block">
    <div className="aspect-[4/3] overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <div className="p-5">
      <p className="font-body text-xs font-semibold uppercase tracking-wide text-secondary mb-1">{dateLabel}</p>
      <h3 className="font-subheading text-base font-semibold text-foreground mb-2">{title}</h3>
      <span className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold">
        View in Gallery <ArrowRight size={14} />
      </span>
    </div>
  </Link>
);

// ─── Page ────────────────────────────────────────────────────────────────────

const Events = () => {
  usePageMeta({
    title: 'Events',
    description: 'Save the date: HOMOWO Festival with GaDangme Netherlands, Saturday 19 September 2026 in Amsterdam.',
    image: '/og-events-poster.jpg',
  });

  const { events, loading, error } = useEvents();

  // Fall back to the static event if the table isn't set up yet or is empty,
  // so the page never looks broken while the migration hasn't been run.
  const sourceEvents = !loading && (error || events.length === 0) ? [FALLBACK_EVENT] : events;

  const upcomingEvents = sourceEvents.filter((e) => getEventStatus(e.start_date, e.end_date) === 'upcoming');
  const currentEvents = sourceEvents.filter((e) => getEventStatus(e.start_date, e.end_date) === 'current');
  const pastDbEvents = sourceEvents.filter((e) => getEventStatus(e.start_date, e.end_date) === 'past');

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

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-body text-sm">Loading events…</span>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="space-y-16">
              {upcomingEvents.map((event) => (
                <FeaturedEventCard key={event.id || event.title} event={event} live={false} />
              ))}
            </div>
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

          {!loading && currentEvents.length > 0 ? (
            <div className="space-y-16">
              {currentEvents.map((event) => (
                <FeaturedEventCard key={event.id || event.title} event={event} live />
              ))}
            </div>
          ) : !loading ? (
            <EmptyState
              icon={CalendarClock}
              title="No Events In Progress"
              body="Nothing is running at this exact moment. See what's coming up next, or browse our past celebrations below."
              ctaLabel="View Upcoming Events"
              ctaHref="#upcoming"
            />
          ) : null}
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
            {pastDbEvents.map((event) => (
              <PastEventCard
                key={event.id || event.title}
                title={event.title}
                dateLabel={formatDateLabel(event.start_date)}
                image={event.poster_url ?? '/og-events-poster.jpg'}
              />
            ))}

            {pastHighlights.map((album) => (
              <PastEventCard
                key={album.id}
                title={album.title}
                dateLabel={albumDateLabel(album.subtitle)}
                image={album.coverImage}
              />
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
