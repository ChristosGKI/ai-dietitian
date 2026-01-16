// EU country codes for GDPR compliance
// Source: Official EU member states (27 countries after Brexit)
export const EU_COUNTRY_CODES = [
  'AT', // Austria
  'BE', // Belgium
  'BG', // Bulgaria
  'HR', // Croatia
  'CY', // Cyprus
  'CZ', // Czech Republic
  'DK', // Denmark
  'EE', // Estonia
  'FI', // Finland
  'FR', // France
  'DE', // Germany
  'GR', // Greece
  'HU', // Hungary
  'IE', // Ireland
  'IT', // Italy
  'LV', // Latvia
  'LT', // Lithuania
  'LU', // Luxembourg
  'MT', // Malta
  'NL', // Netherlands
  'PL', // Poland
  'PT', // Portugal
  'RO', // Romania
  'SK', // Slovakia
  'SI', // Slovenia
  'ES', // Spain
  'SE', // Sweden
] as const;

export type EUCountryCode = typeof EU_COUNTRY_CODES[number];

/**
 * Check if a country code is in the EU
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns true if the country is an EU member state
 */
export function isEUCountry(countryCode: string | null | undefined): boolean {
  if (!countryCode) {
    return false;
  }
  return EU_COUNTRY_CODES.includes(countryCode.toUpperCase() as EUCountryCode);
}

/**
 * Get the client IP address from request headers
 * Supports X-Forwarded-For (for proxied requests) and CF-Connecting-IP (Cloudflare)
 * @param headers - Request headers object
 * @returns The detected IP address or null
 */
export function getClientIP(headers: Headers): string | null {
  // Check X-Forwarded-For header (for requests behind a proxy)
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, the first one is the original client
    const ips = forwardedFor.split(',').map(ip => ip.trim());
    return ips[0] || null;
  }

  // Check CF-Connecting-IP header (Cloudflare)
  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Check other common proxy headers
  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  return null;
}

/**
 * Fetch country code from IP address using ipapi.co
 * @param ip - The IP address to look up
 * @returns The country code or null if lookup fails
 */
export async function getCountryFromIP(ip: string): Promise<string | null> {
  try {
    // Using ipapi.co - free tier allows 1000 requests/day
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'User-Agent': 'AI-Dietitian/1.0',
      },
    });

    if (!response.ok) {
      console.error('[geo] Failed to fetch geolocation data:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.error) {
      console.error('[geo] Geolocation API error:', data.error);
      return null;
    }

    return data.country_code || data.countryCode || null;
  } catch (error) {
    console.error('[geo] Error fetching geolocation:', error);
    return null;
  }
}

/**
 * Get the user's country code from their IP address
 * @param headers - Request headers to extract IP from
 * @returns The country code or null if detection fails
 */
export async function getClientCountry(headers: Headers): Promise<string | null> {
  const ip = getClientIP(headers);
  
  if (!ip) {
    // If no IP can be determined, try to get country from headers
    // Some CDN/proxy services add country headers
    const countryCode = headers.get('cf-ipcountry') || // Cloudflare
                        headers.get('x-country-code');
    if (countryCode) {
      return countryCode;
    }
    
    console.log('[geo] No IP address detected');
    return null;
  }

  return getCountryFromIP(ip);
}

/**
 * Check if the request originates from an EU country
 * @param headers - Request headers to extract IP/country from
 * @returns true if the user is in the EU, false otherwise
 */
export async function isRequestFromEU(headers: Headers): Promise<boolean> {
  const countryCode = await getClientCountry(headers);
  return isEUCountry(countryCode);
}
