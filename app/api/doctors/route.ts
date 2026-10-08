import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const doctors = await prisma.user.findMany({
      where: {
        role: "DOCTOR",
        doctorProfile: {
          isActive: true,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phoneNumber: true,
        address: true,
        doctorProfile: {
          select: {
            profileId: true,
            specialty: true,
            brief: true,
            credentials: true,
            languages: true,
            rating: true,
            reviewCount: true,
            specializations: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

