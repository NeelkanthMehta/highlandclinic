"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { signInFormSchema, signUpFormSchema } from "@/lib/validators";
import { hashSync } from "bcrypt-ts-edge";
import { AuthError } from "next-auth";

/**
 * Standard ActionState returned by Server Actions for client form consumption.
 */
export interface ActionState {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Server Action: Sign in user using credentials.
 * Safe validation with Zod safeParse, returning structured fieldErrors on validation failure.
 */
export async function signInWithCredentials(
  prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const parseResult = signInFormSchema.safeParse(rawData);

  if (!parseResult.success) {
    return {
      success: false,
      message: "Invalid form input. Please fix the errors below.",
      fieldErrors: parseResult.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parseResult.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      message: "Signed in successfully!",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid email or password.",
          };
        default:
          return {
            success: false,
            message: "Authentication failed. Please try again.",
          };
      }
    }
    // If Next.js redirect thrown, re-throw it
    throw error;
  }
}

/**
 * Server Action: Register a new user account.
 * Hashes password using bcrypt (salt rounds = 10) before saving to the database.
 */
export async function signUp(
  prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const parseResult = signUpFormSchema.safeParse(rawData);

  if (!parseResult.success) {
    return {
      success: false,
      message: "Validation failed. Please review your form entries.",
      fieldErrors: parseResult.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = parseResult.data;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Check if account already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email address already exists.",
        fieldErrors: {
          email: ["Email address is already registered."],
        },
      };
    }

    // Security Practice: Hash password with salt rounds = 10 using bcrypt before DB insertion
    const hashedPassword = hashSync(password, 10);

    // Create user in database
    await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: "PATIENT",
      },
    });

    // Automatically authenticate the user upon registration
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    });

    return {
      success: true,
      message: "Account created and signed in successfully!",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "Account created, but automatic sign-in failed. Please sign in manually.",
      };
    }
    console.error("Sign-up error:", error);
    return {
      success: false,
      message: "An unexpected error occurred during account registration.",
    };
  }
}

/**
 * Server Action: Sign out current session.
 */
export async function signOutUser(): Promise<void> {
  await signOut({ redirectTo: "/sign-in" });
}

