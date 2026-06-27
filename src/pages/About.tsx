import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Heart, Globe, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const _annMods = import.meta.glob(
  '../assets/5TH ANNIVERSARY THANKSGIVING SERVICE/*.JPG',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

const _ann5Mods = import.meta.glob(
  '../assets/5TH ANNIVERSARY/*.JPG',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

const ann = Object.keys(_annMods).sort().map((k) => _annMods[k]);
const ann5 = Object.keys(_ann5Mods).sort().map((k) => _ann5Mods[k]);

// ─── Fading card used in Community Life ──────────────────────────────────────

const FadingCard = ({
  photos,
  title,
  description,
  index,
}: {
  photos: string[];
  title: string;
  description: string;
  index: number;
}) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % photos.length), 2500);
    return () => clearInterval(t);
  }, [photos.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-elevated"
    >
      {photos.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === idx ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-heritage-dark via-heritage-dark/30 to-transparent" />

      {/* Progress dots */}
      <div className="absolute top-4 right-4 flex gap-1 z-10">
        {photos.map((_, i) => (
          <span
            key={i}
            className={`block rounded-full transition-all duration-500 ${
              i === idx ? 'w-4 h-1.5 bg-secondary' : 'w-1.5 h-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <h3 className="font-heading text-xl text-primary-foreground font-semibold mb-2">
          {title}
        </h3>
        <p className="font-body text-sm text-primary-foreground/75 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// ─── Static data ──────────────────────────────────────────────────────────────

const milestones = [
  {
    year: 'Dec 2011',
    event:
      'A founding member of the community passed, galvanising the GaDangme community in the Netherlands to unite and support one another.',
  },
  {
    year: '19 Jan 2012',
    event:
      'GaDangme Union – The Netherlands was formally established, creating a home for people of GaDangme origin in the diaspora.',
  },
  {
    year: '2017',
    event:
      'The Union celebrated its 5th Anniversary Thanksgiving Service — five years of unity, cultural preservation, and community support.',
  },
  {
    year: 'Today',
    event:
      'Over 13 years strong, the Union remains a vital point of contact and support for GaDangme people across the Netherlands.',
  },
];

const values = [
  {
    icon: Users,
    title: 'Community',
    description: 'Bringing together GaDangme people across the Netherlands to support and uplift one another.',
  },
  {
    icon: Heart,
    title: 'Heritage',
    description: 'Preserving our cultural traditions, language, and customs for future generations.',
  },
  {
    icon: Globe,
    title: 'Diaspora Unity',
    description: 'Bridging the gap between our roots in Ghana and our lives in the Netherlands.',
  },
  {
    icon: Award,
    title: 'Development',
    description: 'Championing community-driven development initiatives that benefit all members.',
  },
];

const stats = [
  { value: '2012', label: 'Year Founded' },
  { value: '100+', label: 'Active Members' },
  { value: '13+', label: 'Years of Unity' },
  { value: '11', label: 'Event Albums' },
];

const communityLifeCards = [
  {
    title: 'Community Gatherings',
    description: 'BBQs, meetings, and celebrations — events where friendships are built and our shared identity is celebrated.',
    photos: [ann[13], ann[14], ann[15], ann[16], ann[17]].filter(Boolean) as string[],
  },
  {
    title: 'Cultural Celebrations',
    description: 'Traditional music and dance performed at our events keep our culture alive for the next generation.',
    photos: [ann[20], ann[21], ann[22], ann[23], ann[24]].filter(Boolean) as string[],
  },
  {
    title: 'Shared Traditions',
    description: 'From the languages we speak to the customs we observe — our traditions connect us across generations.',
    photos: [ann[0], ann[1], ann[2], ann[3], ann[4]].filter(Boolean) as string[],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const About = () => {
  return (
    <Layout>

      {/* ── Hero: full-bleed photo ── */}
      <section className="relative min-h-[75vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={ann[13] ?? ''}
            alt="GaDangme Union community gathering"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-heritage-dark/95 via-heritage-dark/50 to-primary/30" />
        </div>

        <div className="relative heritage-container pb-20 md:pb-28 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 mb-5 bg-secondary/20 text-secondary rounded-full font-body text-sm border border-secondary/30">
              Our Story
            </span>
            <h1 className="heritage-heading text-primary-foreground mb-5 text-4xl md:text-6xl lg:text-7xl">
              About<br />
              <span className="text-secondary">GaDangme Union</span>
            </h1>
            <p className="heritage-text text-primary-foreground/80 text-lg max-w-2xl">
              Our mission, our history, and the people who make up the GaDangme
              community in the Netherlands.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Mission pullout ── */}
      <section className="py-20 bg-heritage-warm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="heritage-container max-w-4xl mx-auto text-center"
        >
          <p className="font-heading text-6xl text-secondary leading-none mb-2 select-none">"</p>
          <p className="font-heading text-xl md:text-2xl lg:text-3xl text-foreground italic font-medium leading-relaxed mb-6">
            A community union built on shared roots, mutual support, and the bonds
            that unite people of GaDangme origin living in the Netherlands.
          </p>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto" />
        </motion.div>
      </section>

      {/* ── Aims & Objectives ── */}
      <section className="heritage-section bg-background">
        <div className="heritage-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block px-4 py-1.5 mb-5 bg-secondary text-secondary-foreground rounded-full font-body text-sm font-semibold">
                Our Purpose
              </span>
              <h2 className="heritage-heading text-foreground mb-6">
                Aims &amp; Objectives
              </h2>
              <div className="space-y-4 heritage-text text-muted-foreground">
                <p>
                  The Union exists to promote the welfare of its members — both
                  documented and undocumented — while preserving, promoting and
                  transmitting the rich cultural heritage of the GaDangme people
                  to future generations.
                </p>
                <p>
                  In addition, the Union champions community-driven development
                  initiatives in Ghana, creating a bridge between the diaspora
                  and our homeland.
                </p>
              </div>
              <Link to="/contact" className="btn-heritage group mt-8 inline-flex">
                Get Involved
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="absolute -top-4 -right-4 w-full h-full rounded-2xl bg-secondary/20 -z-10" />
              <img
                src={ann[16] ?? ''}
                alt="GaDangme Union gathering"
                className="w-full rounded-2xl shadow-elevated"
              />
              <div className="absolute -bottom-5 -left-5 bg-primary text-primary-foreground px-5 py-3 rounded-xl shadow-elevated">
                <p className="font-heading text-xl font-bold leading-none">Est. 2012</p>
                <p className="font-body text-xs text-primary-foreground/70 mt-0.5">The Netherlands</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="py-16 bg-primary">
        <div className="heritage-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <p className="font-heading text-4xl md:text-5xl font-bold text-secondary mb-1">
                  {s.value}
                </p>
                <p className="font-body text-xs text-primary-foreground/60 uppercase tracking-widest">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How We Began: timeline ── */}
      <section className="heritage-section bg-heritage-warm">
        <div className="heritage-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 mb-4 bg-primary text-primary-foreground rounded-full font-body text-sm font-medium">
              Est. January 2012
            </span>
            <h2 className="heritage-heading text-foreground">How We Began</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="relative flex gap-6 pb-10 last:pb-0"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 relative z-10 shadow-soft">
                    {i + 1}
                  </div>
                  <div className="pt-1">
                    <p className="font-body text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                      {m.year}
                    </p>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      {m.event}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Photo + proverb */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <img
                src={ann5[0] ?? ann[22] ?? ''}
                alt="GaDangme community event"
                className="w-full rounded-2xl shadow-elevated mb-6"
              />
              <div className="p-6 rounded-xl bg-card border border-border">
                <p className="font-heading text-xl italic text-foreground mb-1">
                  "Ashiii Gɔnti sɛɛ aŋmɔɔ kpɔ"
                </p>
                <p className="font-body text-sm text-muted-foreground">— Ga Proverb</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="heritage-section bg-background">
        <div className="heritage-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 mb-4 bg-primary/10 text-primary rounded-full font-body text-sm font-medium">
              What We Stand For
            </span>
            <h2 className="heritage-heading text-foreground">Our Values</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex gap-5 p-7 bg-card rounded-2xl border-l-4 border-l-secondary shadow-soft hover:shadow-elevated transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1.5">
                    {v.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Community Life: fading photo cards ── */}
      <section className="heritage-section bg-heritage-warm">
        <div className="heritage-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 mb-4 bg-primary/10 text-primary rounded-full font-body text-sm font-medium">
              Living Together
            </span>
            <h2 className="heritage-heading text-foreground mb-3">Community Life</h2>
            <p className="heritage-text text-muted-foreground max-w-xl mx-auto">
              What brings us together — our shared activities, traditions, and bonds.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {communityLifeCards.map((card, i) => (
              <FadingCard
                key={card.title}
                photos={card.photos}
                title={card.title}
                description={card.description}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission CTA ── */}
      <section className="relative py-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary-foreground" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary-foreground" />
        </div>

        <div className="heritage-container text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="heritage-heading text-primary-foreground mb-5">Our Mission</h2>
            <p className="heritage-text text-primary-foreground/85 mb-4 text-lg">
              GaDangme Union – The Netherlands is dedicated to the welfare and unity of
              its members. We preserve and celebrate the cultural heritage of the GaDangme
              people while supporting one another through community, solidarity, and shared purpose.
            </p>
            <p className="heritage-text text-primary-foreground/75 mb-10">
              Join us and be part of a community that feels like home.
            </p>
            <Link to="/contact" className="btn-heritage-gold group">
              Join Our Community
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

    </Layout>
  );
};

export default About;
