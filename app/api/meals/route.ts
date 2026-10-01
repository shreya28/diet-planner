import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, type, calories, protein } = body;

    if (!name || !type || calories === undefined || protein === undefined) {
      return NextResponse.json(
        { error: "All meal fields are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst();

    if (!user) {
      return NextResponse.json(
        { error: "Please create a profile first" },
        { status: 400 }
      );
    }

    const meal = await prisma.meal.create({
      data: {
        name,
        type,
        calories: Number(calories),
        protein: Number(protein),
        userId: user.id,
      },
    });

    return NextResponse.json({
      message: "Meal added successfully",
      meal,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to add meal" },
      { status: 500 }
    );
  }
}