import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      age,
      height,
      weight,
      goal,
      activityLevel,
    } = body;

    if (
      !name ||
      !age ||
      !height ||
      !weight ||
      !goal ||
      !activityLevel
    ) {
      return NextResponse.json(
        { error: "All profile fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst();

    let user;

    if (existingUser) {
      user = await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          name,
          age: Number(age),
          height: Number(height),
          weight: Number(weight),
          goal,
          activityLevel,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name,
          age: Number(age),
          height: Number(height),
          weight: Number(weight),
          goal,
          activityLevel,
        },
      });
    }

    return NextResponse.json({
      message: "Profile saved successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}