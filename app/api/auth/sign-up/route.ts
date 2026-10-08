import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { isRecord } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }
    if (!isRecord(body)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const { name, email, password, phoneNumber, dateofbirth } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (
      (phoneNumber !== undefined && phoneNumber !== null && typeof phoneNumber !== "string") ||
      (dateofbirth !== undefined &&
        dateofbirth !== null &&
        (typeof dateofbirth !== "string" ||
          Number.isNaN(new Date(dateofbirth).getTime())))
    ) {
      return NextResponse.json(
        { error: "Invalid phone number or date of birth" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already registered
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new patient user
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "PATIENT",
        phoneNumber: phoneNumber || null,
        dateofbirth: dateofbirth ? new Date(dateofbirth) : null,
      },
    });

    // Create session token and cookie
    const sessionPayload = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };

    const token = await createSessionToken(sessionPayload);
    await setSessionCookie(token);

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          image: newUser.image,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sign-up error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Internal server error." },
      { status: 500 }
    );
  }
}
