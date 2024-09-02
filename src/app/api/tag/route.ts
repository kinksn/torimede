import { db } from "@/lib/db";
import { Tag } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tags: Tag[] = await db.tag.findMany();
    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "could not fetch tags" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const post = await db.tag.create({
      data: {
        name: body.name,
      },
    });
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "could not create tag" },
      { status: 500 }
    );
  }
}
