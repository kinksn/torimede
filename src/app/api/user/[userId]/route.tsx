import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import {
  UserId,
  getUserOutputSchema,
  updateUserNameInputSchema,
} from "@/app/api/user/model";
import {
  USER_NOTFOUND_MESSAGE,
  getUserCutedPostsByUserId,
  getUserPostsByUserId,
  getUserProfileByUserId,
  updateUserProfile,
} from "@/app/api/user/userDao";

type ContextProps = {
  params: {
    userId: UserId;
  };
};

export async function GET(_req: Request, context: ContextProps) {
  try {
    const userId = context.params.userId;
    const session = await getAuthSession();
    const isMe = userId === session?.user?.id;

    const profile = await getUserProfileByUserId({ userId });
    const posts = await getUserPostsByUserId({ userId });
    const cutedPosts = await getUserCutedPostsByUserId({ userId });

    const response = {
      profile,
      posts,
      cutedPosts,
      isMe: isMe,
    };

    return NextResponse.json(getUserOutputSchema.parse(response), {
      status: 200,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes(USER_NOTFOUND_MESSAGE)
    ) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: ContextProps) {
  try {
    const userId = context.params.userId;
    const session = await getAuthSession();
    const input = updateUserNameInputSchema.parse(await req.json());
    const { name } = input;

    if (session?.user?.id !== userId) {
      return NextResponse.json(
        { message: "not allowed to update user name" },
        { status: 403 }
      );
    }

    await updateUserProfile({ name, userId });

    return NextResponse.json({ message: "update success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}