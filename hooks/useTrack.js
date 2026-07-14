'use client';

import { useCallback } from 'react';
import { useSession } from 'next-auth/react';

export function useTrack() {
  const { data: session } = useSession();

  const track = useCallback((eventType, metadata = {}) => {
    let sessionId;
    try {
      sessionId = typeof window !== 'undefined' ? localStorage.getItem('hop_session_id') : null;
    } catch {}

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, metadata, sessionId }),
    }).catch(() => {});
  }, []);

  return { track };
}
