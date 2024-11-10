// app/api/reddit/user-info/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }), 
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Retrieve the stored access token for this user
    // Implement your token retrieval logic here
    const accessToken = 'STORED_ACCESS_TOKEN';

    // Fetch user information from Reddit
    const userResponse = await fetch('https://oauth.reddit.com/api/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'Your App Name/1.0'
      }
    });

    if (!userResponse.ok) {
      const error = await userResponse.text();
      console.error('Failed to fetch user info:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch user information' }), 
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const userData = await userResponse.json();

    return new NextResponse(
      JSON.stringify({
        username: userData.name,
        totalKarma: userData.total_karma,
        linkKarma: userData.link_karma,
        commentKarma: userData.comment_karma
      }), 
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('User info fetch failed:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to get user information' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
