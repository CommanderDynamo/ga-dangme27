import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Pause, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

// ─── Asset loading ─────────────────────────────────────────────────────────────

const _bbq12Photos  = import.meta.glob('../assets/2012 BBQ/*.jpg',  { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const _bbq12Videos  = import.meta.glob('../assets/2012 BBQ/*.mp4',  { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

const _bbq13Photos  = import.meta.glob('../assets/2013 BBQ/*.JPG',  { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
// 2013 Ga dan meeting files are uppercase .JPG
const _meet13Photos = import.meta.glob('../assets/2013 Ga dan meeting/*.JPG', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

const _bbq15Photos  = import.meta.glob('../assets/2015 BABBEQUE/*.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const _bbq15Videos  = import.meta.glob('../assets/2015 BABBEQUE/*.mp4', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

const _daantaa16    = import.meta.glob('../assets/2016 DAANTAA/*.jpg',      { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const _phila16      = import.meta.glob('../assets/2016 PHILADEPHIA/*.jpg',   { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

const _ann17Photos  = import.meta.glob('../assets/5TH ANNIVERSARY/*.JPG',   { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const _ann17Videos  = import.meta.glob('../assets/5TH ANNIVERSARY/*.MP4',   { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

const _thx17Photos  = import.meta.glob('../assets/5TH ANNIVERSARY THANKSGIVING SERVICE/*.JPG', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const _thx17Videos  = import.meta.glob('../assets/5TH ANNIVERSARY THANKSGIVING SERVICE/*.MP4', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

const _atadaan18    = import.meta.glob('../assets/2018 ATADAAN/*.mp4',       { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
// AB3IBEE BII N3! — photos from cultural gathering
const _ab3ibee      = import.meta.glob('../assets/AB3IBEE BII N3!/*.jpg',    { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

const S = (mods: Record<string, string>) => Object.keys(mods).sort().map(k => mods[k]);

const bbq12p  = S(_bbq12Photos);   const bbq12v  = S(_bbq12Videos);
const bbq13p  = S(_bbq13Photos);   const meet13p = S(_meet13Photos);
const bbq15p  = S(_bbq15Photos);   const bbq15v  = S(_bbq15Videos);
const daantaa = S(_daantaa16);     const phila   = S(_phila16);
const ann17p  = S(_ann17Photos);   const ann17v  = S(_ann17Videos);
const thx17p  = S(_thx17Photos);   const thx17v  = S(_thx17Videos);
const atadaan = S(_atadaan18);     const ab3     = S(_ab3ibee);

const heroVideo = thx17v[0] ?? ann17v[0] ?? '';

// ─── VideoBlock ────────────────────────────────────────────────────────────────

const VideoBlock = ({
  src, label, className = '',
}: { src: string; label?: string; className?: string }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  if (!src) return null;

  const toggle = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.play(); setPlaying(true); }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.012 }}
      transition={{ duration: 0.35 }}
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${className}`}
      onClick={toggle}
    >
      <video ref={ref} src={src} loop playsInline muted className="w-full h-full object-cover" />

      <div className={`absolute inset-0 bg-[#061a1a]/45 transition-opacity duration-300 ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`} />

      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
        <div className="w-16 h-16 rounded-full bg-white/95 shadow-elevated flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
          {playing
            ? <Pause className="w-6 h-6 text-primary" />
            : <Play  className="w-6 h-6 text-primary ml-1" />}
        </div>
      </div>

      {label && (
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-[#061a1a]/80 to-transparent">
          <p className="font-body text-[11px] text-white/70 uppercase tracking-[0.22em] font-semibold">{label}</p>
        </div>
      )}
    </motion.div>
  );
};

// ─── Photo ─────────────────────────────────────────────────────────────────────

const Photo = ({ src, alt = '', className = '' }: { src?: string; alt?: string; className?: string }) => {
  if (!src) return <div className={`bg-muted rounded-2xl ${className}`} />;
  return (
    <motion.div
      whileHover={{ scale: 1.018 }}
      transition={{ duration: 0.4 }}
      className={`overflow-hidden rounded-2xl ${className}`}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
    </motion.div>
  );
};

// ─── Ghost year number ─────────────────────────────────────────────────────────

const GhostYear = ({ year }: { year: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  return (
    <div ref={ref} className="absolute -top-6 left-0 right-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      <motion.span
        style={{ y, fontSize: 'clamp(7rem, 20vw, 18rem)' }}
        className="block font-heading font-bold leading-none text-primary/[0.055]"
      >
        {year}
      </motion.span>
    </div>
  );
};

// ─── Chapter heading ───────────────────────────────────────────────────────────

const ChapterHead = ({
  eyebrow, title, italic, body, light = false,
}: { eyebrow: string; title: string; italic?: string; body: string; light?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="mb-12"
  >
    <div className="flex items-center gap-3 mb-5">
      <span className="block w-10 h-[3px] rounded-full bg-secondary" />
      <span className="font-body text-[11px] font-bold uppercase tracking-[0.28em] text-secondary">
        {eyebrow}
      </span>
    </div>
    <h2
      className={`font-heading font-semibold mb-5 leading-[1.06] ${light ? 'text-primary-foreground' : 'text-foreground'}`}
      style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)', letterSpacing: '-0.022em' }}
    >
      {title}
      {italic && <><br /><em className="italic text-secondary font-normal">{italic}</em></>}
    </h2>
    <p className={`font-body text-[15px] leading-[1.85] max-w-xl ${light ? 'text-primary-foreground/65' : 'text-muted-foreground'}`}>
      {body}
    </p>
  </motion.div>
);

// ─── FadeUp ────────────────────────────────────────────────────────────────────

const FadeUp = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 34 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.68, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HighlightsPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY       = useTransform(heroScroll, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  return (
    <Layout>

      {/* ═══════════════════════════════════════════════════════════════════
          HERO — cinematic full-screen video
      ═════════════════════════════════════════════════════════════════════*/}
      <section ref={heroRef} className="relative min-h-screen flex flex-col overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          {heroVideo
            ? <video autoPlay muted loop playsInline src={heroVideo} className="w-full h-full object-cover" />
            : <img src={thx17p[10] ?? ann17p[0]} alt="GaDangme Union" className="w-full h-full object-cover" />
          }
          <div className="absolute inset-0 bg-gradient-to-b from-[#061a1a]/60 via-primary/50 to-[#061a1a]/95" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 flex-1 flex flex-col justify-end">
          <div className="heritage-container pb-24 md:pb-32">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'left' }}
                className="w-16 h-[3px] rounded-full bg-secondary mb-6"
              />
              <p className="section-eyebrow text-secondary/80 mb-7">GaDangme Union · The Netherlands</p>
              <h1
                className="font-heading font-semibold text-white mb-8"
                style={{ fontSize: 'clamp(3.8rem, 11vw, 9.5rem)', lineHeight: '0.9', letterSpacing: '-0.025em' }}
              >
                Years of<br /><em className="not-italic text-secondary">Community</em>
              </h1>
              <p className="font-body text-white/60 text-[1.05rem] max-w-[430px] leading-[1.82] mb-10">
                A decade of unity, culture, and belonging — captured in the videos and photographs that tell our story.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-[1px] h-8 bg-white/20" />
                <p className="font-body text-[12px] text-white/35 uppercase tracking-[0.25em] font-semibold">
                  Scroll to explore · 2012 — 2018
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <div className="w-6 h-9 rounded-full border border-white/20 flex items-start justify-center pt-2">
            <div className="w-1 h-2.5 rounded-full bg-white/40" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FEATURED MOMENTS — positions 1, 2, (3), 4 from the community
          meeting photos, giving variety and size contrast
      ═════════════════════════════════════════════════════════════════════*/}
      <section className="py-20 md:py-28 bg-background">
        <div className="heritage-container">
          <FadeUp className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="block w-10 h-[3px] rounded-full bg-secondary" />
              <span className="section-eyebrow text-secondary">Community Through the Years</span>
            </div>
            <h2
              className="font-heading font-semibold text-foreground"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
            >
              The Faces Behind the Union
            </h2>
          </FadeUp>

          {/* Row 1: positions 1 (large) + 2 (tall right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            {/* Position 1 — largest, most prominent */}
            <FadeUp className="md:col-span-7">
              <Photo
                src={meet13p[0]}
                alt="GaDangme Union community meeting 2013"
                className="aspect-[4/3] shadow-elevated"
              />
            </FadeUp>
            {/* Position 2 — tall portrait */}
            <FadeUp delay={0.1} className="md:col-span-5">
              <Photo
                src={meet13p[1] ?? meet13p[0]}
                alt="GaDangme Union members 2013"
                className="aspect-[4/3] md:h-full md:aspect-auto shadow-soft"
              />
            </FadeUp>
          </div>

          {/* Row 2: position 3 (different album) + position 4 (meeting) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Position 3 — from 2012 BBQ for variety */}
            <FadeUp delay={0.05} className="md:col-span-4">
              <Photo
                src={bbq12p[5] ?? bbq12p[0]}
                alt="GaDangme Union BBQ 2012"
                className="aspect-[4/3] shadow-soft"
              />
            </FadeUp>
            {/* Position 4 — back to meeting photos */}
            <FadeUp delay={0.15} className="md:col-span-8">
              <Photo
                src={meet13p[3] ?? meet13p[2]}
                alt="GaDangme Union community gathering 2013"
                className="aspect-[16/7] shadow-elevated"
              />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2012 · The First Community BBQ
      ═════════════════════════════════════════════════════════════════════*/}
      <section className="relative py-28 md:py-36 bg-heritage-warm overflow-hidden">
        <GhostYear year="2012" />
        <div className="heritage-container relative">
          <ChapterHead
            eyebrow="The Founding Year · 2012"
            title="Where It All"
            italic="Began"
            body="In the summer of 2012, the newly formed GaDangme Union hosted its very first community gathering — a barbecue that would ignite a tradition stretching over a decade. Over charcoal, music, and conversation, a community found its footing in the Netherlands."
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <FadeUp className="md:col-span-7">
              <Photo src={bbq12p[4] ?? bbq12p[0]} alt="2012 Community BBQ" className="aspect-[4/3] shadow-elevated" />
            </FadeUp>
            <div className="md:col-span-5 flex flex-col gap-4">
              <FadeUp delay={0.1}>
                <VideoBlock src={bbq12v[0]} label="Community BBQ · 2012" className="aspect-video" />
              </FadeUp>
              <FadeUp delay={0.2} className="grid grid-cols-2 gap-3">
                <Photo src={bbq12p[10]} alt="" className="aspect-square" />
                <Photo src={bbq12p[20]} alt="" className="aspect-square" />
              </FadeUp>
            </div>
          </div>

          {/* Extra row of BBQ photos */}
          <FadeUp delay={0.1} className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
            {[bbq12p[30], bbq12p[40], bbq12p[55], bbq12p[70], bbq12p[90]].map((src, i) => (
              <Photo key={i} src={src} alt="" className="aspect-square" />
            ))}
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2013 · Community Meeting + Annual BBQ
      ═════════════════════════════════════════════════════════════════════*/}
      <section className="relative py-28 md:py-36 bg-background overflow-hidden">
        <GhostYear year="2013" />
        <div className="heritage-container relative">
          <ChapterHead
            eyebrow="Growing Together · 2013"
            title="Two Events,"
            italic="One Community"
            body="One year in and growing strong. 2013 saw both the return of the annual BBQ and something new — a formal community meeting where members shaped the Union's direction. The conversations around the grill had moved to the meeting table."
          />

          {/* Meeting photos — full editorial spread */}
          <FadeUp className="mb-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-8 h-[2px] rounded-full bg-secondary" />
              <span className="section-eyebrow text-secondary">Community Meeting · January 2013</span>
            </div>
          </FadeUp>

          {/* Large meeting collage */}
          <FadeUp>
            <div className="grid grid-cols-12 gap-3 mb-3">
              <Photo src={meet13p[0]} alt="Community meeting 2013" className="col-span-8 aspect-[16/9]" />
              <Photo src={meet13p[2]} alt="" className="col-span-4 aspect-[16/9]" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="grid grid-cols-3 gap-3 mb-10">
              <Photo src={meet13p[4]}  alt="" className="aspect-square" />
              <Photo src={meet13p[6]}  alt="" className="aspect-square" />
              <Photo src={meet13p[8]}  alt="" className="aspect-square" />
            </div>
          </FadeUp>

          {/* BBQ section within 2013 */}
          <FadeUp className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-8 h-[2px] rounded-full bg-secondary" />
              <span className="section-eyebrow text-secondary">Annual BBQ · Summer 2013</span>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FadeUp>
              <div className="bg-card rounded-3xl overflow-hidden shadow-soft border border-border/60">
                <div className="grid grid-cols-2 h-60">
                  <Photo src={bbq13p[2]} alt="" className="h-full rounded-none" />
                  <div className="flex flex-col">
                    <Photo src={bbq13p[8]}  alt="" className="h-1/2 rounded-none" />
                    <Photo src={bbq13p[16]} alt="" className="h-1/2 rounded-none" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-foreground">Summer in the Netherlands</h3>
                  <p className="font-body text-[14px] text-muted-foreground leading-relaxed mt-2">
                    Families, food, and the familiar warmth of a community that had already made this tradition its own.
                  </p>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.14}>
              <div className="grid grid-cols-2 gap-3 h-full">
                <Photo src={bbq13p[20]} alt="" className="aspect-[3/4]" />
                <Photo src={bbq13p[28]} alt="" className="aspect-[3/4] mt-8" />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2015 · The Tradition Continues
      ═════════════════════════════════════════════════════════════════════*/}
      <section className="relative py-28 md:py-36 bg-heritage-warm overflow-hidden">
        <GhostYear year="2015" />
        <div className="heritage-container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-14">
            <ChapterHead
              eyebrow="The Tradition Continues · 2015"
              title="Every Year,"
              italic="Without Fail"
              body="Every summer, the same commitment: to gather, to celebrate, and to remember who we are. The 2015 BBQ drew more faces, more families, and more laughter. Some traditions are worth protecting — this is one of them."
            />
            <motion.div
              initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.2 }}
              className="pt-4 lg:pt-20"
            >
              <div className="border-l-4 border-secondary pl-7">
                <p className="font-heading text-2xl font-medium italic text-foreground leading-snug">
                  "The GaDangme spirit is not about where you are — it is about who you are with."
                </p>
                <p className="font-body text-[12px] text-muted-foreground mt-4 uppercase tracking-wider font-semibold">
                  — Community Gathering, 2015
                </p>
              </div>
            </motion.div>
          </div>

          <FadeUp>
            <VideoBlock src={bbq15v[0]} label="Community BBQ · 2015" className="w-full aspect-video mb-5 shadow-elevated" />
          </FadeUp>
          <FadeUp delay={0.1} className="grid grid-cols-3 gap-4 mt-4">
            <Photo src={bbq15p[5]}  alt="" className="aspect-[3/4]" />
            <Photo src={bbq15p[14]} alt="" className="aspect-square mt-10" />
            <Photo src={bbq15p[28]} alt="" className="aspect-[3/4] -mt-4" />
          </FadeUp>
          <FadeUp delay={0.2} className="grid grid-cols-4 gap-3 mt-4">
            {[bbq15p[35], bbq15p[40], bbq15p[38], bbq15p[42]].map((src, i) => (
              <Photo key={i} src={src} alt="" className="aspect-square" />
            ))}
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2016 · Daantaa + Philadelphia
      ═════════════════════════════════════════════════════════════════════*/}
      <section className="relative py-28 md:py-36 bg-background overflow-hidden">
        <GhostYear year="2016" />
        <div className="heritage-container relative">
          <ChapterHead
            eyebrow="Across Borders · 2016"
            title="Two Celebrations,"
            italic="One Spirit"
            body="In 2016 the Union marked two distinct moments — the Daantaa cultural celebration and a special community gathering in Philadelphia. Across borders and miles, the GaDangme spirit proved impossible to contain."
          />

          {/* Daantaa */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center mb-20">
            <FadeUp className="lg:col-span-3">
              <div className="grid grid-cols-2 gap-3">
                <Photo src={daantaa[1]} alt="Daantaa 2016" className="aspect-[4/5]" />
                <div className="flex flex-col gap-3 pt-10">
                  <Photo src={daantaa[4]} alt="" className="aspect-square" />
                  <Photo src={daantaa[8] ?? daantaa[6]} alt="" className="aspect-[4/3]" />
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.15} className="lg:col-span-2">
              <span className="section-eyebrow text-secondary block mb-4">Daantaa Celebration</span>
              <h3 className="font-heading text-3xl font-semibold text-foreground mb-4 leading-tight">
                Rooted in Culture,<br />Alive in the Diaspora
              </h3>
              <p className="font-body text-[15px] text-muted-foreground leading-[1.85]">
                The Daantaa celebration brought members together in a vibrant display of traditional music,
                dance, and cultural pride — a reminder that identity travels with you, wherever you call home.
              </p>
            </FadeUp>
          </div>

          {/* Philadelphia */}
          <FadeUp className="mb-8">
            <div className="flex items-center gap-3">
              <span className="block w-10 h-[3px] rounded-full bg-secondary" />
              <span className="section-eyebrow text-secondary">Philadelphia Gathering · 2016</span>
            </div>
          </FadeUp>
          <FadeUp>
            <div className="grid grid-cols-12 gap-3 mb-3">
              <Photo src={phila[3]}  alt="Philadelphia 2016" className="col-span-8 aspect-[16/7]" />
              <Photo src={phila[12]} alt="" className="col-span-4 aspect-[16/7]" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="grid grid-cols-3 gap-3">
              <Photo src={phila[20]} alt="" className="aspect-[3/4]" />
              <Photo src={phila[35]} alt="" className="aspect-[3/4]" />
              <Photo src={phila[50]} alt="" className="aspect-[3/4]" />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2017 · The 5th Anniversary [DARK]
      ═════════════════════════════════════════════════════════════════════*/}
      <section className="relative py-28 md:py-36 bg-primary overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-secondary/60" />
        <div className="absolute -top-6 left-0 right-0 overflow-hidden pointer-events-none select-none" aria-hidden>
          <span className="block font-heading font-bold leading-none text-primary-foreground/[0.04]"
            style={{ fontSize: 'clamp(7rem, 20vw, 18rem)' }}>2017</span>
        </div>

        <div className="heritage-container relative">
          <ChapterHead light
            eyebrow="5th Anniversary · 2017"
            title="Five Years,"
            italic="One People"
            body="The 5th Anniversary was more than a milestone — it was a declaration. Five years of welfare support, cultural celebrations, and unbreakable community bonds. The Thanksgiving Service and the Anniversary gathering brought the entire community together."
          />

          <FadeUp>
            <VideoBlock src={ann17v[0] ?? thx17v[0]} label="5th Anniversary · Official Video" className="w-full aspect-video shadow-elevated mb-5" />
          </FadeUp>

          <FadeUp className="grid grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden mb-5">
            {[{ n: '5', label: 'Years of Unity' }, { n: '100+', label: 'Members Gathered' }, { n: '2', label: 'Celebration Events' }]
              .map(({ n, label }) => (
                <div key={label} className="bg-primary px-8 py-7 text-center">
                  <p className="font-heading text-4xl font-bold text-secondary leading-none mb-1">{n}</p>
                  <p className="font-body text-[11px] text-primary-foreground/50 uppercase tracking-[0.22em] font-semibold">{label}</p>
                </div>
              ))}
          </FadeUp>

          <FadeUp>
            <div className="grid grid-cols-12 gap-3 mb-3">
              <Photo src={ann17p[10]}  alt="" className="col-span-5 aspect-[4/3]" />
              <Photo src={ann17p[25]}  alt="" className="col-span-4 aspect-[4/3]" />
              <Photo src={thx17p[6]}   alt="" className="col-span-3 aspect-[4/3]" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="grid grid-cols-12 gap-3 mb-5">
              <Photo src={thx17p[12]}  alt="" className="col-span-3 aspect-square" />
              <Photo src={ann17p[40]}  alt="" className="col-span-6 aspect-[16/7]" />
              <Photo src={ann17p[55]}  alt="" className="col-span-3 aspect-square" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1} className="grid grid-cols-2 gap-3">
            <VideoBlock src={ann17v[1] ?? thx17v[0]} label="Anniversary Celebration" className="aspect-video" />
            <VideoBlock src={thx17v[0] ?? ann17v[0]} label="Thanksgiving Service"     className="aspect-video" />
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2018 · Atadaan + AB3IBEE BII N3!
      ═════════════════════════════════════════════════════════════════════*/}
      <section className="relative py-28 md:py-36 bg-heritage-warm overflow-hidden">
        <GhostYear year="2018" />
        <div className="heritage-container relative">
          <ChapterHead
            eyebrow="Cultural Roots · 2018"
            title="Remembering"
            italic="Our Roots"
            body="The Atadaan celebration in 2018 was a moment of deep cultural reflection — a traditional ceremony connecting the living with those who came before. These recordings capture a community that refuses to let its heritage fade, even thousands of miles from home."
          />

          {/* AB3IBEE photos if loaded */}
          {ab3.length > 0 && (
            <FadeUp className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="block w-8 h-[2px] rounded-full bg-secondary" />
                <span className="section-eyebrow text-secondary">Community Gathering</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                {ab3.slice(0, 8).map((src, i) => (
                  <Photo key={i} src={src} alt="Community gathering" className="aspect-square" />
                ))}
              </div>
            </FadeUp>
          )}

          {/* Atadaan videos */}
          <FadeUp className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-8 h-[2px] rounded-full bg-secondary" />
              <span className="section-eyebrow text-secondary">Atadaan Ceremony · 2018</span>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <FadeUp>
              <VideoBlock src={atadaan[0]} label="Atadaan · Opening" className="aspect-[3/4]" />
            </FadeUp>
            <FadeUp delay={0.1} className="md:-mt-10">
              <VideoBlock src={atadaan[2]} label="Cultural Performance" className="aspect-[3/4]" />
            </FadeUp>
            <FadeUp delay={0.2} className="md:mt-6">
              <VideoBlock src={atadaan[4]} label="Community Gathering" className="aspect-[3/4]" />
            </FadeUp>
          </div>

          {atadaan.length > 3 && (
            <FadeUp delay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {atadaan.slice(3, 6).map((v, i) => (
                <VideoBlock key={v} src={v} label={`Moment ${i + 4}`} className="aspect-video" />
              ))}
            </FadeUp>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CLOSING CTA
      ═════════════════════════════════════════════════════════════════════*/}
      <section className="relative py-32 overflow-hidden">
        <img src={ann17p[30] ?? thx17p[10]} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/93 via-primary/85 to-[#061a1a]/95" />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-secondary/50" />

        <motion.div
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.75 }}
          className="relative heritage-container text-center"
        >
          <div className="flex justify-center mb-6">
            <span className="section-eyebrow text-secondary/80">More to Explore</span>
          </div>
          <h2
            className="font-heading font-semibold text-white mb-6 mx-auto"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', letterSpacing: '-0.022em', lineHeight: '1.06', maxWidth: '660px' }}
          >
            The Story Doesn't<br /><em className="not-italic text-secondary">Stop Here</em>
          </h2>
          <p className="font-body text-white/58 text-[15px] max-w-md mx-auto mb-11 leading-[1.85]">
            Browse the full photo gallery for hundreds more moments from every event,
            or get in touch to become part of the next chapter.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/gallery" className="btn-heritage-gold group">
              Full Gallery
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/contact" className="btn-heritage-outline border-white/30 text-white hover:bg-white hover:text-primary">
              Join the Community
            </Link>
          </div>
        </motion.div>
      </section>

    </Layout>
  );
}
