import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, Users, Calendar, Globe, Heart,
  ChevronLeft, ChevronRight, CheckCircle2, Play,
} from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Layout from '@/components/Layout';
import CulturalModal, { type CulturalItem } from '@/components/CulturalModal';
import { usePageMeta } from '@/hooks/use-page-meta';

// ─── Assets ────────────────────────────────────────────────────────────────────
// NOTE: import.meta.glob needs literal strings, so the folder name is repeated.
// Extensions are case-sensitive on purpose: files must be .JPG / .MP4.

const photoModules = import.meta.glob(
  '../assets/5TH ANNIVERSARY THANKSGIVING SERVICE/*.JPG',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

const videoModules = import.meta.glob(
  '../assets/5TH ANNIVERSARY THANKSGIVING SERVICE/*.MP4',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

const inPathOrder = (mods: Record<string, string>) =>
  Object.keys(mods).sort().map((key) => mods[key]);

const photos = inPathOrder(photoModules);
const videos = inPathOrder(videoModules);
const heroVideo = videos[0] ?? '';

if (import.meta.env.DEV && photos.length === 0) {
  console.warn(
    '[Index] No photos found. Check that src/assets/5TH ANNIVERSARY THANKSGIVING SERVICE/ exists and contains .JPG files.'
  );
}

// Plain green panel shown instead of a broken-image icon when a photo is missing.
const PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14532d"/><stop offset="1" stop-color="#071a0c"/></linearGradient></defs><rect width="16" height="10" fill="url(#g)"/></svg>'
)}`;

/** First photo that exists among the given indexes, else the placeholder. */
const photo = (...indexes: number[]) => {
  for (const i of indexes) if (photos[i]) return photos[i];
  return PLACEHOLDER;
};

// ─── Content ───────────────────────────────────────────────────────────────────

const FOUNDED_YEAR = 2012;
const YEARS_OF_UNITY = new Date().getFullYear() - FOUNDED_YEAR;

const stats = [
  { icon: Calendar, value: String(FOUNDED_YEAR), label: 'Year founded' },
  { icon: Users,    value: '100+',                label: 'Active members' },
  { icon: Globe,    value: 'NL',                  label: 'Netherlands' },
  { icon: Heart,    value: `${YEARS_OF_UNITY}+`, label: 'Years of unity' },
];

const pillars = [
  'Welfare support for all members — documented and undocumented',
  'Preserving and transmitting GaDangme cultural heritage',
  'Annual community events, BBQs, and cultural celebrations',
  'Community-driven development initiatives in Ghana',
];

const culturalItems: CulturalItem[] = [
  {
    src: photo(14),
    alt: 'GaDangme Union members gathered at the 5th Anniversary celebration',
    title: 'The Celebration',
    description:
      'The 5th Anniversary of GaDangme Union Netherlands brought together members from across the community for a joyful and meaningful celebration. The gathering honoured five years of unity, cultural preservation, and mutual support among GaDangme people living in the Netherlands.',
    images: photos.slice(13, 20),
  },
  {
    src: photo(21),
    alt: 'GaDangme Union members performing traditional dance at the anniversary',
    title: 'Cultural Dance',
    description:
      'Traditional dance is at the heart of every GaDangme celebration. At the 5th Anniversary, members performed vibrant cultural dances passed down through generations — a living expression of GaDangme identity connecting community to their roots in the Netherlands.',
    images: photos.slice(20, 27),
  },
  {
    src: photo(6),
    alt: 'GaDangme Union members dressed in traditional attire at the anniversary',
    title: 'Traditional Attire',
    description:
      'Members proudly wore traditional kente and wax-print attire at the 5th Anniversary — deeply symbolic fabrics representing identity, pride, and the enduring connection to Ghanaian culture across the diaspora.',
    images: photos.slice(0, 7),
  },
];

const STRIP_INDEXES = [0, 4, 7, 13, 17, 22, 26, 30];
const stripPhotos = STRIP_INDEXES.map((i) => photos[i]).filter(Boolean);

// ─── Small shared pieces ───────────────────────────────────────────────────────

/** Deep brand green used in overlays: #071a0c (kept literal so Tailwind can see it). */

const ButtonArrow = () => (
  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
);

/** Photo that fills its (relative, overflow-hidden) parent. */
const FillImage = ({ src, alt, className = '' }: { src: string; alt: string; className?: string }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    decoding="async"
    className={`absolute inset-0 h-full w-full object-cover object-top ${className}`}
  />
);

const SectionHeading = ({
  children,
  size = 'lg',
  className = '',
}: {
  children: ReactNode;
  size?: 'lg' | 'md';
  className?: string;
}) => (
  <div className={className}>
    <span className="amber-rule mb-4 block" />
    <h2
      className={`font-heading font-semibold leading-[1.1] tracking-[-0.02em] text-foreground ${
        size === 'lg'
          ? '[font-size:clamp(2rem,4vw,3rem)]'
          : '[font-size:clamp(1.6rem,3vw,2.4rem)]'
      }`}
    >
      {children}
    </h2>
  </div>
);

/** Page-load entrance for the hero only. */
const HeroFade = ({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Carousel logic (user-controlled: arrows, dots, swipe) ─────────────────────

const useCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    const sync = () => {
      setSnaps(emblaApi.scrollSnapList());
      setSelected(emblaApi.selectedScrollSnap());
    };
    sync();
    emblaApi.on('select', sync).on('reInit', sync);
    return () => {
      emblaApi.off('select', sync).off('reInit', sync);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return { emblaRef, selected, snaps, scrollPrev, scrollNext, scrollTo };
};

// ─── Photo card that cycles its images while hovered / focused ─────────────────

const CARD_FADE_MS = 2600;
// Details are always visible on touch screens; on desktop they appear on hover/focus.
const REVEAL =
  'transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100';

const FadingPhotoCard = ({ item, onClick }: { item: CulturalItem; onClick: () => void }) => {
  const images = item.images?.length ? item.images : [item.src];
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!active || reduceMotion || images.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % images.length), CARD_FADE_MS);
    return () => clearInterval(t);
  }, [active, reduceMotion, images.length]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${item.title} — view photos`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="group relative aspect-[16/10] cursor-pointer overflow-hidden rounded-2xl shadow-soft transition-shadow duration-300 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
    >
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === index ? item.alt : ''}
          aria-hidden={i !== index}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-1000 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071a0c]/90 via-[#071a0c]/20 to-transparent transition-opacity duration-300 md:opacity-65 md:group-hover:opacity-100" />

      {images.length > 1 && (
        <div className="absolute right-4 top-4 z-10 flex gap-1.5" aria-hidden="true">
          {images.map((src, i) => (
            <span
              key={src}
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-5 bg-secondary' : 'w-1.5 bg-white/35'
              }`}
            />
          ))}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 p-6">
        <h3 className="mb-2 font-subheading text-xl font-semibold leading-snug text-white">
          {item.title}
        </h3>
        <p className={`${REVEAL} line-clamp-2 font-body text-[13px] leading-relaxed text-white/70`}>
          {item.description}
        </p>
        <span className={`${REVEAL} mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-secondary`}>
          View more <ArrowRight size={13} />
        </span>
      </div>
    </div>
  );
};

// ─── Sections ──────────────────────────────────────────────────────────────────

const Hero = () => {
  const reduceMotion = useReducedMotion();
  const showVideo = Boolean(heroVideo) && !reduceMotion;

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        {showVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={photo(13)}
            className="h-full w-full object-cover object-top"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        ) : (
          <img src={photo(13)} alt="" className="h-full w-full object-cover object-top" />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[#071a0c]/90 via-primary/60 to-primary/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071a0c]/45 to-transparent" />
      </div>

      {/* Amber edge accent */}
      <div className="absolute inset-y-0 left-0 z-10 w-1 bg-gradient-to-b from-transparent via-secondary/55 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-1 items-center">
        <div className="heritage-container py-32 md:py-44">
          <div className="max-w-3xl">
            <HeroFade>
              <div className="mb-6 h-[3px] w-16 rounded-full bg-secondary" />
            </HeroFade>

            <HeroFade delay={0.15}>
              <p className="section-eyebrow mb-8 text-secondary/85">
                United in Heritage &nbsp;·&nbsp; The Netherlands Since 2012
              </p>
            </HeroFade>

            <HeroFade delay={0.3}>
              <h1 className="font-heading font-semibold leading-[0.92] tracking-[-0.025em] text-white [font-size:clamp(3.6rem,10vw,8rem)]">
                GaDangme<br />
                <em className="not-italic text-secondary">Union</em>
              </h1>
            </HeroFade>

            <HeroFade delay={0.45}>
              <p className="mb-10 mt-8 max-w-[460px] font-body text-[1.05rem] leading-[1.85] text-white/70">
                A community union for persons of GaDangme origin and speakers of the
                Ga and Dangme languages — building a home away from home in the Netherlands.
              </p>
            </HeroFade>

            <HeroFade delay={0.6} className="flex flex-wrap gap-4">
              <Link to="/gallery" className="btn-heritage-gold group">
                Explore Gallery
                <ButtonArrow />
              </Link>
              <Link
                to="/about"
                className="btn-heritage-outline border-white/35 text-white hover:bg-white hover:text-primary"
              >
                Our Story
              </Link>
            </HeroFade>

            <HeroFade delay={0.75}>
              <p className="mt-9 font-subheading text-sm italic leading-relaxed text-secondary/85">
                “Kwɛ Bɔ Ni Ehi, Kwɛ Bɔ Ni Eyɔɔ Fɛo!<br />
                Ashiii Gɔŋti Aŋmɔɔɔ Kpɔ”
              </p>
            </HeroFade>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-20 border-t-2 border-secondary/25 bg-white/[0.97] backdrop-blur-xl">
        <div className="heritage-container">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <HeroFade
                key={s.label}
                delay={0.7 + i * 0.08}
                className="border-b border-border/50 px-5 py-6 text-center transition-colors duration-200 even:border-l hover:bg-primary/[0.04] [&:nth-last-child(-n+2)]:border-b-0 md:border-b-0 md:border-l md:first:border-l-0"
              >
                <s.icon className="mx-auto mb-2 h-4 w-4 text-secondary" />
                <p className="mb-1 font-subheading text-2xl font-bold leading-none tracking-tight text-foreground">
                  {s.value}
                </p>
                <p className="font-body text-xs font-medium text-muted-foreground">{s.label}</p>
              </HeroFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const WhoWeAre = () => (
  <section className="overflow-hidden bg-background py-24 md:py-32">
    <div className="heritage-container">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-5">
        {/* Text */}
        <div className="flex flex-col lg:col-span-2">
          <SectionHeading className="mb-6">
            A Home Away<br />From Home
          </SectionHeading>

          <p className="mb-8 font-body text-[15px] leading-[1.88] text-muted-foreground">
            Founded on 19 January {FOUNDED_YEAR}, GaDangme Union – The Netherlands unites
            persons of GaDangme origin and speakers of the Ga and Dangme languages.
            We support our members, celebrate our heritage, and stay connected across
            the diaspora.
          </p>

          <ul className="mb-10 space-y-4">
            {pillars.map((p) => (
              <li key={p} className="flex items-start gap-3.5">
                <CheckCircle2 className="mt-[3px] h-[18px] w-[18px] shrink-0 text-secondary" />
                <span className="font-body text-[14px] leading-[1.75] text-foreground">{p}</span>
              </li>
            ))}
          </ul>

          <Link to="/about" className="btn-heritage-outline self-start">
            Read Our Story
          </Link>
        </div>

        {/* Photos — one tall panel + two stacked panels, aligned to the same height */}
        <div className="lg:col-span-3">
          <div className="grid h-[320px] grid-cols-2 gap-3 sm:h-[440px]">
            <div className="relative overflow-hidden rounded-2xl shadow-elevated">
              <FillImage src={photo(5, 0)} alt="GaDangme Union community members" />
              <div className="absolute bottom-4 left-4 rounded-xl bg-primary px-5 py-4 text-primary-foreground shadow-elevated">
                <p className="font-subheading text-3xl font-bold leading-none tracking-tight">
                  {YEARS_OF_UNITY}+
                </p>
                <p className="mt-1 font-body text-xs text-primary-foreground/70">Years of unity</p>
              </div>
            </div>

            <div className="grid grid-rows-2 gap-3">
              <div className="relative overflow-hidden rounded-2xl shadow-soft">
                <FillImage src={photo(13, 1)} alt="GaDangme Union celebration" />
              </div>
              <div className="relative overflow-hidden rounded-2xl shadow-soft">
                <FillImage src={photo(17, 3)} alt="GaDangme Union gathering" />
                <div className="absolute right-3 top-3 rounded-lg bg-white/90 px-4 py-2.5 shadow-soft backdrop-blur-sm">
                  <p className="font-body text-[11px] text-muted-foreground">Founded</p>
                  <p className="mt-0.5 font-subheading text-lg font-bold leading-none text-foreground">
                    {FOUNDED_YEAR}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const VideoHighlights = () => {
  const [playing, setPlaying] = useState(false);
  if (!heroVideo) return null;

  return (
    <section className="bg-heritage-warm py-16 md:py-20">
      <div className="heritage-container">
        <SectionHeading size="md" className="mb-8">
          5th Anniversary Highlights
        </SectionHeading>

        <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#071a0c] shadow-elevated">
          {playing ? (
            <video autoPlay controls playsInline poster={photo(13)} className="h-full w-full bg-black object-contain">
              <source src={heroVideo} type="video/mp4" />
            </video>
          ) : (
            <>
              <img
                src={photo(13)}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label="Play 5th Anniversary highlights video"
                className="group absolute inset-0 flex items-center justify-center bg-[#071a0c]/45 transition-colors duration-200 hover:bg-[#071a0c]/35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-secondary"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary shadow-glow transition-transform duration-200 group-hover:scale-105">
                  <Play className="ml-1 h-8 w-8 text-secondary-foreground" fill="currentColor" />
                </span>
              </button>
              <span className="pointer-events-none absolute bottom-6 left-6 rounded-full bg-black/40 px-3 py-1.5 font-body text-xs font-medium text-white/80 backdrop-blur-sm">
                5th Anniversary, 2017
              </span>
            </>
          )}
        </div>

        {videos.length > 1 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {videos.slice(1).map((src) => (
              <div key={src} className="aspect-video overflow-hidden rounded-xl bg-[#071a0c] shadow-soft">
                <video controls playsInline preload="metadata" className="h-full w-full object-cover">
                  {/* #t=0.1 makes mobile browsers show a first-frame preview */}
                  <source src={`${src}#t=0.1`} type="video/mp4" />
                </video>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const PhotoStrip = () => {
  const { emblaRef, selected, snaps, scrollPrev, scrollNext, scrollTo } = useCarousel();
  if (stripPhotos.length === 0) return null;

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="heritage-container">
        <div className="mb-8 flex items-end justify-between gap-4">
          <SectionHeading size="md">Community Through the Years</SectionHeading>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous photo"
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary text-primary transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next photo"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary/85"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {stripPhotos.map((src, i) => (
              <div
                key={src}
                className="h-[300px] shrink-0 basis-[88%] overflow-hidden rounded-2xl shadow-soft sm:basis-[48%] lg:basis-[32%]"
              >
                <img
                  src={src}
                  alt={`GaDangme Union community moment, photo ${i + 1} of ${stripPhotos.length}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        {snaps.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {snaps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === selected}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === selected ? 'w-7 bg-secondary' : 'w-2.5 bg-primary/25 hover:bg-primary/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const CommunityMoments = () => {
  const [selectedItem, setSelectedItem] = useState<CulturalItem | null>(null);

  return (
    <>
      <section className="bg-heritage-warm py-24 md:py-32">
        <div className="heritage-container">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading>
              Our Community<br />Moments
            </SectionHeading>
            <Link to="/gallery" className="btn-heritage group shrink-0 self-start md:self-auto">
              View Full Gallery
              <ButtonArrow />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {culturalItems.map((item) => (
              <FadingPhotoCard key={item.title} item={item} onClick={() => setSelectedItem(item)} />
            ))}
          </div>
        </div>
      </section>

      <CulturalModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
};

/** One closing call to action (replaces the two back-to-back CTAs). */
const JoinBanner = () => (
  <section className="relative min-h-[460px] overflow-hidden">
    <FillImage src={photo(28, 33, 17)} alt="" />
    <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-[#071a0c]/95" />
    <div className="absolute inset-x-0 top-0 h-0.5 bg-secondary/40" />

    <div className="heritage-container relative py-24 text-center md:py-28">
      <h2 className="mx-auto mb-6 max-w-[720px] font-heading font-semibold leading-[1.06] tracking-[-0.02em] text-white [font-size:clamp(2.4rem,6vw,4.5rem)]">
        Be Part of Our<br />
        <em className="not-italic text-secondary">Community</em>
      </h2>

      <p className="mx-auto mb-10 max-w-lg font-body text-base leading-[1.85] text-white/70">
        Whether you are of GaDangme descent or a speaker of the Ga or Dangme language,
        there is a place for you here. Reach out and we will be happy to hear from you.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/contact" className="btn-heritage-gold group">
          Get In Touch
          <ButtonArrow />
        </Link>
        <Link
          to="/about"
          className="btn-heritage-outline border-white/30 text-white hover:bg-white hover:text-primary"
        >
          Our Story
        </Link>
      </div>
    </div>
  </section>
);

// ─── Page ──────────────────────────────────────────────────────────────────────

const Index = () => {
  usePageMeta({
    title: 'Home',
    description: 'GaDangme Union - The Netherlands | Preserving our heritage, uniting our people since 2012.',
  });

  return (
    <Layout>
      <Hero />
      <WhoWeAre />
      <VideoHighlights />
      <PhotoStrip />
      <CommunityMoments />
      <JoinBanner />
    </Layout>
  );
};

export default Index;