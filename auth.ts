import NextAuth from "next-auth";
import "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { prisma } from "@/lib/prisma";
import { signInFormSchema } from "@/lib/validators";
import { authConfig } from "./auth.config";

/**
 * NextAuth module augmentation for TypeScript type safety
 */
declare module "next-auth" {
  interface User {
    id?: string;
    role?: string;
  }
  interface Session {
    user: {
      id?: string;
      role?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Safe Zod schema validation
        const parsedCredentials = signInFormSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const normalizedEmail = email.trim().toLowerCase();

        // Retrieve user from database
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user || !user.password) {
          // Security Practice: Return null without indicating whether user exists to prevent email enumeration
          return null;
        }

        // Compare plain text password against bcrypt hash safely
        const passwordsMatch = compareSync(password, user.password);
        if (!passwordsMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    /**
     * Extend JWT callback to attach user id (token.sub) and user.role to the JWT token
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    /**
     * Extend session callback to expose id and role on session.user
     */
    async session({ session, token }) {
      if (session.user) {
        if (token.id) session.user.id = token.id as string;
        if (token.sub) session.user.id = token.sub;
        if (token.role) session.user.role = token.role as string;
      }
      return session;
    },
  },
});
