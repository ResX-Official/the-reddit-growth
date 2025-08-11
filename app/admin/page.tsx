import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import db from "@/lib/db";
import { AdminClient } from "./admin-client";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic';

// Update types to focus on Reddit accounts
type UserWithRedditAccounts = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  RedditAccount: Array<{
    id: string;
    redditUsername: string;
    karmaCount: number;
    createdAt: Date;
  }>;
};

async function getUsers() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        RedditAccount: {
          select: {
            id: true,
            redditUsername: true,
            karmaCount: true,
            createdAt: true,
          },
          orderBy: {
            karmaCount: 'desc'
          }
        }
      },
      // Only get users who have Reddit accounts
      where: {
        RedditAccount: {
          some: {}
        }
      }
    });
    return users;
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

const UsersPage = async () => {
  // Check authentication and authorization
  const session = await auth();
  
  // Debug logging
  console.log("Admin page - Session:", {
    user: session?.user,
    role: session?.user?.role,
    email: session?.user?.email
  });
  
  if (!session?.user) {
    console.log("No session found, redirecting to login");
    redirect("/auth/login");
  }
  
  if (session.user.role !== UserRole.ADMIN) {
    console.log("User is not admin, redirecting to home. Current role:", session.user.role);
    redirect("/");
  }
  
  const users = await getUsers();
  
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Reddit Account Analytics</CardTitle>
          <div className="text-sm text-muted-foreground">
            Total Accounts: {users.reduce((acc, user) => acc + user.RedditAccount.length, 0)}
          </div>
        </CardHeader>
        <CardContent>
          <AdminClient users={users} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;