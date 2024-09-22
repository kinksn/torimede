import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import {
  createCuteBodySchema,
  createCuteOutputSchema,
  MAX_CUTE_COUNT,
} from "@/app/api/cute/[postId]/model";
import { PostId } from "@/app/api/post/model";
import {
  createManyCute,
  getCuteCountByUserId,
} from "@/app/api/cute/[postId]/cuteDao";

type ContextPropds = {
  params: {
    postId: PostId;
  };
};

export async function POST(req: Request, context: ContextPropds) {
  try {
    const session = await getAuthSession();
    const { postId } = context.params;
    const { userId: postUserId, cuteCount } = createCuteBodySchema.parse(
      await req.json()
    );

    if (session?.user === undefined || session?.user?.id === postUserId) {
      return NextResponse.json(
        { message: "not arrow add cute" },
        { status: 403 }
      );
    }

    const cutedUserId = session.user.id;

    const userCuteCount = await getCuteCountByUserId({
      postId,
      userId: cutedUserId,
    });

    const totalCuteCount = userCuteCount + cuteCount;

    if (totalCuteCount > MAX_CUTE_COUNT) {
      return NextResponse.json(
        { message: "maximum number of cute has been exceeded" },
        { status: 413 }
      );
    }

    await createManyCute({ postId, userId: cutedUserId, cuteCount });

    const response = createCuteOutputSchema.parse({ totalCuteCount });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
