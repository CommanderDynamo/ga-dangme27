import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, Users, Calendar, Globe, Heart,
  ChevronLeft, ChevronRight, CheckCircle2,
} from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Layout from '@/components/Layout';
import CulturalModal, { type CulturalItem } from '@/components/CulturalModal';

// ─── Asset loading ─────────────────────────────────────────────────────────────

const _annMods = import.meta.glob(
  '../assets/5TH ANNIVERSARY THANKSGIVING SERVICE/*.JPG',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

const _videoMods = import.meta.glob(
  '../assets/5TH ANNIVERSARY THANKSGIVING SERVICE/*.MP4',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

const ann = Object.keys(_annMods).sort().map((k) => _annMods[k]);
const heroVideo = Object.values(_videoMods)[0] ?? '';

// ─── Static data ───────────────────────────────────────────────────────────────

const stats = [
  { icon: Calendar, value: '2012', label: 'Year Founded' },
  { icon: Users,    value: '100+', label: 'Active Members' },
  { icon: Globe,    value: 'NL',   label: 'Netherlands' },
  { icon: Heart,    value: '13+',  label: 'Years of Unity' },
];

const pillars = [
  'Welfare support for all members — documented and undocumented',
  'Preserving and transmitting GaDangme cultural heritage',
  'Annual community events, BBQs, and cultural celebrations',
  'Community-driven development initiatives in Ghana',
];

const culturalItems: CulturalItem[] = [
  {
    src: ann[14] ?? '',
    alt: 'GaDangme Union members gathered at the 5th Anniversary celebration',
    title: 'The Celebration',
    description:
      'The 5th Anniversary of GaDangme Union Netherlands brought together members from across the community for a joyful and meaningful celebration. The gathering honoured five years of unity, cultural preservation, and mutual support among GaDangme people living in the Netherlands.',
    images: [ann[13], ann[14], ann[15], ann[16], ann[17], ann[18], ann[19]].filter(Boolean) as string[],
  },
  {
    src: ann[21] ?? '',
    alt: 'GaDangme Union members performing traditional dance at the anniversary',
    title: 'Cultural Dance',
    description:
      'Traditional dance is at the heart of every GaDangme celebration. At the 5th Anniversary, members performed vibrant cultural dances passed down through generations — a living expression of GaDangme identity connecting community to their roots in the Netherlands.',
    images: [ann[20], ann[21], ann[22], ann[23], ann[24], ann[25], ann[26]].filter(Boolean) as string[],
  },
  {
    src: ann[6] ?? '',
    alt: 'GaDangme Union members dressed in traditional attire at the anniversary',
    title: 'Traditional Attire',
    description:
      'Members proudly wore traditional kente and wax-print attire at the 5th Anniversary — deeply symbolic fabrics representing identity, pride, and the enduring connection to Ghanaian culture across the diaspora.',
    images: [ann[0], ann[1], ann[2], ann[3], ann[4], ann[5], ann[6]].filter(Boolean) as string[],
  },
];

const stripPhotos = [ann[0], ann[4], ann[7], ann[13], ann[17], ann[22], ann[26], ann[30]];

// ─── Fading photo card ─────────────────────────────────────────────────────────

const FadingPhotoCard = ({
  item,
  index,
  onClick,
}: {
  item: CulturalItem;
  index: number;
  onClick: () => void;
}) => {
  const photos = item.images?.length ? item.images : [item.src];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % photos.length), 2600);
    return () => clearInterval(t);
  }, [photos.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.13, duration: 0.65 }}
      className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer shadow-soft hover:shadow-elevated transition-all duration-500"
      onClick={onClick}
    >
      {photos.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={item.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === idx ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Gradient overlay — deepens on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#061a1a]/95 via-[#061a1a]/25 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Progress dots */}
      <div className="absolute top-4 right-4 flex gap-1.5 z-10">
        {photos.map((_, i) => (
          <span
            key={i}
            className={`block rounded-full transition-all duration-500 ${
              i === idx ? 'w-5 h-1.5 bg-secondary' : 'w-1.5 h-1.5 bg-white/35'
            }`}
          />
        ))}
      </div>

      {/* Text reveal */}
      <div className="absolute bottom-0 left-0 right-0 p-7 z-10 translate-y-1.5 group-hover:translate-y-0 transition-transform duration-500">
        <span className="block w-6 h-[2px] bg-secondary mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75" />
        <h3 className="font-heading text-xl text-white font-semibold mb-2 leading-snug">
          {item.title}
        </h3>
        <p className="font-body text-[13px] text-white/65 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2 leading-relaxed">
          {item.description.substring(0, 110)}…
        </p>
        <span className="inline-flex items-center gap-1.5 mt-3.5 text-secondary text-xs font-semibold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
          View More <ArrowRight size={13} />
        </span>
      </div>
    </motion.div>
  );
};

