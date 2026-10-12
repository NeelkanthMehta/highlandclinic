import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

function getJwtSecret(): Uint8Array {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET must be configured before authentication is used");
  }
  return new TextEncoder().encode(jwtSecret);
}

export const COOKIE_NAME = "highland_session";

export interface UserSessionPayload {
  id: string;
  email: string;
  name: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
}

/**
 * Hashes a plain text password using bcryptjs.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compares a plain text password against a bcrypt hash.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export const SESSION_MAX_AGE_SECONDS = 30 * 60; // 30 minutes of inactivity

/**
 * Creates a signed JWT session token valid for 30 minutes of inactivity.
 */
export async function createSessionToken(
  payload: UserSessionPayload,
  expiresIn: string = "30m"
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getJwtSecret());
}

/**
 * Verifies a JWT session token and returns decoded payload.
 */
export async function verifySessionToken(
  token: string
): Promise<UserSessionPayload | null> {
  const secret = getJwtSecret();
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as "PATIENT" | "DOCTOR" | "ADMIN",
    };
  } catch {
    return null;
  }
}

/**
 * Sets the session cookie on response headers with 30 minutes inactivity timeout.
 */
export async function setSessionCookie(
  token: string,
  maxAge: number = SESSION_MAX_AGE_SECONDS
) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

/**
 * Retrieves the current logged-in user payload from session cookie.
 */
export async function getSessionUser(): Promise<UserSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Clears the session cookie.
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
