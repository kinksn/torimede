import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  UserId,
  getUserOutputSchema,
  updateUserInputSchema,
} from "@/app/api/user/model";
import {
  USER_NOTFOUND_MESSAGE,
  getKiraPostsByUserId,
  getUserMededPostsByUserId,
  getUserPostsByUserId,
  getUserProfileByUserId,
  updateUserImage,
  updateUserIsFirstLogin,
  updateUserName,
  updateUserUploadProfileImage,
} from "@/app/api/user/userDao";

type ContextProps = {
  params: {
    userId: UserId;
  };
};

export async function GET(req: Request, context: ContextProps) {
  try {
    const { userId } = context.params;
    const { searchParams } = new URL(req.url);

    const isIncludePosts = searchParams.get("posts") === "true";
    const isIncludeMededPosts = searchParams.get("mededPosts") === "true";
    const isIncludeKiraPosts = searchParams.get("kiraPosts") === "true";

    const profile = await getUserProfileByUserId({ userId });

    const response = {
      profile,
      ...(isIncludePosts && { posts: await getUserPostsByUserId({ userId }) }),
      ...(isIncludeMededPosts && {
        mededPosts: await getUserMededPostsByUserId({ userId }),
        ...(isIncludeKiraPosts && {
          kiraPosts: await getKiraPostsByUserId({ userId }),
        }),
      }),
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
    const { userId } = context.params;
    const session = await auth();
    const input = updateUserInputSchema.parse(await req.json());
    const { name, image, uploadProfileImage, isFirstLogin } = input;

    if (session?.user?.id !== userId) {
      return NextResponse.json(
        { message: "not allowed to update user name" },
        { status: 403 }
      );
    }

    if (name) await updateUserName({ name, userId });
    if (uploadProfileImage) {
      await updateUserUploadProfileImage({ uploadProfileImage, userId });
      await updateUserImage({ image: uploadProfileImage, userId });
    }
    if (image && !uploadProfileImage) await updateUserImage({ image, userId });
    if (isFirstLogin !== undefined)
      await updateUserIsFirstLogin({ isFirstLogin, userId });

    const updateResult = await getUserProfileByUserId({ userId });

    return NextResponse.json(
      {
        message: "update success",
        updateResult: {
          id: updateResult.id,
          name: updateResult.name,
          image: updateResult.image,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
