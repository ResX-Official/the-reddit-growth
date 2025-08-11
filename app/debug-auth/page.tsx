import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default async function DebugAuthPage() {
  const session = await auth();
  
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Session Status:</h3>
              <p>{session ? "✅ Authenticated" : "❌ Not authenticated"}</p>
            </div>
            
            {session?.user && (
              <>
                <div>
                  <h3 className="font-semibold">User Info:</h3>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(session.user, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h3 className="font-semibold">Role Check:</h3>
                  <p>Current Role: <code>{session.user.role}</code></p>
                  <p>Is Admin: {session.user.role === UserRole.ADMIN ? "✅ Yes" : "❌ No"}</p>
                  <p>Admin Role Constant: <code>{UserRole.ADMIN}</code></p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Admin Emails (from auth.ts):</h3>
                  <ul className="list-disc list-inside">
                    <li>aminofab@gmail.com</li>
                    <li>eminselimaslan@gmail.com</li>
                  </ul>
                  <p>Your email: <code>{session.user.email}</code></p>
                  <p>Email match: {
                    ["aminofab@gmail.com", "eminselimaslan@gmail.com"].includes(session.user.email?.toLowerCase() || "") 
                      ? "✅ Yes" : "❌ No"
                  }</p>
                </div>
              </>
            )}
            
            <div>
              <h3 className="font-semibold">Full Session:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}