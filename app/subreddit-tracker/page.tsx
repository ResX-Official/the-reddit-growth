'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/common/Logo';
import { SearchIcon } from 'lucide-react';

interface Subreddit {
  id: string;
  name: string;
  title: string;
  display_name: string;
  display_name_prefixed: string;
  subscribers: number;
  description: string;
  url: string;
  created_utc: number;
  public_description: string;
  icon_img?: string;
}

const SubredditTrackerPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/reddit/subreddits/search?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setSubreddits(data.subreddits || []);
      
      if (data.subreddits?.length === 0) {
        setError('No subreddits found matching your search.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search subreddits');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 rounded-xl">
      <div className="py-5">
        <Header label="" />
      </div>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="bg-white border-red-600 text-red-600 font-medium hover:bg-red-50"
                onClick={() => router.push('/')}
              >
                Home
              </Button>
              <Button 
                variant="outline" 
                className="bg-red-600 text-white font-medium hover:bg-red-700"
              >
                Subreddit Tracker
              </Button>
            </div>
          </div>
          
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-red-900 mb-4">Subreddit Tracker</h1>
            <p className="text-gray-600 mb-6">
              Search for subreddits and track their information. Enter a subreddit name or keyword below.
            </p>
            
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search subreddits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-10 py-2 border-2 border-gray-200 focus:border-red-400 focus:ring-red-400 rounded-lg"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
                <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isLoading || !searchQuery.trim()}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}
          </div>
          
          {subreddits.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {subreddits.map((subreddit) => (
                  <Card key={subreddit.id} className="border border-red-100 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg font-bold text-red-900">
                            {subreddit.display_name_prefixed}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-500">
                            {subreddit.subscribers?.toLocaleString() || 0} subscribers
                          </CardDescription>
                        </div>
                        {subreddit.icon_img && (
                          <img 
                            src={subreddit.icon_img} 
                            alt={subreddit.display_name} 
                            className="w-10 h-10 rounded-full"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {subreddit.public_description || subreddit.description || 'No description available.'}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between">
                      <div className="text-xs text-gray-500">
                        Created: {new Date(subreddit.created_utc * 1000).toLocaleDateString()}
                      </div>
                      <Button 
                        variant="outline" 
                        className="text-xs h-8 px-2 text-red-600 hover:bg-red-50"
                        onClick={() => window.open(`https://reddit.com${subreddit.url}`, '_blank')}
                      >
                        Visit
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {!isLoading && !error && subreddits.length === 0 && searchQuery === '' && (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start Tracking Subreddits</h3>
              <p className="text-gray-600">
                Enter a subreddit name or keyword in the search box above to find and track subreddits.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubredditTrackerPage;