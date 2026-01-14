'use client';

import { useEffect, useState } from 'react';

export function useHasLanguageCookie(): boolean {
  const [hasCookie, setHasCookie] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const hasLanguageCookie = cookies.some((cookie) =>
      cookie.trim().startsWith('NEXT_LOCALE=')
    );
    setHasCookie(hasLanguageCookie);
  }, []);

  return hasCookie;
}
