import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// Mapping of legal namespace names to their file paths (relative to messages/)
const LEGAL_NAMESPACES = {
  termsOfService: 'legal/terms-of-service',
  cookiePolicy: 'legal/cookie-policy',
  privacyPolicy: 'legal/privacy-policy',
  dataProtection: 'legal/data-protection'
};

// Deep merge function to properly merge nested translation objects
function deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that the incoming locale is valid
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Load the root locale file
  const rootMessages = (await import(`../../messages/${locale}.json`)).default;

  // Load legal namespace files from nested directory
  let mergedMessages = { ...rootMessages };
  
  const loadPromises = Object.entries(LEGAL_NAMESPACES).map(async ([namespace, path]) => {
    try {
      const legalFile = await import(`../../messages/${path}.${locale}.json`);
      // Deep merge the legal namespace into messages, allowing nested properties to override
      mergedMessages = deepMerge(mergedMessages, legalFile.default);
    } catch (error) {
      // File doesn't exist, skip silently
      console.warn(`Legal namespace "${namespace}" not found for locale "${locale}"`);
    }
  });
  
  await Promise.all(loadPromises);

  return {
    locale,
    messages: mergedMessages
  };
});
