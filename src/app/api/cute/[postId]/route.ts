import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createCuteBodySchema,
  createCuteOutputSchema,
  MAX_CUTE_COUNT,
} from "@/app/api/cute/[postId]/model";
import { PostId } from "@/app/api/post/model";
import {
  createManyCute,
  getUserCuteCountForPost,
} from "@/app/api/cute/[postId]/cuteDao";
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
    const { cuteCount } = createCuteBodySchema.parse(await req.json());

    const post = await getPostByPostId({ postId });
    const postUserId = post.userId;

    if (session?.user === undefined || session?.user?.id === postUserId) {
      return NextResponse.json(
        { message: "not allowed to add cute" },
        { status: 403 }
      );
    }

    const cutedUserId = session.user.id;

    const userCuteCount = await getUserCuteCountForPost({
      postId,
      userId: cutedUserId,
    });

    const totalCuteCount = userCuteCount + cuteCount;

    if (totalCuteCount > MAX_CUTE_COUNT) {
      return NextResponse.json(
        { message: "maximum number of cute has been exceeded" },
        { status: 429 }
      );
    }

    await createManyCute({ postId, userId: cutedUserId, cuteCount });

    const response = createCuteOutputSchema.parse({ totalCuteCount });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
