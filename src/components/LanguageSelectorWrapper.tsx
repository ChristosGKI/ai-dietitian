'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const LanguageSelector = dynamic(
  () => import('./LanguageSelectorPopup').then((mod) => mod.LanguageSelector),
  { ssr: false }
);

export function LanguageSelectorWrapper() {
  const [mounted, setMounted] = useState(false);
  
  // Wait for mount to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  
  return <LanguageSelector />;
}