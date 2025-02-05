import { db } from "@/lib/db";
import { Tag } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { tagCreateInputSchema, tagSchema } from "@/app/api/tag/model";

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

export async function PATCH(req: Request) {
  try {
    const body = tagSchema.parse(await req.json());
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ message: "not login" }, { status: 401 });
    }
    if (session.user.id !== body.userId) {
      return NextResponse.json(
        { message: "not have permission to edit" },
        { status: 401 }
      );
    }
    await db.tag.update({
      where: {
        id: body.id,
      },
      data: {
        name: body.name,
      },
    });
    return NextResponse.json({ message: "update success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "could not update tag" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ message: "not login" }, { status: 401 });
    }
    const userId = session.user.id;
    const body = await req.json();
    const { name } = tagCreateInputSchema.parse(body);
    const post = await db.tag.create({
      data: {
        name,
        userId,
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

export async function DELETE(req: Request) {
  try {
    const body = tagSchema.parse(await req.json());
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ message: "not login" }, { status: 401 });
    }
    if (session.user.id !== body.userId) {
      return NextResponse.json(
        { message: "not have permission to edit" },
        { status: 401 }
      );
    }
    await db.tag.delete({
      where: {
        id: body.id,
      },
    });
    return NextResponse.json({ message: "tag deleted" }, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: "could not delete tag" },
      { status: 500 }
    );
  }
}
