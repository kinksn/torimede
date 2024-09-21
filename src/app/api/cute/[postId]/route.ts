import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import {
  createCuteBodySchema,
  MAX_CUTE_COUNT,
} from "@/app/api/cute/[postId]/model";
import { PostId } from "@/app/api/post/model";
import {
  createManyCute,
  getCuteCountByPostId,
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
    const { userId, cuteCount } = createCuteBodySchema.parse(await req.json());

    if (session == null || session?.user?.id === userId) {
      return NextResponse.json(
        { message: "not arrow add cute" },
        { status: 403 }
      );
    }

    const currentCuteCount = await getCuteCountByPostId({ postId });

    if (currentCuteCount + cuteCount > MAX_CUTE_COUNT) {
      return NextResponse.json(
        { message: "maximum number of cute has been exceeded" },
        { status: 413 }
      );
    }

    await createManyCute({ postId, cuteCount });

    return NextResponse.json(
      { message: `cutes added: ${cuteCount}` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
