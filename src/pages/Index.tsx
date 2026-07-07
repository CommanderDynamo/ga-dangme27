import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Users, Calendar, Globe, Heart,
  ChevronLeft, ChevronRight, CheckCircle2, Play,
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
const videos = Object.values(_videoMods);
const heroVideo = videos[0] ?? '';

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

const stripPhotos = [ann[0], ann[4], ann[7], ann[13], ann[17], ann[22], ann[26], ann[30]].filter(Boolean) as string[];

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
    const t = setInterval(() => setIdx((i) => (i + 1) % photos.length), 3200);
    return () => clearInterval(t);
  }, [photos.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.6 }}
      className="group relative overflow-hidden rounded-2xl aspect-[16/10] cursor-pointer shadow-soft hover:shadow-elevated transition-shadow duration-400"
      onClick={onClick}
    >
      {photos.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={item.alt}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ${
            i === idx ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-[#071a0c]/90 via-[#071a0c]/20 to-transparent opacity-65 group-hover:opacity-100 transition-opacity duration-400" />

      {/* Progress dots */}
      <div className="absolute top-4 right-4 flex gap-1.5 z-10">
        {photos.map((_, i) => (
          <span
            key={i}
            className={`block rounded-full transition-all duration-400 ${
              i === idx ? 'w-5 h-1.5 bg-secondary' : 'w-1.5 h-1.5 bg-white/35'
            }`}
          />
        ))}
      </div>

      {/* Text reveal */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <span className="block w-6 h-[2px] bg-secondary mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <h3 className="font-heading text-xl text-white font-semibold mb-2 leading-snug">
          {item.title}
        </h3>
        <p className="font-body text-[13px] text-white/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2 leading-relaxed">
          {item.description.substring(0, 110)}…
        </p>
        <span className="inline-flex items-center gap-1.5 mt-3 text-secondary text-xs font-semibold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View More <ArrowRight size={13} />
        </span>
      </div>
    </motion.div>
  );
};

// ─── Page component ────────────────────────────────────────────────────────────

const Index = () => {
  const [selectedItem, setSelectedItem] = useState<CulturalItem | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Carousel state
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on('select', onSelect);
    const t = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => {
      clearInterval(t);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <Layout>

      {/* ══════════════════════════════════════════════════════════════════════
          1 · HERO — full-screen with video background
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">

        {/* Background — video or image, no parallax */}
        <div className="absolute inset-0">
          {heroVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={ann[13]}
              className="w-full h-full object-cover object-top"
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
          ) : (
            <img src={ann[13]} alt="GaDangme Union community" className="w-full h-full object-cover object-top" />
          )}
          {/* Warm green overlay — welcoming, not cold */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#071a0c]/88 via-primary/58 to-primary/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071a0c]/45 to-transparent" />
        </div>

        {/* Amber left accent stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-secondary/55 to-transparent z-10" />

        {/* Hero content — CSS fade-in, no scroll-based effects */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="heritage-container py-40 md:py-48">
            <div className="max-w-3xl animate-fade-in">

              {/* Amber rule */}
              <div className="w-16 h-[3px] rounded-full bg-secondary mb-6" />

              {/* Eyebrow */}
              <p
                className="section-eyebrow text-secondary/85 mb-8 animate-fade-in-up"
                style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
              >
                United in Heritage &nbsp;·&nbsp; The Netherlands Since 2012
              </p>

              {/* Main headline */}
              <h1
                className="font-heading font-semibold text-white animate-fade-in-up"
                style={{
                  fontSize: 'clamp(3.8rem, 10.5vw, 9rem)',
                  lineHeight: '0.92',
                  letterSpacing: '-0.025em',
                  animationDelay: '0.35s',
                  opacity: 0,
                  animationFillMode: 'forwards',
                }}
              >
                GaDangme<br />
                <em className="not-italic text-secondary">Union</em>
              </h1>

              {/* Body copy */}
              <p
                className="font-body text-[1.05rem] text-white/72 max-w-[460px] mt-8 mb-10 leading-[1.85] animate-fade-in-up"
                style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}
              >
                A community union for persons of GaDangme origin and speakers of the
                Ga and Dangme languages — building a home away from home in the Netherlands.
              </p>

              {/* CTAs */}
              <div
                className="flex flex-wrap gap-4 animate-fade-in-up"
                style={{ animationDelay: '0.65s', opacity: 0, animationFillMode: 'forwards' }}
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
              </div>
            </div>
          </div>
        </div>

        {/* Stats anchor bar */}
        <div className="relative z-20 bg-white/[0.97] backdrop-blur-xl border-t-2 border-secondary/25">
          <div className="heritage-container">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`py-6 px-5 text-center hover:bg-primary/[0.04] transition-colors duration-200 animate-fade-in-up ${
                    i < stats.length - 1 ? 'border-r border-border/50' : ''
                  }`}
                  style={{ animationDelay: `${0.7 + i * 0.08}s`, opacity: 0, animationFillMode: 'forwards' }}
                >
                  <s.icon className="w-3.5 h-3.5 text-secondary mx-auto mb-2" />
                  <p className="font-heading text-2xl font-bold text-foreground leading-none tracking-tight mb-1">
                    {s.value}
                  </p>
                  <p className="font-body text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2 · WHO WE ARE — 2-col editorial split
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-background overflow-hidden">
        <div className="heritage-container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 items-center">

            {/* Text column */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-2 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="amber-rule" />
                <span className="section-eyebrow">Who We Are</span>
              </div>

              <h2
                className="font-heading font-semibold text-foreground mb-6 leading-[1.1]"
                style={{ fontSize: 'clamp(2.2rem, 4vw, 3.1rem)', letterSpacing: '-0.018em' }}
              >
                A Home Away<br />From Home
              </h2>

              <p className="font-body text-muted-foreground leading-[1.88] text-[15px] mb-8">
                Founded on 19 January 2012, GaDangme Union – The Netherlands unites
                persons of GaDangme origin and speakers of the Ga and Dangme languages.
                We support our members, celebrate our heritage, and stay connected across
                the diaspora.
              </p>

              <ul className="space-y-4 mb-10">
                {pillars.map((p) => (
                  <li key={p} className="flex items-start gap-3.5">
                    <CheckCircle2 className="w-[18px] h-[18px] text-secondary flex-shrink-0 mt-[3px]" />
                    <span className="font-body text-[14px] text-foreground leading-[1.75]">{p}</span>
                  </li>
                ))}
              </ul>

              <Link to="/about" className="btn-heritage-outline self-start group">
                Read Our Story
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Photo column — 2-panel grid with explicit heights */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-3 relative"
            >
              <div className="grid grid-cols-2 gap-3">

                {/* Tall left photo */}
                <div className="relative rounded-2xl overflow-hidden shadow-elevated" style={{ height: '420px' }}>
                  <img
                    src={ann[5] ?? ann[0]}
                    alt="GaDangme Union community members"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  {/* Years badge pinned to bottom-left of this photo */}
                  <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground px-5 py-4 rounded-xl shadow-elevated">
                    <p className="font-heading text-3xl font-bold leading-none tracking-tight">13+</p>
                    <p className="font-body text-[10px] text-primary-foreground/65 mt-1 uppercase tracking-[0.18em]">Years of Unity</p>
                  </div>
                </div>

                {/* Right column — 2 stacked photos */}
                <div className="flex flex-col gap-3">
                  <div className="relative rounded-2xl overflow-hidden shadow-soft" style={{ height: '200px' }}>
                    <img
                      src={ann[13] ?? ann[1]}
                      alt="GaDangme Union celebration"
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="relative rounded-2xl overflow-hidden shadow-soft" style={{ height: '200px' }}>
                    <img
                      src={ann[17] ?? ann[3]}
                      alt="GaDangme Union gathering"
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                    {/* Founded badge on this photo */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-lg shadow-soft">
                      <p className="font-body text-[9px] text-muted-foreground uppercase tracking-[0.2em]">Founded</p>
                      <p className="font-heading text-lg font-bold text-foreground leading-none mt-0.5">2012</p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3 · VIDEO HIGHLIGHTS — dedicated video player section
      ════════════════════════════════════════════════════════════════════════ */}
      {heroVideo && (
        <section className="py-16 md:py-20 bg-heritage-warm">
          <div className="heritage-container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="amber-rule" />
                <span className="section-eyebrow">Watch &amp; Celebrate</span>
              </div>
              <h2
                className="font-heading font-semibold text-foreground mb-8"
                style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.5rem)', letterSpacing: '-0.015em' }}
              >
                5th Anniversary Highlights
              </h2>

              {/* Main video player */}
              <div className="relative rounded-2xl overflow-hidden shadow-elevated bg-[#071a0c]" style={{ aspectRatio: '16/9' }}>
                {!videoPlaying ? (
                  <>
                    <img
                      src={ann[13]}
                      alt="Anniversary highlights thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#071a0c]/45 flex items-center justify-center">
                      <button
                        onClick={() => setVideoPlaying(true)}
                        className="group flex items-center justify-center w-20 h-20 rounded-full bg-secondary hover:bg-secondary/90 shadow-glow transition-all duration-250 hover:scale-105"
                        aria-label="Play video"
                      >
                        <Play className="w-8 h-8 text-secondary-foreground ml-1" fill="currentColor" />
                      </button>
                    </div>
                    <div className="absolute bottom-6 left-6">
                      <span className="font-body text-xs font-semibold uppercase tracking-widest text-white/70 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        5th Anniversary · 2017
                      </span>
                    </div>
                  </>
                ) : (
                  <video
                    autoPlay
                    controls
                    className="w-full h-full object-cover"
                  >
                    <source src={heroVideo} type="video/mp4" />
                  </video>
                )}
              </div>

              {/* Extra video thumbnails if more than 1 video */}
              {videos.length > 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  {videos.slice(1).map((v, i) => (
                    <div key={i} className="rounded-xl overflow-hidden shadow-soft aspect-video bg-[#071a0c]">
                      <video controls className="w-full h-full object-cover">
                        <source src={v} type="video/mp4" />
                      </video>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          4 · PHOTO STRIP — labeled Embla slider with dots
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-background">
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
                aria-label="Previous photo"
                className="w-11 h-11 rounded-full border-2 border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next photo"
                className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/85 transition-colors duration-200"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Embla slider */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {stripPhotos.map((src, i) => (
                <div
                  key={i}
                  className="shrink-0 basis-[88%] sm:basis-[48%] lg:basis-[32%] rounded-2xl overflow-hidden shadow-soft"
                  style={{ height: '300px' }}
                >
                  <img
                    src={src}
                    alt="GaDangme Union community moment"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel dots */}
          {scrollSnaps.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {scrollSnaps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === selectedIndex
                      ? 'w-7 h-2.5 bg-secondary'
                      : 'w-2.5 h-2.5 bg-primary/25 hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5 · COMMUNITY MOMENTS — fading photo cards
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-heritage-warm">
        <div className="heritage-container">

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
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
          6 · PHOTO BANNER — full-width community CTA
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '460px' }}>
        <img
          src={ann[28] ?? ann[33] ?? ann[17]}
          alt="GaDangme Union community gathering"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-[#071a0c]/94" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-secondary/40" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative heritage-container py-28 text-center"
        >
          <div className="flex justify-center mb-5">
            <span className="section-eyebrow text-secondary/80">The Netherlands · Est. 2012</span>
          </div>

          <h2
            className="font-heading font-semibold text-white mx-auto mb-6"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', lineHeight: '1.06', letterSpacing: '-0.02em', maxWidth: '720px' }}
          >
            Be Part of Our<br />
            <em className="not-italic text-secondary">Community</em>
          </h2>

          <p className="font-body text-white/65 text-[1rem] max-w-lg mx-auto mb-10 leading-[1.85]">
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
          7 · FINAL CTA — card with amber left-border accent
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="heritage-container"
        >
          <div className="relative bg-card rounded-3xl border border-border/60 shadow-elevated overflow-hidden">
            {/* Amber left accent */}
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-secondary rounded-l-3xl" />

            <div className="px-10 py-12 md:px-16 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-10 pl-12 md:pl-20">
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
                <p className="font-body text-muted-foreground text-[15px] leading-[1.82]">
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
