// app/api/reddit/token/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    // Validate required environment variables
    const CLIENT_ID = process.env.REDDIT_CLIENT_ID;
    const CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDDIT_REDIRECT_URI;

    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
      return NextResponse.json(
        { error: 'Reddit authentication is not properly configured' },
        { status: 500 }
      );
    }

    // Validate code parameter
    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // Create Basic Auth header
    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    // Prepare the form data
    const formData = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    });

    console.log('Sending token request to Reddit with params:', {
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
      // Don't log the actual code for security
    });

    // Exchange code for access token
    const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'web:RedditGrowth:v1.0 (by /u/Substantial_Bad8141)', // Replace with your username
      },
      body: formData.toString(),
    });

    // Log the response status and headers for debugging
    console.log('Reddit API Response Status:', tokenResponse.status);
    console.log('Reddit API Response Headers:', Object.fromEntries(tokenResponse.headers.entries()));

    // Handle non-JSON responses
    const contentType = tokenResponse.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const textResponse = await tokenResponse.text();
      console.error('Received non-JSON response:', textResponse);
      return NextResponse.json(
        { 
          error: 'Invalid response from Reddit',
          details: `Status: ${tokenResponse.status}, Content-Type: ${contentType}`,
        },
        { status: 500 }
      );
    }

    // Parse JSON response
    let tokenData;
    try {
      tokenData = await tokenResponse.json();
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse Reddit response' },
        { status: 500 }
      );
    }

    // Check for error in the response
    if (!tokenResponse.ok || tokenData.error) {
      console.error('Reddit API Error:', tokenData);
      return NextResponse.json(
        { 
          error: tokenData.error || 'Failed to exchange code for token',
          details: tokenData.error_description || 'No additional details provided'
        },
        { status: tokenResponse.status }
      );
    }

    // Validate the token data
    if (!tokenData.access_token) {
      console.error('Missing access token in response:', tokenData);
      return NextResponse.json(
        { error: 'Invalid token response from Reddit' },
        { status: 500 }
      );
    }

    // Return the token response to the client
    return NextResponse.json(tokenData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Error in token exchange:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during token exchange',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}