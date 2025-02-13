import { db } from "@/lib/db";
import { FC } from "react";
import {
  getPostDetailOutputSchema,
  getUserPostsOutputSchema,
  GetPostSelectTags,
  PostId,
} from "@/app/api/post/model";
import { Cute, User } from "@prisma/client";
import { UserId } from "@/app/api/user/model";
import { getAuthSession } from "@/lib/auth";
import ModalPostDetailPage from "@/app/@modal/(.)post/[...id]/ModalPostDetailPage";
import { getUserCuteCountForPost } from "@/app/api/cute/[postId]/cuteDao";

type PostProps = {
  params: {
    id: [postId: PostId, userId: UserId];
  };
};

async function getPost(postId: string) {
  const post: GetPostSelectTags & { user: User; cutes: Cute[] } =
    await db.post.findFirst({
      where: {
        id: postId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        tags: {
          select: {
            tag: true,
          },
        },
        userId: true,
        cutes: true,
        user: true,
      },
    });

  const formattedPosts = {
    ...post,
    tags: post.tags.map((tagRelation) => ({
      name: tagRelation.tag.name,
      id: tagRelation.tag.id,
      userId: tagRelation.tag.userId,
    })),
  };

  return getPostDetailOutputSchema.parse(formattedPosts);
}

async function getPostByUserId(userId: string, postId: string) {
  const posts = await db.post.findMany({
    where: {
      userId,
      id: {
        not: postId,
      },
    },
    select: {
      id: true,
      title: true,
      content: true,
      image: true,
      tags: {
        select: {
          tag: true,
        },
      },
      userId: true,
      cutes: true,
    },
  });

  const formattedPosts = posts.map((post: any) => ({
    ...post,
    tags: post.tags.map((tagRelation: any) => {
      return {
        name: tagRelation.tag.name,
        id: tagRelation.tag.id,
        userId: tagRelation.tag.userId,
      };
    }),
  }));

  return getUserPostsOutputSchema.parse(formattedPosts);
}

async function fetchUserCuteCount({
  postId,
  userId,
}: {
  postId: PostId;
  userId: UserId | undefined;
}) {
  if (!userId) {
    return 0;
  }
  const userCuteCount = await getUserCuteCountForPost({ postId, userId });
  return userCuteCount;
}

const PostDetail: FC<PostProps> = async ({ params }) => {
  const [postId, userId] = params.id;
  const session = await getAuthSession();
  const post = await getPost(postId);
  const userPost = await getPostByUserId(userId, postId);
  // 現在ログインしているユーザーがpostで取得した投稿を何回メデたかの回数取得
  const userCuteCount = await fetchUserCuteCount({
    postId,
    userId: session?.user?.id,
  });

  return (
    <ModalPostDetailPage
      post={post}
      userPosts={userPost}
      userCuteCount={userCuteCount}
      session={session}
    />
  );
};

export default PostDetail;
