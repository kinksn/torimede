import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import {
  UserId,
  getUserOutputSchema,
  updateUserInputSchema,
} from "@/app/api/user/model";
import {
  USER_NOTFOUND_MESSAGE,
  getUserCutedPostsByUserId,
  getUserPostsByUserId,
  getUserProfileByUserId,
  updateUserIsFirstLogin,
  updateUserName,
} from "@/app/api/user/userDao";

type ContextProps = {
  params: {
    userId: UserId;
  };
};

export async function GET(_req: Request, context: ContextProps) {
  try {
    const userId = context.params.userId;
    const profile = await getUserProfileByUserId({ userId });
    const posts = await getUserPostsByUserId({ userId });
    const cutedPosts = await getUserCutedPostsByUserId({ userId });

    const response = {
      profile,
      posts,
      cutedPosts,
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
    const input = updateUserInputSchema.parse(await req.json());
    const { name, isFirstLogin } = input;

    if (session?.user?.id !== userId) {
      return NextResponse.json(
        { message: "not allowed to update user name" },
        { status: 403 }
      );
    }

    if (name) await updateUserName({ name, userId });
    if (!isFirstLogin) await updateUserIsFirstLogin({ isFirstLogin, userId });

    return NextResponse.json({ message: "update success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
