// app/api/reddit/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { RedditClient } from '@/lib/reddit/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    // Exchange code for token
    const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
        ).toString('base64')}`,
        'User-Agent': 'YourApp/1.0'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.REDDIT_REDIRECT_URI!
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
    }

    // Initialize our client with the token
    const reddit = new RedditClient(tokenData.access_token);

    // Fetch multiple pieces of information
    const [user, karma, prefs] = await Promise.all([
      reddit.getMe(),
      reddit.getKarmaBreakdown(),
      reddit.getPreferences()
    ]);

    // Return combined user data
    return NextResponse.json({
      user: {
        name: user.name,
        totalKarma: user.total_karma,
        created: user.created_utc,
      },
      karma: karma.reduce((acc, k) => ({
        ...acc,
        [k.sr]: {
          link: k.link_karma,
          comment: k.comment_karma
        }
      }), {}),
      preferences: {
        nsfw: prefs.over_18,
        notifications: prefs.enable_notifications
      }
    });

  } catch (error) {
    console.error('Reddit API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
