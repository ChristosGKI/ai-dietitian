'use client';

import { useEffect, useState } from 'react';

export function useHasLegalAcceptance(): boolean {
  const [hasAccepted, setHasAccepted] = useState(false);

  useEffect(() => {
    // Check if legal_accepted cookie exists (any value means accepted)
    const cookies = document.cookie.split(';');
    const hasLegalCookie = cookies.some((cookie) => {
      const [name, value] = cookie.trim().split('=');
      return name === 'legal_accepted' && value !== '';
    });
    setHasAccepted(hasLegalCookie);
  }, []);

  return hasAccepted;
}