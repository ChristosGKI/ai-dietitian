import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || 
                      headersList.get('cf-connecting-ip') || 
                      headersList.get('x-real-ip') || 
                      'unknown';
    
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Return current consent status (client-side cookies are used for actual state)
    return NextResponse.json({
      success: true,
      message: 'Consent API endpoint - use client-side cookieManager for actual state',
      note: 'This endpoint is for server-side consent tracking and audit logs',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process consent request' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { functional, analytics, marketing, version } = body;

    // Validate required fields
    if (typeof functional !== 'boolean' || 
        typeof analytics !== 'boolean' || 
        typeof marketing !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid consent preferences' },
        { status: 400 }
      );
    }

    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || 
                      headersList.get('cf-connecting-ip') || 
                      headersList.get('x-real-ip') || 
                      'unknown';
    
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Log consent event for audit purposes
    console.log('[Consent API] Consent recorded:', {
      functional,
      analytics,
      marketing,
      version: version || '1.0',
      ipAddress: ipAddress.substring(0, 50), // Truncate for safety
      userAgent: userAgent.substring(0, 200),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Consent preferences saved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Consent API] Error saving consent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save consent' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || 
                      headersList.get('cf-connecting-ip') || 
                      headersList.get('x-real-ip') || 
                      'unknown';
    
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Log withdrawal event for audit purposes
    console.log('[Consent API] Consent withdrawn:', {
      timestamp: new Date().toISOString(),
      ipAddress: ipAddress.substring(0, 50),
      userAgent: userAgent.substring(0, 200),
    });

    return NextResponse.json({
      success: true,
      message: 'Consent withdrawn successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Consent API] Error withdrawing consent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to withdraw consent' },
      { status: 500 }
    );
  }
}
