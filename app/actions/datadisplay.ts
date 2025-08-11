'use server';

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { z } from "zod";
import type { RedditAccount as PrismaRedditAccount } from "@prisma/client"; // Prisma model type

// ----------------------
// SCHEMA DEFINITIONS
// ----------------------
const RedditAccountSchema = z.object({
  redditUsername: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
  karmaCount: z.number(),
});

const UpdatePasswordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

// ----------------------
// TYPE DEFINITIONS
// ----------------------
export type RedditAccount = {
  id: string;
  redditUsername: string;
  karmaCount: number;
  hasPassword: boolean;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type UpdatePasswordResponse = {
  success: boolean;
  error?: string;
};

// ----------------------
// GET REDDIT ACCOUNTS
// ----------------------
export async function getRedditAccounts(): Promise<ApiResponse<RedditAccount[]>> {
  try {
    const session = await auth();
    console.log("Session:", session);

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const redditAccounts = await db.redditAccount.findMany({
        where: { userId: session.user.id },
        select: {
          id: true,
          redditUsername: true,
          karmaCount: true,
          redditPassword: true,
        },
        orderBy: { createdAt: 'desc' },
      });

    const formattedAccounts = redditAccounts.map((account) => ({

      id: account.id,
      redditUsername: account.redditUsername,
      karmaCount: account.karmaCount,
      hasPassword: !!account.redditPassword,
    }));

    return { success: true, data: formattedAccounts };
  } catch (error) {
    console.error("Error fetching Reddit accounts:", error);
    return { success: false, error: "Failed to fetch Reddit accounts. Please try again later." };
  }
}

// ----------------------
// ADD REDDIT ACCOUNT
// ----------------------
export async function addRedditAccount(
  formData: z.infer<typeof RedditAccountSchema>
): Promise<ApiResponse<RedditAccount>> {
  try {
    const validatedData = RedditAccountSchema.parse(formData);
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const existingAccount = await db.redditAccount.findFirst({
      where: {
        userId: session.user.id,
        redditUsername: validatedData.redditUsername,
      },
    });

    if (existingAccount) {
      return { success: false, error: "Reddit account already connected" };
    }

    const redditAccount: PrismaRedditAccount = await db.redditAccount.create({
      data: {
        userId: session.user.id,
        redditUsername: validatedData.redditUsername,
        accessToken: validatedData.accessToken,
        refreshToken: validatedData.refreshToken,
        tokenExpires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
        karmaCount: validatedData.karmaCount,
      },
    });

    revalidatePath('/dashboard');

    return {
      success: true,
      data: {
        id: redditAccount.id,
        redditUsername: redditAccount.redditUsername,
        karmaCount: redditAccount.karmaCount,
        hasPassword: false,
      },
    };
  } catch (error) {
    console.error("Failed to add Reddit account:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid data provided" };
    }
    return { success: false, error: "Failed to add Reddit account. Please try again later." };
  }
}

// ----------------------
// UPDATE REDDIT PASSWORD
// ----------------------
export async function updateRedditPassword(
  accountId: string,
  password: string
): Promise<UpdatePasswordResponse> {
  try {
    const validatedPassword = UpdatePasswordSchema.shape.password.parse(password);
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const account: PrismaRedditAccount | null = await db.redditAccount.findFirst({
      where: { id: accountId, userId: session.user.id },
    });

    if (!account) {
      return { success: false, error: "Reddit account not found or unauthorized" };
    }

    await db.redditAccount.update({
      where: { id: accountId },
      data: {
        redditPassword: validatedPassword,
        updatedAt: new Date(),
      },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Failed to update Reddit password:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid password format" };
    }
    return { success: false, error: "Failed to update password. Please try again later." };
  }
}
