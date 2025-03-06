import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createMedeBodySchema,
  createMedeOutputSchema,
  MAX_MEDE_COUNT,
} from "@/app/api/mede/[postId]/model";
import { PostId } from "@/app/api/post/model";
import {
  createManyMede,
  getUserMedeCountForPost,
} from "@/app/api/mede/[postId]/medeDao";
import { getPostByPostId } from "@/app/api/post/postDao";

type ContextPropds = {
  params: {
    postId: PostId;
  };
};

export async function POST(req: Request, context: ContextPropds) {
  try {
    const session = await auth();
    const { postId } = context.params;
    const { medeCount } = createMedeBodySchema.parse(await req.json());

    const post = await getPostByPostId({ postId });
    const postUserId = post.userId;

    if (session?.user === undefined || session?.user?.id === postUserId) {
      return NextResponse.json(
        { message: "not allowed to add mede" },
        { status: 403 }
      );
    }

    const mededUserId = session.user.id;

    const userMedeCount = await getUserMedeCountForPost({
      postId,
      userId: mededUserId,
    });

    const totalMedeCount = userMedeCount + medeCount;

    if (totalMedeCount > MAX_MEDE_COUNT) {
      return NextResponse.json(
        { message: "maximum number of mede has been exceeded" },
        { status: 429 }
      );
    }

    await createManyMede({ postId, userId: mededUserId, medeCount });

    const response = createMedeOutputSchema.parse({ totalMedeCount });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error occurred" },
      { status: 500 }
    );
  }
}