// ─── Page component ────────────────────────────────────────────────────────────

const Index = () => {
  const [selectedItem, setSelectedItem] = useState<CulturalItem | null>(null);
  const { scrollYProgress } = useScroll();
  const heroScale   = useTransform(scrollYProgress, [0, 0.3], [1, 1.14]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const t = setInterval(() => emblaApi.scrollNext(), 3800);
    return () => clearInterval(t);
  }, [emblaApi]);

  return (
    <Layout>

      {/* ══════════════════════════════════════════════════════════════════════
          1 · HERO — full-screen editorial layout
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">

        {/* Parallax background */}
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          {heroVideo ? (
            <video autoPlay muted loop playsInline poster={ann[13]} className="w-full h-full object-cover">
              <source src={heroVideo} type="video/mp4" />
            </video>
          ) : (
            <img src={ann[13]} alt="GaDangme Union community" className="w-full h-full object-cover" />
          )}
          {/* Two-layer overlay: colour wash + dark vignette */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#061a1a]/85 via-primary/60 to-primary/92" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061a1a]/50 to-transparent" />
        </motion.div>

        {/* Left amber accent stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-secondary/60 to-transparent z-10" />

        {/* Main content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 flex-1 flex items-center"
        >
          <div className="heritage-container py-40 md:py-48">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              {/* Amber rule */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'left' }}
                className="w-16 h-[3px] rounded-full bg-secondary mb-6"
              />

              {/* Eyebrow */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.55 }}
                className="section-eyebrow text-secondary/85 mb-8"
              >
                United in Heritage &nbsp;·&nbsp; The Netherlands Since 2012
              </motion.p>

              {/* Main headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading font-semibold text-white"
                style={{ fontSize: 'clamp(4.2rem, 11.5vw, 9.5rem)', lineHeight: '0.91', letterSpacing: '-0.025em' }}
              >
                GaDangme<br />
                <em className="not-italic text-secondary">Union</em>
              </motion.h1>

              {/* Body copy */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.58, duration: 0.6 }}
                className="font-body text-[1.1rem] text-white/68 max-w-[470px] mt-9 mb-11 leading-[1.8]"
              >
                A community union for persons of GaDangme origin and speakers of the
                Ga and Dangme languages — building a home away from home in the Netherlands.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.72, duration: 0.55 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/gallery" className="btn-heritage-gold group">
                  Explore Gallery
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/about"
                  className="btn-heritage-outline border-white/35 text-white hover:bg-white hover:text-primary"
                >
                  Our Story
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats anchor bar — locked to bottom of hero */}
        <div className="relative z-20 bg-white/[0.97] backdrop-blur-xl border-t-2 border-secondary/30">
          <div className="heritage-container">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 + i * 0.09, duration: 0.5 }}
                  className={`group py-6 px-5 text-center cursor-default transition-colors duration-200 hover:bg-primary/[0.04] ${
                    i < stats.length - 1 ? 'border-r border-border/50' : ''
                  }`}
                >
                  <s.icon className="w-3.5 h-3.5 text-secondary mx-auto mb-2" />
                  <p className="font-heading text-2xl font-bold text-foreground leading-none tracking-tight mb-1">
                    {s.value}
                  </p>
                  <p className="font-body text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2 · WHO WE ARE — 2-col editorial split
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 md:py-36 bg-background overflow-hidden">
        <div className="heritage-container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">

            {/* Text column */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-2 flex flex-col"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-6">
                <span className="amber-rule" />
                <span className="section-eyebrow">Who We Are</span>
              </div>

              <h2
                className="font-heading font-semibold text-foreground mb-6 leading-[1.08]"
                style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', letterSpacing: '-0.018em' }}
              >
                A Home Away<br />From Home
              </h2>

              <p className="font-body text-muted-foreground leading-[1.85] text-[15px] mb-9">
                Founded on 19 January 2012, GaDangme Union – The Netherlands unites
                persons of GaDangme origin and speakers of the Ga and Dangme languages.
                We support our members, celebrate our heritage, and stay connected across
                the diaspora.
              </p>

              <ul className="space-y-4 mb-10">
                {pillars.map((p) => (
                  <li key={p} className="flex items-start gap-3.5">
                    <CheckCircle2 className="w-[18px] h-[18px] text-secondary flex-shrink-0 mt-[3px]" />
                    <span className="font-body text-[14px] text-foreground leading-[1.7]">{p}</span>
                  </li>
                ))}
              </ul>

              <Link to="/about" className="btn-heritage-outline self-start group">
                Read Our Story
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Photo column */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-3 relative pt-6 pb-6 pl-0 pr-6"
            >
              {/* Amber offset block behind photo */}
              <div className="absolute top-0 right-0 w-[88%] h-[90%] rounded-2xl bg-secondary/18" />

              <img
                src={ann[5] ?? ann[13]}
                alt="GaDangme Union community members"
                className="relative w-full rounded-2xl shadow-elevated object-cover"
                style={{ maxHeight: '540px' }}
              />

              {/* Floating badge — years of unity */}
              <div className="absolute -bottom-3 -left-3 bg-primary text-primary-foreground px-6 py-5 rounded-2xl shadow-elevated">
                <p className="font-heading text-4xl font-bold leading-none tracking-tight">13+</p>
                <p className="font-body text-[11px] text-primary-foreground/65 mt-1.5 uppercase tracking-[0.2em]">Years of Unity</p>
              </div>

              {/* Floating badge — founded */}
              <div className="absolute top-8 -right-1 bg-card border border-border/80 px-5 py-3.5 rounded-xl shadow-soft">
                <p className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Founded</p>
                <p className="font-heading text-xl font-bold text-foreground leading-none mt-0.5">2012</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3 · PHOTO STRIP — labeled Embla slider
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-heritage-warm">
        <div className="heritage-container">

          {/* Header row with inline nav */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="amber-rule" />
                <span className="section-eyebrow">Our Albums</span>
              </div>
              <h2
                className="font-heading font-semibold text-foreground"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', letterSpacing: '-0.015em' }}
              >
                Community Through the Years
              </h2>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={scrollPrev}
                aria-label="Previous"
                className="w-11 h-11 rounded-full border-2 border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next"
                className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/85 transition-colors duration-200"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Embla slider */}
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex gap-3">
              {stripPhotos.map((src, i) => (
                <div
                  key={i}
                  className="shrink-0 basis-[48%] md:basis-[23.5%] aspect-square rounded-xl overflow-hidden shadow-soft"
                >
                  <img
                    src={src}
                    alt="GaDangme Union community moment"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4 · COMMUNITY MOMENTS — fading photo cards
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 md:py-36 bg-background">
        <div className="heritage-container">

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="amber-rule" />
                <span className="section-eyebrow">Community Life</span>
              </div>
              <h2
                className="font-heading font-semibold text-foreground"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
              >
                Our Community<br />Moments
              </h2>
            </div>
            <Link to="/gallery" className="btn-heritage group self-start md:self-auto shrink-0">
              View Full Gallery
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {culturalItems.map((item, index) => (
              <FadingPhotoCard
                key={index}
                item={item}
                index={index}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5 · PHOTO BANNER — full-width community CTA
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '480px' }}>
        <img
          src={ann[28] ?? ann[33] ?? ann[17]}
          alt="GaDangme Union community gathering"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Deep overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/92 via-primary/82 to-[#061a1a]/95" />
        {/* Subtle amber stripe at top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-secondary/50" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
          className="relative heritage-container py-32 text-center"
        >
          <div className="flex justify-center mb-6">
            <span className="section-eyebrow text-secondary/80">The Netherlands · Est. 2012</span>
          </div>

          <h2
            className="font-heading font-semibold text-white mx-auto mb-6"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', lineHeight: '1.05', letterSpacing: '-0.02em', maxWidth: '720px' }}
          >
            Be Part of Our<br />
            <em className="not-italic text-secondary">Community</em>
          </h2>

          <p className="font-body text-white/65 text-[1.05rem] max-w-lg mx-auto mb-11 leading-[1.8]">
            Whether you are of GaDangme descent or a speaker of the Ga or Dangme
            language, there is a place for you here.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-heritage-gold group">
              Get In Touch
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="btn-heritage-outline border-white/30 text-white hover:bg-white hover:text-primary"
            >
              Our Story
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          6 · FINAL CTA — card with amber left-border accent
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 bg-heritage-warm">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="heritage-container"
        >
          <div className="relative bg-card rounded-3xl border border-border/70 shadow-elevated overflow-hidden">
            {/* Amber left accent */}
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-secondary rounded-l-3xl" />

            <div className="px-10 py-14 md:px-16 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-10 pl-12 md:pl-20">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="amber-rule" />
                  <span className="section-eyebrow">Connect With Us</span>
                </div>
                <h2
                  className="font-heading font-semibold text-foreground mb-3"
                  style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', letterSpacing: '-0.015em' }}
                >
                  Have Questions or<br />Want to Join?
                </h2>
                <p className="font-body text-muted-foreground text-[15px] leading-[1.8]">
                  We welcome new members and friends of the GaDangme community. Reach out
                  and we will be happy to hear from you.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link to="/contact" className="btn-heritage group">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/gallery" className="btn-heritage-outline">
                  View Gallery
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <CulturalModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </Layout>
  );
};

export default Index;
