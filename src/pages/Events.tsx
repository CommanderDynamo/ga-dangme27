import { motion } from 'framer-motion';
import { Calendar, MapPin, Phone, CalendarPlus } from 'lucide-react';
import Layout from '@/components/Layout';
import eventPoster from '../assets/Event Poster.jpg';

const communities = [
  'Amsterdam', 'Almere', 'Denhaag', 'Eindhoven',
  'Enschede', 'Rotterdam', 'Tilburg', 'Utrecht',
];

const contactNumbers = [
  { raw: '+31613603026', display: '+31 6 13603026' },
  { raw: '+31615326643', display: '+31 6 15326643' },
];

const calendarUrl =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  `&text=${encodeURIComponent('HOMOWO Festival – GaDangme Netherlands')}` +
  '&dates=20260919/20260920' +
  `&details=${encodeURIComponent('Come and celebrate HOMOWO Festival with GaDangme Netherlands in Amsterdam.')}` +
  `&location=${encodeURIComponent('Amsterdam, The Netherlands')}`;

const Events = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden pt-32 pb-20 md:pt-40 md:pb-24">
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
              Save The Date
            </span>
            <h1 className="heritage-heading text-primary-foreground mb-6 text-4xl md:text-6xl">
              Upcoming Events
            </h1>
            <p className="heritage-text text-primary-foreground/80 text-lg max-w-xl">
              Join us for our next community gathering — celebrating culture,
              food, and fellowship with the GaDangme family across the Netherlands.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Event Detail */}
      <section className="heritage-section bg-background">
        <div className="heritage-container">
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
                src={eventPoster}
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
                <span className="section-eyebrow">Community Celebration</span>
              </div>
              <h2 className="heritage-heading text-foreground text-3xl md:text-4xl mb-4">
                HOMOWO Festival
              </h2>
              <p className="heritage-text text-muted-foreground mb-8">
                Come and celebrate HOMOWO Festival with us in Amsterdam. Meet
                GaDangmes from across the Netherlands as we honour our heritage
                together.
              </p>

              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-foreground mb-0.5">Date</h3>
                    <p className="font-body text-sm text-muted-foreground">Saturday, 19 September 2026</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-foreground mb-0.5">Location</h3>
                    <p className="font-body text-sm text-muted-foreground">Amsterdam, The Netherlands</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-foreground mb-0.5">Contact</h3>
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
                <h3 className="font-heading text-base font-semibold text-foreground mb-3">
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

              <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="btn-heritage-gold">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Add to Calendar
              </a>
            </motion.div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;
