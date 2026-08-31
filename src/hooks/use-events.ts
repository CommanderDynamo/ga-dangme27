import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type EventRow = Tables<'events'>;

export type EventStatus = 'past' | 'current' | 'upcoming';

export const getEventStatus = (startDate: string, endDate?: string | null): EventStatus => {
  const now = new Date();
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate ?? startDate}T23:59:59`);
  if (now > end) return 'past';
  if (now >= start) return 'current';
  return 'upcoming';
};

// Shown only if the `events` table isn't reachable yet (migration not run)
// or is empty — keeps pages from looking broken while the DB is being set up.
export const FALLBACK_EVENT: EventRow = {
  id: '',
  title: 'HOMOWO Festival',
  description:
    'Come and celebrate HOMOWO Festival with us in Amsterdam. Meet GaDangmes from across the Netherlands as we honour our heritage together.',
  location: 'Amsterdam, The Netherlands',
  poster_url: '/og-events-poster.jpg',
  start_date: '2026-09-19',
  end_date: null,
  created_at: '',
};

interface UseEventsResult {
  events: EventRow[];
  loading: boolean;
  error: string | null;
}

/**
 * Fetches events from the `events` table. If the table doesn't exist yet
 * (the migration hasn't been run) or the request fails for any reason,
 * `events` comes back empty and `error` is set — callers should fall back
 * to static content rather than showing a broken page.
 */
export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          setError(fetchError.message);
          setEvents([]);
        } else {
          setEvents(data ?? []);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { events, loading, error };
}
