import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, FolderOpen, ChevronRight, ArrowLeft, Play } from 'lucide-react';
import Layout from '@/components/Layout';
import Lightbox from '@/components/Lightbox';
import { usePageMeta } from '@/hooks/use-page-meta';



const _thanksMods = import.meta.glob(
  '../assets/5TH ANNIVERSARY THANKSGIVING SERVICE/*.JPG',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const _thanksVideoMods = import.meta.glob(
  '../assets/5TH ANNIVERSARY THANKSGIVING SERVICE/*.MP4',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const annImages = Object.keys(_thanksMods).sort().map(k => _thanksMods[k]);
const annVideos  = Object.keys(_thanksVideoMods).sort().map(k => _thanksVideoMods[k]);


const _ann5Upper = import.meta.glob(
  '../assets/5TH ANNIVERSARY/*.JPG',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const _ann5Lower = import.meta.glob(
  '../assets/5TH ANNIVERSARY/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const _ann5Gif = import.meta.glob(
  '../assets/5TH ANNIVERSARY/*.gif',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const _ann5VideoUpper = import.meta.glob(
  '../assets/5TH ANNIVERSARY/*.MP4',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const _ann5VideoLower = import.meta.glob(
  '../assets/5TH ANNIVERSARY/*.mp4',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const _ann5All = { ..._ann5Upper, ..._ann5Lower, ..._ann5Gif };
const _ann5VideoAll = { ..._ann5VideoUpper, ..._ann5VideoLower };

const ann5Images = [...new Set(Object.keys(_ann5All).sort().map(k => _ann5All[k]))];
const ann5Videos = [...new Set(Object.keys(_ann5VideoAll).sort().map(k => _ann5VideoAll[k]))];

// 2012 BBQ
const _bbq2012Mods = import.meta.glob(
  '../assets/2012 BBQ/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const _bbq2012VideoMods = import.meta.glob(
  '../assets/2012 BBQ/*.mp4',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const bbq2012Images = Object.keys(_bbq2012Mods).sort().map(k => _bbq2012Mods[k]);
const bbq2012Videos = Object.keys(_bbq2012VideoMods).sort().map(k => _bbq2012VideoMods[k]);

// 2013 BBQ
const _bbq2013Mods = import.meta.glob(
  '../assets/2013 BBQ/*.JPG',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const bbq2013Images = Object.keys(_bbq2013Mods).sort().map(k => _bbq2013Mods[k]);

// 2013 Ga Dan Meeting
const _meeting2013Mods = import.meta.glob(
  '../assets/2013 Ga dan meeting/*.JPG',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const meeting2013Images = Object.keys(_meeting2013Mods).sort().map(k => _meeting2013Mods[k]);

// 2015 Barbeque
const _bbq2015Mods = import.meta.glob(
  '../assets/2015 BABBEQUE/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const _bbq2015VideoMods = import.meta.glob(
  '../assets/2015 BABBEQUE/*.mp4',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const bbq2015Images = Object.keys(_bbq2015Mods).sort().map(k => _bbq2015Mods[k]);
const bbq2015Videos = Object.keys(_bbq2015VideoMods).sort().map(k => _bbq2015VideoMods[k]);

// 2016 Daantaa
const _daantaa2016Mods = import.meta.glob(
  '../assets/2016 DAANTAA/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const daantaa2016Images = Object.keys(_daantaa2016Mods).sort().map(k => _daantaa2016Mods[k]);

// 2016 Philadelphia
const _philly2016Mods = import.meta.glob(
  '../assets/2016 PHILADEPHIA/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const philly2016Images = Object.keys(_philly2016Mods).sort().map(k => _philly2016Mods[k]);

// 2018 Atadaan (videos only)
const _atadaan2018Mods = import.meta.glob(
  '../assets/2018 ATADAAN/*.mp4',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const atadaan2018Videos = Object.keys(_atadaan2018Mods).sort().map(k => _atadaan2018Mods[k]);

// Aharabata – January Calendar 2018
const _aharabataMods = import.meta.glob(
  '../assets/AHARABATA-JANUARY  CALENDAR PATRONAGE 2018/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const aharabataImages = Object.keys(_aharabataMods).sort().map(k => _aharabataMods[k]);

// Ab3ibee Bii N3!
const _ab3ibeeMods = import.meta.glob(
  '../assets/AB3IBEE BII N3!/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const ab3ibeeImages = Object.keys(_ab3ibeeMods).sort().map(k => _ab3ibeeMods[k]);


// New event albums
const _alemleBiiMods = import.meta.glob(
  '../assets/ALEMLE BII\\(NOVEMBER\\) 2018/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const alemleBiiImages = Object.keys(_alemleBiiMods).sort().map(k => _alemleBiiMods[k]);

const _susanOyooMods = import.meta.glob(
  '../assets/AT BURIALFINAL FUNERAL RITES OF OUR DEAR MRS SUSAN OYOO BOYE-QUARTEY/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const susanOyooImages = Object.keys(_susanOyooMods).sort().map(k => _susanOyooMods[k]);

const _edmundMensahMods = import.meta.glob(
  '../assets/AT ELDER EDMUND MENSAH’S RETIREMENT SERVICE AT COP AMSTERDAM 30TH SEPTEMBER 2018/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const edmundMensahImages = Object.keys(_edmundMensahMods).sort().map(k => _edmundMensahMods[k]);

const _nyemimeiAkpeeMods = import.meta.glob(
  '../assets/CELEBRATEATE WITH NY3MIM3I AKPEE GADANGME EUROPE-SAT.6TH OCTOBER 2018/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const nyemimeiAkpeeImages = Object.keys(_nyemimeiAkpeeMods).sort().map(k => _nyemimeiAkpeeMods[k]);

const _stephenQuayeMods = import.meta.glob(
  '../assets/CELEBRATED THE BIRTHDAY OF ONE OF THE FINESTRESPECTED ELDERS \\(MR STEPHEN KLOTEI QUAYE\\)/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const stephenQuayeImages = Object.keys(_stephenQuayeMods).sort().map(k => _stephenQuayeMods[k]);

const _daaviComfortMods = import.meta.glob(
  '../assets/DAAVI COMFORT’S MUM FUNERAL/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const daaviComfortImages = Object.keys(_daaviComfortMods).sort().map(k => _daaviComfortMods[k]);

const _florenceNorteyMods = import.meta.glob(
  '../assets/FLORENCE NORTEY’S CHILD DEDICATION/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const florenceNorteyImages = Object.keys(_florenceNorteyMods).sort().map(k => _florenceNorteyMods[k]);

const _ericVanEsMods = import.meta.glob(
  '../assets/JOINED BROTHER ERIC VAN ES TO MOURN THE PASSING TO GLORY OF THE LATE MOTHER, 2018/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const _ericVanEsVideoMods = import.meta.glob(
  '../assets/JOINED BROTHER ERIC VAN ES TO MOURN THE PASSING TO GLORY OF THE LATE MOTHER, 2018/*.mp4',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const ericVanEsImages = Object.keys(_ericVanEsMods).sort().map(k => _ericVanEsMods[k]);
const ericVanEsVideos = Object.keys(_ericVanEsVideoMods).sort().map(k => _ericVanEsVideoMods[k]);

const _paulNeequayeMods = import.meta.glob(
  '../assets/MR PAUL ASHIE NEEQUAYE’S BIRTHDAY CELEBRATION/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const paulNeequayeImages = Object.keys(_paulNeequayeMods).sort().map(k => _paulNeequayeMods[k]);

const _niiAmsterdamMods = import.meta.glob(
  '../assets/NII AMSTERDAM’S CHILD DEDICATION JUNE 2018/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const niiAmsterdamImages = Object.keys(_niiAmsterdamMods).sort().map(k => _niiAmsterdamMods[k]);

const _ortegaWeddingMods = import.meta.glob(
  '../assets/ORTEGA’S WEDDING/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const _ortegaWeddingGifMods = import.meta.glob(
  '../assets/ORTEGA’S WEDDING/*.gif',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const ortegaWeddingImages = [...Object.keys(_ortegaWeddingMods).sort().map(k => _ortegaWeddingMods[k]), ...Object.keys(_ortegaWeddingGifMods).sort().map(k => _ortegaWeddingGifMods[k])];

const _otsokrikriMods = import.meta.glob(
  '../assets/OTSOKRIKRI THE GREAT/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const _otsokrikriGifMods = import.meta.glob(
  '../assets/OTSOKRIKRI THE GREAT/*.gif',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const otsokrikriImages = [...Object.keys(_otsokrikriMods).sort().map(k => _otsokrikriMods[k]), ...Object.keys(_otsokrikriGifMods).sort().map(k => _otsokrikriGifMods[k])];

const _philly2014Mods = import.meta.glob(
  '../assets/PHILADEPHIA 2014/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const philly2014Images = Object.keys(_philly2014Mods).sort().map(k => _philly2014Mods[k]);

const _philly2018DecMods = import.meta.glob(
  '../assets/PHILADEPHIA DECEMBER 2018/*.mp4',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const philly2018DecVideos = Object.keys(_philly2018DecMods).sort().map(k => _philly2018DecMods[k]);

const _thanksgivingServiceMods = import.meta.glob(
  '../assets/THANKSGIVING SERVICE/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const _thanksgivingServiceVideoMods = import.meta.glob(
  '../assets/THANKSGIVING SERVICE/*.mp4',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const thanksgivingServiceImages = Object.keys(_thanksgivingServiceMods).sort().map(k => _thanksgivingServiceMods[k]);
const thanksgivingServiceVideos = Object.keys(_thanksgivingServiceVideoMods).sort().map(k => _thanksgivingServiceVideoMods[k]);

const _rebeccaGidimadjorMods = import.meta.glob(
  '../assets/THANKSGIVING SERVICE- MAMA REBECCA GIDIMADJOR’S LATE MUM/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const rebeccaGidimadjorImages = Object.keys(_rebeccaGidimadjorMods).sort().map(k => _rebeccaGidimadjorMods[k]);

const _niiBaahMotherMods = import.meta.glob(
  '../assets/THE LATE NII BAAH’S LATE MOTHER’S THANKSGIVING SERVICE/*.jpg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const niiBaahMotherImages = Object.keys(_niiBaahMotherMods).sort().map(k => _niiBaahMotherMods[k]);

const _philanthropistVisitMods = import.meta.glob(
  '../assets/VISITATION TO A PHILANTHROPIST/*.jpeg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const philanthropistVisitImages = Object.keys(_philanthropistVisitMods).sort().map(k => _philanthropistVisitMods[k]);

const _fredRomeoSonMods = import.meta.glob(
  "../assets/funeral rites bro Fred Romeo's Late son/*.jpeg",
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const fredRomeoSonImages = Object.keys(_fredRomeoSonMods).sort().map(k => _fredRomeoSonMods[k]);

// ─── Data ─────────────────────────────────────────────────────────────────────

export interface GalleryImage {
  src: string;
  caption: string;
  type?: 'image' | 'video';
}

export interface Album {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  coverType?: 'video';
  images: GalleryImage[];
}

const toImgs = (srcs: string[], label: string): GalleryImage[] =>
  srcs.map((src, i) => ({ src, caption: `${label} · Photo ${i + 1}` }));

const toVids = (srcs: string[], label: string): GalleryImage[] =>
  srcs.map((src, i) => ({ src, type: 'video' as const, caption: `${label} · Video ${i + 1}` }));

// Remove any items whose src has already been seen
const dedup = (items: GalleryImage[]): GalleryImage[] => {
  const seen = new Set<string>();
  return items.filter(item => !seen.has(item.src) && !!seen.add(item.src));
};

// Detailed captions for the Thanksgiving Service album
const thanksCaptions = [
  'GaDangme Union Member in Traditional Attire',
  'Traditional GaDangme Dress at the Thanksgiving Service',
  'Member Arriving in Traditional Kente Wear',
  'Members Gathering on the Staircase',
  'GaDangme Union Members in Matching Outfits',
  'Ladies of the Union in Colourful Attire',
  'Union Member in Elegant Blue & White Dress',
  'Showcasing Traditional GaDangme Fashion',
  'Union Member in Stunning Traditional Costume',
  'GaDangme Traditional Wear on Display',
  'Members in Vibrant Traditional Outfits',
  'Colourful Traditional Dress Before the Service',
  'Members Mingling Before the Ceremony',
  'The Audience at the 5th Anniversary Thanksgiving Service',
  'Guests Seated at the Thanksgiving Programme',
  'Full House at the GaDangme Union Thanksgiving',
  'MC Addressing the Thanksgiving Gathering',
  'Colourful Crowd at the Anniversary Thanksgiving',
  'Programme Underway at the Thanksgiving Service',
  'Community Members Enjoying the Thanksgiving Celebration',
  'Cultural Dance Performance at the Thanksgiving Service',
  'Members Dancing in Traditional Union Attire',
  'Energetic Dance Display at the Anniversary',
  'Traditional Dance in Full Flow',
  'Union Members Performing Cultural Dance',
  'Joyful Dance Performance at the Thanksgiving',
  'GaDangme Cultural Dance Celebration',
  'Dancers in Traditional Attire',
  'Vibrant Dance Performance at the Anniversary',
  'Members Showcasing Traditional Dance Moves',
  'Community Coming Together Through Dance',
  'GaDangme Cultural Expression in Dance',
  'Traditional Dance at the Thanksgiving Ceremony',
  'Closing Dance Performance of the Anniversary',
  'Group Photo After the Thanksgiving Service',
  'Members Celebrating at the Anniversary',
  'Final Moments of the 5th Anniversary Thanksgiving',
];

export const albums: Album[] = [
  // ── Chronological order ──────────────────────────────────────────────────────
  {
    id: '2012-bbq',
    title: '2012 BBQ',
    subtitle: 'GaDangme Union Netherlands · Summer 2012',
    coverImage: bbq2012Images[0] ?? '',
    images: dedup([...toImgs(bbq2012Images, '2012 BBQ'), ...toVids(bbq2012Videos, '2012 BBQ')]),
  },
  {
    id: '2013-bbq',
    title: '2013 BBQ',
    subtitle: 'GaDangme Union Netherlands · Summer 2013',
    coverImage: bbq2013Images[0] ?? '',
    images: dedup(toImgs(bbq2013Images, '2013 BBQ')),
  },
  {
    id: '2013-ga-dan-meeting',
    title: '2013 Ga Dan Meeting',
    subtitle: 'GaDangme Union Netherlands · 2013',
    coverImage: meeting2013Images[0] ?? '',
    images: dedup(toImgs(meeting2013Images, '2013 Ga Dan Meeting')),
  },
  {
    id: '2015-barbeque',
    title: '2015 Barbeque',
    subtitle: 'GaDangme Union Netherlands · 2015',
    coverImage: bbq2015Images[0] ?? '',
    images: dedup([...toImgs(bbq2015Images, '2015 Barbeque'), ...toVids(bbq2015Videos, '2015 Barbeque')]),
  },
  {
    id: '2016-daantaa',
    title: '2016 Daantaa',
    subtitle: 'GaDangme Union Netherlands · 2016',
    coverImage: daantaa2016Images[0] ?? '',
    images: dedup(toImgs(daantaa2016Images, '2016 Daantaa')),
  },
  {
    id: '2016-philadelphia',
    title: '2016 Philadelphia',
    subtitle: 'GaDangme Union Netherlands · Philadelphia 2016',
    coverImage: philly2016Images[0] ?? '',
    images: dedup(toImgs(philly2016Images, '2016 Philadelphia')),
  },
  {
    id: '5th-anniversary-thanksgiving',
    title: '5th Anniversary Thanksgiving Service',
    subtitle: 'GaDangme Union Netherlands · July 2017',
    coverImage: annImages[13] ?? annImages[0],
    images: dedup([
      ...annImages.map((src, i) => ({ src, caption: thanksCaptions[i] ?? `Photo ${i + 1}` })),
      ...toVids(annVideos, '5th Anniversary Thanksgiving Service'),
    ]),
  },
  {
    id: '5th-anniversary',
    title: '5th Anniversary',
    subtitle: 'GaDangme Union Netherlands · July 2017',
    coverImage: ann5Images[0] ?? '',
    images: dedup([
      ...toImgs(ann5Images, '5th Anniversary'),
      ...toVids(ann5Videos, '5th Anniversary'),
    ]),
  },
  {
    id: 'aharabata-jan-2018',
    title: 'Aharabata – January Calendar 2018',
    subtitle: 'GaDangme Union Netherlands · January 2018',
    coverImage: aharabataImages[0] ?? '',
    images: dedup(toImgs(aharabataImages, 'Aharabata – January Calendar 2018')),
  },
  {
    id: '2018-atadaan',
    title: '2018 Atadaan',
    subtitle: 'GaDangme Union Netherlands · 2018',
    coverImage: atadaan2018Videos[0] ?? '',
    coverType: 'video',
    images: dedup(toVids(atadaan2018Videos, '2018 Atadaan')),
  },
  {
    id: 'ab3ibee-bii-n3',
    title: 'Ab3ibee Bii N3!',
    subtitle: 'GaDangme Union Netherlands',
    coverImage: ab3ibeeImages[0] ?? '',
    images: dedup(toImgs(ab3ibeeImages, 'Ab3ibee Bii N3!')),
  },

  {
    id: 'alemle-bii-nov-2018',
    title: 'Alemle Bii',
    subtitle: 'GaDangme Union Netherlands · November 2018',
    coverImage: alemleBiiImages[0] ?? '',
    images: dedup(toImgs(alemleBiiImages, 'Alemle Bii')),
  },
  {
    id: 'susan-oyoo-boye-quartey-funeral',
    title: 'Funeral Rites of Mrs Susan Oyoo Boye-Quartey',
    subtitle: 'GaDangme Union Netherlands',
    coverImage: susanOyooImages[0] ?? '',
    images: dedup(toImgs(susanOyooImages, 'Funeral Rites of Mrs Susan Oyoo Boye-Quartey')),
  },
  {
    id: 'edmund-mensah-retirement-2018',
    title: 'Elder Edmund Mensah’s Retirement Service',
    subtitle: 'COP Amsterdam · 30 September 2018',
    coverImage: edmundMensahImages[0] ?? '',
    images: dedup(toImgs(edmundMensahImages, 'Elder Edmund Mensah’s Retirement Service')),
  },
  {
    id: 'nyemimei-akpee-europe-2018',
    title: 'Celebrating with Ny3mim3i Akpee',
    subtitle: 'GaDangme Europe · 6 October 2018',
    coverImage: nyemimeiAkpeeImages[0] ?? '',
    images: dedup(toImgs(nyemimeiAkpeeImages, 'Celebrating with Ny3mim3i Akpee')),
  },
  {
    id: 'stephen-klotei-quaye-birthday',
    title: 'Birthday Celebration — Mr Stephen Klotei Quaye',
    subtitle: 'GaDangme Union Netherlands',
    coverImage: stephenQuayeImages[0] ?? '',
    images: dedup(toImgs(stephenQuayeImages, 'Birthday Celebration — Mr Stephen Klotei Quaye')),
  },
  {
    id: 'daavi-comfort-mum-funeral',
    title: 'Daavi Comfort’s Mum — Funeral',
    subtitle: 'GaDangme Union Netherlands',
    coverImage: daaviComfortImages[0] ?? '',
    images: dedup(toImgs(daaviComfortImages, 'Daavi Comfort’s Mum — Funeral')),
  },
  {
    id: 'florence-nortey-child-dedication',
    title: 'Florence Nortey’s Child Dedication',
    subtitle: 'GaDangme Union Netherlands',
    coverImage: florenceNorteyImages[0] ?? '',
    images: dedup(toImgs(florenceNorteyImages, 'Florence Nortey’s Child Dedication')),
  },
  {
    id: 'eric-van-es-late-mother-2018',
    title: 'Mourning with Brother Eric van Es',
    subtitle: 'In memory of his late mother · 2018',
    coverImage: ericVanEsImages[0] ?? '',
    images: dedup([
      ...toImgs(ericVanEsImages, 'Mourning with Brother Eric van Es'),
      ...toVids(ericVanEsVideos, 'Mourning with Brother Eric van Es'),
    ]),
  },
  {
    id: 'paul-ashie-neequaye-birthday',
    title: 'Mr Paul Ashie Neequaye’s Birthday Celebration',
    subtitle: 'GaDangme Union Netherlands',
    coverImage: paulNeequayeImages[0] ?? '',
    images: dedup(toImgs(paulNeequayeImages, 'Mr Paul Ashie Neequaye’s Birthday Celebration')),
  },
  {
    id: 'nii-amsterdam-child-dedication-2018',
    title: 'Nii Amsterdam’s Child Dedication',
    subtitle: 'June 2018',
    coverImage: niiAmsterdamImages[0] ?? '',
    images: dedup(toImgs(niiAmsterdamImages, 'Nii Amsterdam’s Child Dedication')),
  },
  {
    id: 'ortegas-wedding',
    title: 'Ortega’s Wedding',
    subtitle: 'GaDangme Union Netherlands',
    coverImage: ortegaWeddingImages[0] ?? '',
    images: dedup(toImgs(ortegaWeddingImages, 'Ortega’s Wedding')),
  },
  {
    id: 'otsokrikri-the-great',
    title: 'Otsokrikri the Great',
    subtitle: 'GaDangme Union Netherlands',
    coverImage: otsokrikriImages[0] ?? '',
    images: dedup(toImgs(otsokrikriImages, 'Otsokrikri the Great')),
  },
  {
    id: 'philadelphia-2014',
    title: 'Philadelphia 2014',
    subtitle: 'GaDangme Union Netherlands · 2014',
    coverImage: philly2014Images[0] ?? '',
    images: dedup(toImgs(philly2014Images, 'Philadelphia 2014')),
  },
  {
    id: 'philadelphia-december-2018',
    title: 'Philadelphia Gathering',
    subtitle: 'GaDangme Union Netherlands · December 2018',
    coverImage: philly2018DecVideos[0] ?? '',
    coverType: 'video',
    images: dedup(toVids(philly2018DecVideos, 'Philadelphia Gathering · December 2018')),
  },
  {
    id: 'thanksgiving-service',
    title: 'Thanksgiving Service',
    subtitle: 'GaDangme Union Netherlands',
    coverImage: thanksgivingServiceImages[0] ?? '',
    images: dedup([
      ...toImgs(thanksgivingServiceImages, 'Thanksgiving Service'),
      ...toVids(thanksgivingServiceVideos, 'Thanksgiving Service'),
    ]),
  },
  {
    id: 'rebecca-gidimadjor-late-mum-thanksgiving',
    title: 'Thanksgiving Service — Mama Rebecca Gidimadjor’s Late Mum',
    subtitle: 'GaDangme Union Netherlands',
    coverImage: rebeccaGidimadjorImages[0] ?? '',
    images: dedup(toImgs(rebeccaGidimadjorImages, 'Thanksgiving Service — Mama Rebecca Gidimadjor’s Late Mum')),
  },
  {
    id: 'nii-baah-late-mother-thanksgiving',
    title: 'Thanksgiving Service — Nii Baah’s Late Mother',
    subtitle: 'GaDangme Union Netherlands',
    coverImage: niiBaahMotherImages[0] ?? '',
    images: dedup(toImgs(niiBaahMotherImages, 'Thanksgiving Service — Nii Baah’s Late Mother')),
  },
  {
    id: 'visitation-to-a-philanthropist',
    title: 'Visitation to a Philanthropist',
    subtitle: 'GaDangme Union Netherlands',
    coverImage: philanthropistVisitImages[0] ?? '',
    images: dedup(toImgs(philanthropistVisitImages, 'Visitation to a Philanthropist')),
  },
  {
    id: 'fred-romeo-late-son-funeral',
    title: 'Funeral Rites — Bro Fred Romeo’s Late Son',
    subtitle: 'GaDangme Union Netherlands',
    coverImage: fredRomeoSonImages[0] ?? '',
    images: dedup(toImgs(fredRomeoSonImages, 'Funeral Rites — Bro Fred Romeo’s Late Son')),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const Gallery = () => {
  usePageMeta({
    title: 'Gallery',
    description: 'Browse photo and video albums from GaDangme Union events across the Netherlands.',
  });

  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openAlbum = (album: Album) => setActiveAlbum(album);
  const closeAlbum = () => setActiveAlbum(null);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);

  const goToPrev = useCallback(() => {
    if (!activeAlbum) return;
    setCurrentIndex(prev => (prev === 0 ? activeAlbum.images.length - 1 : prev - 1));
  }, [activeAlbum]);

  const goToNext = useCallback(() => {
    if (!activeAlbum) return;
    setCurrentIndex(prev => (prev === activeAlbum.images.length - 1 ? 0 : prev + 1));
  }, [activeAlbum]);

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full border border-primary-foreground" />
        </div>
        <div className="heritage-container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4 font-body text-sm text-primary-foreground/70">
              <span
                className={activeAlbum ? 'cursor-pointer hover:text-secondary transition-colors' : ''}
                onClick={activeAlbum ? closeAlbum : undefined}
              >
                Photo Gallery
              </span>
              {activeAlbum && (
                <>
                  <ChevronRight size={14} />
                  <span className="text-secondary">{activeAlbum.title}</span>
                </>
              )}
            </div>

            <span className="inline-block px-4 py-1.5 mb-4 bg-secondary/20 text-secondary rounded-full font-body text-sm border border-secondary/30">
              <Camera size={14} className="inline mr-2" />
              {activeAlbum ? activeAlbum.title : 'Photo Gallery'}
            </span>

            <h1 className="heritage-heading text-primary-foreground mb-6 text-4xl md:text-6xl">
              {activeAlbum ? activeAlbum.title : 'Gallery'}
            </h1>
            <p className="heritage-text text-primary-foreground/85 text-lg max-w-2xl">
              {activeAlbum
                ? activeAlbum.subtitle
                : 'Explore our collection of photos and videos from GaDangme Union events and cultural celebrations in The Netherlands.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="heritage-section bg-background">
        <div className="heritage-container">
          <AnimatePresence mode="wait">

            {/* ── Albums grid ── */}
            {!activeAlbum && (
              <motion.div
                key="albums"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="heritage-heading text-2xl md:text-3xl mb-8 text-foreground">Albums</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {albums.map((album) => {
                    const photoCount = album.images.filter(i => i.type !== 'video').length;
                    const videoCount = album.images.filter(i => i.type === 'video').length;
                    const badge = [
                      photoCount > 0 && `${photoCount} photos`,
                      videoCount > 0 && `${videoCount} videos`,
                    ].filter(Boolean).join(' · ');

                    return (
                      <motion.div
                        key={album.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="group cursor-pointer"
                        onClick={() => openAlbum(album)}
                      >
                        <div className="relative">
                          <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-2xl bg-secondary/30" />
                          <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-2xl bg-secondary/20" />

                          <div className="relative overflow-hidden rounded-2xl aspect-[4/3] shadow-soft hover:shadow-elevated transition-shadow duration-500">
                            {album.coverType === 'video' ? (
                              <video
                                src={album.coverImage}
                                muted
                                preload="metadata"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <img
                                src={album.coverImage}
                                alt={album.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-heritage-dark/90 via-heritage-dark/30 to-transparent" />

                            <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-secondary/80 backdrop-blur-sm flex items-center justify-center">
                              <FolderOpen size={18} className="text-primary" />
                            </div>

                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary-foreground/20 backdrop-blur-sm">
                              <span className="font-body text-xs text-primary-foreground font-semibold">{badge}</span>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-5">
                              <h3 className="font-subheading text-xl text-primary-foreground font-bold mb-1">
                                {album.title}
                              </h3>
                              <p className="font-body text-sm text-primary-foreground/80">{album.subtitle}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── Album detail view ── */}
            {activeAlbum && (
              <motion.div
                key="album-photos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <button
                  onClick={closeAlbum}
                  className="flex items-center gap-2 mb-8 font-body text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  Back to Albums
                </button>

                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="heritage-heading text-2xl md:text-3xl text-foreground">
                      {activeAlbum.title}
                    </h2>
                    <p className="font-body text-sm text-muted-foreground mt-1">
                      {activeAlbum.subtitle} · {activeAlbum.images.length} items
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {activeAlbum.images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(index * 0.03, 0.5), duration: 0.5 }}
                      className="group cursor-pointer"
                      onClick={() => openLightbox(index)}
                    >
                      <div className="relative overflow-hidden rounded-xl aspect-[4/3] shadow-soft hover:shadow-elevated transition-shadow duration-500">
                        {image.type === 'video' ? (
                          <>
                            <video
                              src={image.src}
                              muted
                              preload="metadata"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-heritage-dark/40 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-primary-foreground/25 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Play size={20} className="text-primary-foreground ml-1" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={image.src}
                              alt={image.caption}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-heritage-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                              <p className="font-body text-xs text-primary-foreground font-medium leading-snug">
                                {image.caption}
                              </p>
                            </div>
                            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Camera size={14} className="text-primary-foreground" />
                            </div>
                          </>
                        )}

                        {/* Item number */}
                        <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-primary/70 backdrop-blur-sm flex items-center justify-center">
                          <span className="font-body text-[10px] text-primary-foreground font-bold">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      {activeAlbum && (
        <Lightbox
          images={activeAlbum.images}
          currentIndex={currentIndex}
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </Layout>
  );
};

export default Gallery;
