import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible NextAuth configuration for middleware route protection.
 * Security Practice: Kept separate from database and password hashing logic
 * so that it can execute on Edge Runtime inside Next.js Middleware.
 */
export const authConfig = {
  providers: [], // CredentialsProvider is added in auth.ts (Node environment)
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    /**
     * Authorization callback to protect routes.
     * Unauthenticated users attempting to access /admin/* or /user/* are redirected to /sign-in.
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const isProtectedRoute =
        pathname.startsWith("/admin") ||
        pathname.startsWith("/user") ||
        pathname.startsWith("/profile");

      const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";

      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        // Redirect to sign-in page if accessing protected route while logged out
        return false;
      }

      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/profile", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

