'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('Auth Test - Status:', status);
    console.log('Auth Test - Session:', session);
  }, [status, session]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold mb-4">Authentication Test</h1>
        
        <div className="space-y-2">
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Session exists:</strong> {session ? 'Yes' : 'No'}</p>
          {session && (
            <div>
              <p><strong>User:</strong> {session.user?.email}</p>
              <p><strong>Name:</strong> {session.user?.name}</p>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-2">
          <button 
            onClick={() => router.push('/auth/login')}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}