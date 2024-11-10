'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Cookies from 'js-cookie';

interface RedditAuthResponse {
  url?: string;
  error?: string;
}

const AddAccountModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  
  const handleRedditAuth = useCallback(async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const state = crypto.randomUUID();
      
      // Store state in cookie
      Cookies.set('redditAuthState', state, {
        secure: true,
        sameSite: 'strict',
        expires: 1/24, // 1 hour
        path: '/'
      });
      
      console.log('Sending request to /api/reddit/auth-url');
      
      const response = await fetch('/api/reddit/auth-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state })
      });
      
      console.log('Response status:', response.status);
      
      // Get response text first for debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let data: RedditAuthResponse;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Invalid server response format');
      }
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      if (!data?.url) {
        throw new Error('No authorization URL received');
      }
      
      console.log('Redirecting to:', data.url);
      
      // Close modal before redirect
      setIsOpen(false);
      
      // Redirect to Reddit auth page
      window.location.href = data.url;
      
    } catch (err) {
      console.error('Reddit authentication error:', err);
      setError(
        err instanceof Error
        ? err.message
        : 'Failed to connect to Reddit. Please try again.'
      );
      setIsOpen(true); // Keep modal open on error
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild>
    <Button
    variant="outline"
    className="rounded-full bg-red-50 p-2 hover:bg-red-100 border border-red-300 shadow-sm transition-colors duration-200"
    onClick={() => setIsOpen(true)}
    aria-label="Add Reddit Account"
    >
    <PlusIcon className="h-5 w-5 text-red-600" />
    </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md">
    <DialogHeader>
    <DialogTitle className="container text-xl font-semibold text-red-900">
    Connect Reddit Account
    </DialogTitle>
    </DialogHeader>
    <div className="space-y-6 mt-4">
    {error && (
      <Alert variant="destructive">
      <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}
    <div className="text-sm text-gray-600">
    Connect your Reddit account to access your subreddits and manage your subscriptions.
    </div>
    <Button
    onClick={handleRedditAuth}
    disabled={isLoading}
    className="w-full bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
    >
    {isLoading ? (
      <span className="flex items-center justify-center gap-2">
      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      <span>Connecting...</span>
      </span>
    ) : (
      "Connect with Reddit"
    )}
    </Button>
    </div>
    </DialogContent>
    </Dialog>
  );
};

export default AddAccountModal;
