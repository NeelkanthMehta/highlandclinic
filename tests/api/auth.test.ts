import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { prisma, auth } = vi.hoisted(() => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
  auth: {
    hashPassword: vi.fn(),
    verifyPassword: vi.fn(),
    createSessionToken: vi.fn(),
    setSessionCookie: vi.fn(),
    clearSessionCookie: vi.fn(),
    getSessionUser: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma }));
vi.mock("@/lib/auth", () => auth);

import { POST as signUp } from "@/app/api/auth/sign-up/route";
import { POST as signIn } from "@/app/api/auth/sign-in/route";
import { POST as signOut } from "@/app/api/auth/sign-out/route";
import { GET as getMe } from "@/app/api/auth/me/route";

const user = {
  id: "patient-1",
  name: "Pat Patient",
  email: "pat@example.com",
  password: "bcrypt-hash",
  role: "PATIENT",
  image: null,
  phoneNumber: "555-0100",
  dateofbirth: null,
  doctorProfile: null,
};

function post(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/auth", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("authentication routes", () => {
  beforeEach(() => {
    for (const method of Object.values(prisma.user)) method.mockReset();
    for (const method of Object.values(auth)) method.mockReset();
    auth.hashPassword.mockResolvedValue("bcrypt-hash");
    auth.verifyPassword.mockResolvedValue(true);
    auth.createSessionToken.mockResolvedValue("signed-session");
    auth.setSessionCookie.mockResolvedValue(undefined);
    auth.clearSessionCookie.mockResolvedValue(undefined);
  });

  it.each([
    [{}],
    [[]],
    [null],
    [{ name: "Pat", email: "pat@example.com" }],
    [{ name: " ", email: "pat@example.com", password: "123456" }],
    [{ name: "Pat", email: 42, password: "123456" }],
    [{ name: "Pat", email: "pat@example.com", password: 123456 }],
  ])("rejects incomplete or incorrectly typed sign-up details", async (body) => {
    const response = await signUp(post(body));

    expect(response.status).toBe(400);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it.each([{}, [], null, { email: 3, password: "x" }, { email: "x", password: 3 }])(
    "rejects malformed sign-in details",
    async (body) => {
      expect((await signIn(post(body))).status).toBe(400);
    }
  );

  it("rejects short passwords, malformed JSON, and invalid optional dates", async () => {
    const shortPassword = await signUp(
      post({ name: "Pat", email: "pat@example.com", password: "12345" })
    );
    expect(shortPassword.status).toBe(400);

    const invalidDate = await signUp(
      post({
        name: "Pat",
        email: "pat@example.com",
        password: "123456",
        dateofbirth: "not-a-date",
      })
    );
    expect(invalidDate.status).toBe(400);

    const malformed = await signUp(
      new NextRequest("http://localhost/api/auth/sign-up", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{",
      })
    );
    expect(malformed.status).toBe(400);
  });

  it("normalizes email, persists only a hash, forces patient role, and omits the hash", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue(user);

    const response = await signUp(
      post({
        name: " Pat Patient ",
        email: " PAT@EXAMPLE.COM ",
        password: "123456",
        role: "ADMIN",
        phoneNumber: "",
      })
    );

    expect(response.status).toBe(201);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "pat@example.com" },
    });
    expect(auth.hashPassword).toHaveBeenCalledWith("123456");
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: "Pat Patient",
          email: "pat@example.com",
          password: "bcrypt-hash",
          role: "PATIENT",
          phoneNumber: null,
        }),
      })
    );
    expect(JSON.stringify(await response.json())).not.toContain("bcrypt-hash");
    expect(auth.setSessionCookie).toHaveBeenCalledWith("signed-session");
  });

  it("returns conflict without creating an account for an existing email", async () => {
    prisma.user.findUnique.mockResolvedValue(user);

    const response = await signUp(
      post({ name: "Pat", email: "pat@example.com", password: "123456" })
    );

    expect(response.status).toBe(409);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("returns 500 when account creation fails", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockRejectedValue(new Error("database unavailable"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await signUp(
      post({ name: "Pat", email: "pat@example.com", password: "123456" })
    );
    expect(response.status).toBe(500);
  });

  it("signs in with normalized email and does not expose password data", async () => {
    prisma.user.findUnique.mockResolvedValue(user);

    const response = await signIn(
      post({ email: " PAT@EXAMPLE.COM ", password: "secret" })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(prisma.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { email: "pat@example.com" } })
    );
    expect(auth.verifyPassword).toHaveBeenCalledWith("secret", "bcrypt-hash");
    expect(JSON.stringify(payload)).not.toContain("bcrypt-hash");
    expect(auth.setSessionCookie).toHaveBeenCalledWith("signed-session");
  });

  it("returns the same unauthorized response for an unknown account and wrong password", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const missing = await signIn(post({ email: "x@example.com", password: "secret" }));

    prisma.user.findUnique.mockResolvedValue(user);
    auth.verifyPassword.mockResolvedValue(false);
    const wrongPassword = await signIn(
      post({ email: "pat@example.com", password: "wrong" })
    );

    expect(missing.status).toBe(401);
    expect(wrongPassword.status).toBe(401);
    expect(await missing.json()).toEqual(await wrongPassword.json());
  });

  it("does not sign in accounts without a password or return internal failures", async () => {
    prisma.user.findUnique.mockResolvedValue({ ...user, password: null });
    const noPassword = await signIn(
      post({ email: user.email, password: "secret" })
    );
    expect(noPassword.status).toBe(401);
    expect(auth.verifyPassword).not.toHaveBeenCalled();

    prisma.user.findUnique.mockRejectedValue(new Error("database unavailable"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const failed = await signIn(post({ email: user.email, password: "secret" }));
    expect(failed.status).toBe(500);
  });

  it("clears the cookie on sign-out and returns the current user without password", async () => {
    const signedOut = await signOut();
    expect(signedOut.status).toBe(200);
    expect(auth.clearSessionCookie).toHaveBeenCalledOnce();

    auth.getSessionUser.mockResolvedValue({ id: user.id });
    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      phoneNumber: user.phoneNumber,
      dateofbirth: user.dateofbirth,
      doctorProfile: user.doctorProfile,
    };
    prisma.user.findUnique.mockResolvedValue(publicUser);
    const response = await getMe();
    const payload = await response.json();

    expect(payload.user.id).toBe(user.id);
    expect(JSON.stringify(payload)).not.toContain("bcrypt-hash");
    expect(prisma.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ select: expect.not.objectContaining({ password: true }) })
    );
  });

  it("returns an error when sign-out cannot clear the session", async () => {
    auth.clearSessionCookie.mockRejectedValue(new Error("cookie store unavailable"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect((await signOut()).status).toBe(500);
  });

  it("returns a null user for an anonymous session", async () => {
    auth.getSessionUser.mockResolvedValue(null);

    const response = await getMe();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ user: null });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("returns a null user for a stale or failed session lookup", async () => {
    auth.getSessionUser.mockResolvedValue({ id: "deleted-user" });
    prisma.user.findUnique.mockResolvedValue(null);
    expect(await (await getMe()).json()).toEqual({ user: null });

    auth.getSessionUser.mockRejectedValue(new Error("session unavailable"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await (await getMe()).json()).toEqual({ user: null });
  });
});
