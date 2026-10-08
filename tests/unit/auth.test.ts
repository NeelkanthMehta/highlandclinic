import { beforeEach, describe, expect, it, vi } from "vitest";
import { SignJWT } from "jose";

const { cookieStore, cookies } = vi.hoisted(() => {
  const cookieStore = {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  };
  return { cookieStore, cookies: vi.fn(async () => cookieStore) };
});

vi.mock("next/headers", () => ({ cookies }));

import {
  clearSessionCookie,
  COOKIE_NAME,
  createSessionToken,
  getSessionUser,
  hashPassword,
  setSessionCookie,
  verifyPassword,
  verifySessionToken,
  type UserSessionPayload,
} from "@/lib/auth";

const session: UserSessionPayload = {
  id: "patient-1",
  email: "patient@example.com",
  name: "Pat Patient",
  role: "PATIENT",
};

describe("authentication helpers", () => {
  beforeEach(() => {
    cookieStore.get.mockReset();
    cookieStore.set.mockReset();
    cookieStore.delete.mockReset();
    cookies.mockClear();
  });

  it("hashes passwords and rejects an incorrect password", async () => {
    const hash = await hashPassword("correct horse battery staple");

    expect(hash).not.toBe("correct horse battery staple");
    await expect(verifyPassword("correct horse battery staple", hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong password", hash)).resolves.toBe(false);
  });

  it("creates and verifies a session token", async () => {
    const token = await createSessionToken(session);

    await expect(verifySessionToken(token)).resolves.toEqual(session);
  });

  it.each(["not-a-token", ""])("rejects invalid token %j", async (token) => {
    await expect(verifySessionToken(token)).resolves.toBeNull();
  });

  it("rejects tampered and expired tokens", async () => {
    const token = await createSessionToken(session);
    const tampered = `${token.slice(0, -1)}x`;
    const expired = await new SignJWT({ ...session })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("0s")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    await expect(verifySessionToken(tampered)).resolves.toBeNull();
    await expect(verifySessionToken(expired)).resolves.toBeNull();
  });

  it("sets an HttpOnly same-site cookie with environment-sensitive security", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await setSessionCookie("signed-token");

    expect(cookieStore.set).toHaveBeenCalledWith(COOKIE_NAME, "signed-token", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    cookieStore.set.mockClear();
    vi.stubEnv("NODE_ENV", "test");
    await setSessionCookie("local-token");
    expect(cookieStore.set).toHaveBeenCalledWith(
      COOKIE_NAME,
      "local-token",
      expect.objectContaining({ secure: false })
    );
  });

  it("reads only a valid session cookie and clears it on logout", async () => {
    await expect(getSessionUser()).resolves.toBeNull();

    const token = await createSessionToken(session);
    cookieStore.get.mockReturnValue({ value: token });
    await expect(getSessionUser()).resolves.toEqual(session);

    cookieStore.get.mockReturnValue({ value: "invalid" });
    await expect(getSessionUser()).resolves.toBeNull();

    await clearSessionCookie();
    expect(cookieStore.delete).toHaveBeenCalledWith(COOKIE_NAME);
  });

  it("refuses to sign or verify tokens without an explicit signing secret", async () => {
    vi.stubEnv("JWT_SECRET", "");

    await expect(createSessionToken(session)).rejects.toThrow(
      "JWT_SECRET must be configured"
    );
    await expect(verifySessionToken("invalid")).rejects.toThrow(
      "JWT_SECRET must be configured"
    );
  });
});
