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
    
    // Get search query from URL
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }
    
    // Call Reddit API
    const redditResponse = await fetch(
      `https://www.reddit.com/subreddits/search.json?q=${encodeURIComponent(query)}`,
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
    
    // Extract and format subreddit data
    const subreddits = redditData.data.children.map((child: any) => child.data);
    
    return NextResponse.json({ subreddits });
    
  } catch (error) {
    console.error('Subreddit search error:', error);
    return NextResponse.json(
      { error: 'Failed to search subreddits' },
      { status: 500 }
    );
  }
}