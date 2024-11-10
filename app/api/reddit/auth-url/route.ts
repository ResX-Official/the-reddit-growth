// app/api/reddit/auth-url/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { state } = body;

    if (!state) {
      return NextResponse.json(
        { error: 'State parameter is required' },
        { status: 400 }
      );
    }

    const clientId = process.env.REDDIT_CLIENT_ID;
    const redirectUri = process.env.REDDIT_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: 'Missing Reddit configuration' },
        { status: 500 }
      );
    }

    const authUrl = new URL('https://www.reddit.com/api/v1/authorize');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('duration', 'permanent');
    authUrl.searchParams.append('scope', 'identity read');

    // Return JSON response with the URL
    return NextResponse.json({ url: authUrl.toString() });

  } catch (error) {
    console.error('Failed to generate auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    );
  }
}