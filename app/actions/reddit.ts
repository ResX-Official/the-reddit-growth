'use server'

import db  from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { z } from "zod";

const RedditAccountSchema = z.object({
  redditUsername: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
  karmaCount: z.number(),
});

export async function addRedditAccount(formData: z.infer<typeof RedditAccountSchema>) {
  try {
    // Validate the input
    const validatedData = RedditAccountSchema.parse(formData);
    
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized"
      };
    }

    // Check if account already exists
    const existingAccount = await db.redditAccount.findFirst({
      where: {
        userId: session.user.id,
        redditUsername: validatedData.redditUsername,
      },
    });

    if (existingAccount) {
      return {
        success: false,
        error: "Reddit account already connected"
      };
    }

    // Create new Reddit account
    const redditAccount = await db.redditAccount.create({
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
      data: redditAccount
    };
    
  } catch (error) {
    console.error("Failed to add Reddit account:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add Reddit account"
    };
  }
}