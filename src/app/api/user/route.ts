import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signUpFormSchema } from "@/app/api/user/model";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = signUpFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.issues },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(result.data.password, 10);
    const post = await db.user.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        password: hashedPassword,
      },
    });
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "could not create user" },
      { status: 500 }
    );
  }
}
