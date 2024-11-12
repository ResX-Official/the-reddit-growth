'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { getRedditAccounts } from '@/app/actions/datadisplay';
import Header from '@/components/common/Logo';
import AddAccountModal from '@/components/Dashboard/AccountModal';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UserAccountCard from '@/components/Dashboard/UserAccountCard';

// Define types for the API responses
type RedditAccount = {
  id: string;
  redditUsername: string;
  karmaCount: number;
  hasPassword: boolean;
};

type GetAccountsResponse = {
  success: boolean;
  data?: RedditAccount[];
  error?: string;
};


const AccountsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [accounts, setAccounts] = useState<RedditAccount[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 3;
  const router = useRouter();
  
  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getRedditAccounts();
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      if (result.data) {
        setAccounts(result.data);
      } else {
        setError('No accounts data received');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch accounts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial fetch on mount
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);
  
  // Set up polling for updates
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchAccounts();
    }, 5000); // Poll every 5 seconds
    
    return () => clearInterval(pollInterval);
  }, [fetchAccounts]);
  
  // Handle successful account addition
  const handleAccountAdded = useCallback(() => {
    fetchAccounts();
    router.refresh();
  }, [fetchAccounts, router]);
  
  const totalPages = Math.ceil(accounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedAccounts = accounts.slice(startIndex, startIndex + itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.refresh();
      router.push('/auth/login');
    } catch (err) {
      setError('Failed to sign out. Please try again.');
    }
  };
  
  if (error) {
    return (
      <div className="min-h-screen bg-red-50 p-4 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <p className="text-red-600 text-center font-medium mb-4">Error: {error}</p>
      <div className="flex justify-center">
      <Button
      onClick={fetchAccounts}
      className="bg-red-600 hover:bg-red-700 text-white"
      >
      Try Again
      </Button>
      </div>
      </div>
      </div>
    );
  }
  
  if (isLoading && accounts.length === 0) {
    return (
      <div className="min-h-screen bg-red-50 p-4 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
      <p className="text-gray-600">Loading accounts...</p>
      </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-red-50 rounded-xl">
    <div className="py-5">
    <Header label="" />
    </div>
    <div className="p-4 sm:p-3 lg:p-4">
    <div className="mx-auto max-w-lg sm:max-w-xl lg:max-w-2xl">
    <div className="mb-2 flex items-center justify-between">
    <h1 className="text-xl sm:text-2xl font-bold text-red-900">My Reddit Accounts</h1>
    <AddAccountModal onAccountAdded={handleAccountAdded} />
    </div>
    
    {accounts.length === 0 ? (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
      <p className="text-gray-600">No Reddit accounts found. Add one to get started!</p>
      </div>
    ) : (
      <div className="space-y-4">
      {displayedAccounts.map((account) => (
        <UserAccountCard
        key={account.id}
        id={account.id}
        username={account.redditUsername}
        karma={account.karmaCount}
        hasPassword={account.hasPassword}
        onPasswordUpdate={fetchAccounts}
        />
      ))}
      </div>
    )}
    
    {accounts.length > itemsPerPage && (
      <div className="mt-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
      disabled={currentPage === 1}
      variant="outline"
      className="px-3 py-2"
      >
      Previous
      </Button>
      
      <div className="flex flex-wrap gap-1">
      {pageNumbers.map((pageNumber) => (
        <Button
        key={pageNumber}
        onClick={() => setCurrentPage(pageNumber)}
        variant={currentPage === pageNumber ? "default" : "outline"}
        className={currentPage === pageNumber ? 'bg-red-600' : ''}
        >
        {pageNumber}
        </Button>
      ))}
      </div>
      
      <Button
      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
      disabled={currentPage === totalPages}
      variant="outline"
      className="px-3 py-2"
      >
      Next
      </Button>
      </div>
      </div>
    )}
    
    <div className="mt-6 flex justify-center">
    <Button
    onClick={handleLogout}
    variant="outline"
    className="px-4 py-2"
    >
    Sign Out
    </Button>
    </div>
    </div>
    </div>
    </div>
  );
};

export default AccountsPage;