import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// Mapping of legal namespace names to their file paths (relative to messages/)
const LEGAL_NAMESPACES = {
  termsOfService: 'legal/terms-of-service',
  cookiePolicy: 'legal/cookie-policy',
  privacyPolicy: 'legal/privacy-policy',
  dataProtection: 'legal/data-protection'
};

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
  const legalMessages: Record<string, any> = {};
  
  const loadPromises = Object.entries(LEGAL_NAMESPACES).map(async ([namespace, path]) => {
    try {
      const legalFile = await import(`../../messages/${path}.${locale}.json`);
      legalMessages[namespace] = legalFile.default;
    } catch (error) {
      // File doesn't exist, skip silently
      console.warn(`Legal namespace "${namespace}" not found for locale "${locale}"`);
    }
  });
  
  await Promise.all(loadPromises);

  // Merge root messages with legal messages
  // Legal messages are nested under their namespace keys
  const mergedMessages = {
    ...rootMessages,
    ...legalMessages
  };

  return {
    locale,
    messages: mergedMessages
  };
});