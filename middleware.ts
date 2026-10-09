import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * Middleware using NextAuth authConfig for route protection and auth redirects.
 * Intercepts requests to /profile, /admin, /user, /sign-in, and /sign-up.
 */
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/profile",
    "/profile/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
