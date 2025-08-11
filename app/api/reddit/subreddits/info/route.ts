export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get subreddit name from URL
    const searchParams = request.nextUrl.searchParams;
    const subredditName = searchParams.get('name');
    
    if (!subredditName) {
      return NextResponse.json(
        { error: 'Subreddit name is required' },
        { status: 400 }
      );
    }
    
    // Call Reddit API
    const redditResponse = await fetch(
      `https://www.reddit.com/r/${encodeURIComponent(subredditName)}/about.json`,
      {
        headers: {
          'User-Agent': 'web:reddit-growth:v1.0.0 (by /u/redditgrowth)'
        }
      }
    );
    
    if (!redditResponse.ok) {
      return NextResponse.json(
        { error: `Reddit API error: ${redditResponse.status}` },
        { status: redditResponse.status }
      );
    }
    
    const redditData = await redditResponse.json();
    
    // Extract subreddit data
    const subredditInfo = redditData.data;
    
    return NextResponse.json({ subreddit: subredditInfo });
    
  } catch (error) {
    console.error('Subreddit info error:', error);
    return NextResponse.json(
      { error: 'Failed to get subreddit information' },
      { status: 500 }
    );
  }
}