import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description: string;
  image?: string;
}

const setMeta = (selector: string, content: string) => {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) el.setAttribute('content', content);
};

/**
 * Updates document.title and OG/Twitter meta tags per page.
 * Note: this only helps crawlers that execute JS (Google, LinkedIn).
 * WhatsApp/Facebook/Twitter fetch raw HTML and won't see these updates —
 * that requires prerendering the route, which is a separate, larger change.
 */
export function usePageMeta({ title, description, image }: PageMeta) {
  useEffect(() => {
    const fullTitle = `${title} | GaDangme Union - The Netherlands`;
    document.title = fullTitle;

    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', description);
    if (image) {
      setMeta('meta[property="og:image"]', image);
      setMeta('meta[name="twitter:image"]', image);
    }
  }, [title, description, image]);
}
