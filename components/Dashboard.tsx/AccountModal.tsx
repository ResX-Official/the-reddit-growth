'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusIcon, ExternalLinkIcon } from "lucide-react";

interface RedditUser {
  creationDate: string;
  icon: string;
  id: string;
  karma: number;
  name: string;
  nsfw: boolean;
  url: string;
}

const AddAccountModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<RedditUser | null>(null);
  
  const searchRedditUser = async () => {
    setIsLoading(true);
    setError("");
    setUserData(null);
    
    try {
      const response = await fetch(`https://reddit-scraper2.p.rapidapi.com/search_users?query=${username}&nsfw=0`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '52655f1cfbmshc28794a26461c71p1a3967jsnc854ec10622d',
          'x-rapidapi-host': 'reddit-scraper2.p.rapidapi.com'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      if (responseData.data && responseData.data.length > 0) {
        // Get the first user from the results
        setUserData(responseData.data[0]);
      } else {
        setError("No users found");
      }
    } catch (err) {
      console.error('Reddit search error:', err);
      setError(
        err instanceof Error
        ? err.message
        : 'Failed to search Reddit user. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
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
    Search Reddit Account
    </DialogTitle>
    </DialogHeader>
    <div className="space-y-6 mt-4">
    {error && (
      <Alert variant="destructive">
      <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}
    
    <div className="space-y-4">
    <div className="text-sm text-gray-600">
    Enter a Reddit username to search for their profile.
    </div>
    
    <div className="flex gap-2">
    <Input
    type="text"
    placeholder="Enter Reddit username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="flex-1"
    onKeyPress={(e) => {
      if (e.key === 'Enter') {
        searchRedditUser();
      }
    }}
    />
    <Button
    onClick={searchRedditUser}
    disabled={isLoading || !username}
    className="bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
    >
    {isLoading ? (
      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    ) : (
      "Search"
    )}
    </Button>
    </div>
    
    {userData && (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
      <div className="flex items-center gap-4">
      <img 
      src={userData.icon} 
      alt="Profile" 
      className="w-16 h-16 rounded-full"
      onError={(e) => {
        // Fallback if image fails to load
        e.currentTarget.src = "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png";
      }}
      />
      <div>
      <h3 className="font-medium text-gray-900">u/{userData.name}</h3>
      <p className="text-sm text-gray-500">ID: {userData.id}</p>
      </div>
      </div>
      
      <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
      <span className="text-gray-600">Karma:</span>
      <span>{userData.karma.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between">
      <span className="text-gray-600">Created:</span>
      <span>{new Date(userData.creationDate).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center justify-between">
      <span className="text-gray-600">NSFW:</span>
      <span>{userData.nsfw ? "Yes" : "No"}</span>
      </div>
      <div className="pt-2">
      <a
      href={userData.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-1 text-red-600 hover:text-red-700 w-full p-2 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
      >
      Click to Add Reddit Account
      <ExternalLinkIcon className="h-4 w-4" />
      </a>
      </div>
      </div>
      </div>
    )}
    </div>
    </div>
    </DialogContent>
    </Dialog>
  );
};

export default AddAccountModal;