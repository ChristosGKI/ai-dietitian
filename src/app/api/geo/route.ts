import { NextResponse } from 'next/server';
import { getClientCountry, isEUCountry } from '@/lib/geo';

/**
 * GET /api/geo
 * Returns the user's country code and whether they are in the EU
 * Used for GDPR compliance to determine applicable legal requirements
 */
export async function GET(request: Request) {
  try {
    const headers = request.headers;
    const countryCode = await getClientCountry(headers);
    const isInEU = isEUCountry(countryCode);

    // Cache for 1 hour (3600 seconds) - geolocation doesn't change frequently
    const response = NextResponse.json({
      countryCode,
      isInEU,
    });

    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=1800');

    return response;
  } catch (error) {
    console.error('[api/geo] Error:', error);
    
    // Return a safe default - don't assume EU to avoid over-complying
    return NextResponse.json(
      {
        countryCode: null,
        isInEU: false,
        error: 'Geolocation detection failed',
      },
      { status: 200 } // Return 200 so client can handle gracefully
    );
  }
}
