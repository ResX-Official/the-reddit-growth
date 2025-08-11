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
    // Return mock data for now since we removed authentication
    const mockAccounts: RedditAccount[] = [
      {
        id: "1",
        redditUsername: "demo_user_1",
        karmaCount: 1250,
        hasPassword: true,
      },
      {
        id: "2", 
        redditUsername: "demo_user_2",
        karmaCount: 850,
        hasPassword: false,
      },
      {
        id: "3",
        redditUsername: "demo_user_3", 
        karmaCount: 2100,
        hasPassword: true,
      }
    ];

    return { success: true, data: mockAccounts };
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

    // Return mock success response since we removed authentication
    const newAccount: RedditAccount = {
      id: Math.random().toString(36).substr(2, 9),
      redditUsername: validatedData.redditUsername,
      karmaCount: validatedData.karmaCount,
      hasPassword: false,
    };

    return {
      success: true,
      data: newAccount,
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

    // Return mock success response since we removed authentication
    return { success: true };
  } catch (error) {
    console.error("Failed to update Reddit password:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid password format" };
    }
    return { success: false, error: "Failed to update password. Please try again later." };
  }
}
