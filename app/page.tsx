'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PlusIcon } from '@radix-ui/react-icons';
import { handleSignOut } from '@/app/action';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from '@/components/common/Logo';
import AddAccountModal from '@/components/Dashboard.tsx/AccountModal';

// Logo Component

const UserAccountCard = ({ username, karma }: { username: string; karma: number }) => (
  <Card className="mb-4 w-full border border-red-200 bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
  <CardContent className="p-4 sm:p-6">
  <div className="space-y-3">
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-red-100 pb-2">
  <span className="text-red-600 font-medium">Username:</span>
  <span className="font-semibold text-gray-900 mt-1 sm:mt-0">{username}</span>
  </div>
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-red-100 pb-2">
  <span className="text-red-600 font-medium">Password:</span>
  <span className="font-mono font-semibold text-gray-900 mt-1 sm:mt-0">abcdefg#</span>
  </div>
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-red-100 pb-2">
  <span className="text-red-600 font-medium">Karma:</span>
  <span className="font-semibold text-gray-900 mt-1 sm:mt-0">{karma}</span>
  </div>
  </div>
  </CardContent>
  </Card>
);


const AccountsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  const allAccounts = [
    { id: 1, username: "Maverick-Coderr", karma: 450 },
    { id: 2, username: "TechGuru91", karma: 1023 },
    { id: 3, username: "CreativeThinker", karma: 780 },
    { id: 4, username: "EcoWarrior88", karma: 650 },
    { id: 5, username: "Skywalker42", karma: 1120 },
    { id: 6, username: "Innovator-Pro", karma: 900 },
    { id: 7, username: "MysticDreamer", karma: 567 },
    { id: 8, username: "Visionary-X", karma: 834 },
    { id: 9, username: "CodeMaster", karma: 1502 },
    { id: 10, username: "DataWhiz", karma: 923 },
    { id: 11, username: "StoryWeaver", karma: 600 },
    { id: 12, username: "LogicLord", karma: 710 },
    { id: 13, username: "DesignGenius", karma: 860 },
    { id: 14, username: "PixelPerfect", karma: 990 },
  ];
  
  const totalPages = Math.ceil(allAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedAccounts = allAccounts.slice(startIndex, startIndex + itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className="min-h-screen bg-red-50 rounded-xl my-2">
    <div className="py-5">
    <Header label='' />
    </div>
    <div className="p-4 sm:p-3 lg:p-4">
    <div className="mx-auto max-w-lg sm:max-w-xl lg:max-w-2xl">
    <div className="mb-2 flex items-center justify-between">
    <h1 className="text-xl sm:text-2xl font-bold text-red-900">My Accounts</h1>
    <AddAccountModal />
    </div>
    
    <div className="space-y-4">
    {displayedAccounts.map((account) => (
      <UserAccountCard
      key={account.id}
      username={account.username}
      karma={account.karma}
      />
    ))}
    </div>
    
    <div className="mt-6">
    <div className="flex flex-wrap items-center justify-center gap-2">
    <button
    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
    disabled={currentPage === 1}
    className="px-3 py-2 bg-white border border-red-300 rounded-md text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
    Previous
    </button>
    
    <div className="flex flex-wrap gap-1">
    {pageNumbers.map((pageNumber) => (
      <button
      key={pageNumber}
      onClick={() => setCurrentPage(pageNumber)}
      className={`px-3 py-2 rounded-md ${
        currentPage === pageNumber
        ? 'bg-red-600 text-white'
        : 'bg-white text-red-700 hover:bg-red-50'
      } border border-red-300`}
      >
      {pageNumber}
      </button>
    ))}
    </div>
    
    <button
    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
    disabled={currentPage === totalPages}
    className="px-3 py-2 bg-white border border-red-300 rounded-md text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
    Next
    </button>
    </div>
    </div>
    
    <form
    action={handleSignOut}
    className="mt-6 flex justify-center"
    >
    <button
    type="submit"
    className="px-4 py-2 bg-white border border-red-300 text-red-700 rounded-md hover:bg-red-50 shadow-sm"
    >
    Sign Out
    </button>
    </form>
    </div>
    </div>
    </div>
  );
};

export default AccountsPage;