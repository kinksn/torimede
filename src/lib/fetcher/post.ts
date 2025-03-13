import {
  getPostDetailOutputSchema,
  GetPostSelectTags,
  getUserPostsOutputSchema,
  PostId,
} from "@/app/api/post/model";
import { Mede, Post, PostTag, Tag, User } from "@prisma/client";
import { db } from "@/lib/db";
import { UserId } from "@/app/api/user/model";
import { getUserMedeCountForPost } from "@/app/api/mede/[postId]/medeDao";

type ExtendPost = Post & { tags: { tag: Tag }[] };

export async function getPost(postId: string) {
  const post: GetPostSelectTags & { user: User; medes: Mede[] } =
    await db.post.findFirst({
      where: {
        id: postId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        images: true,
        tags: {
          select: {
            tag: true,
          },
        },
        userId: true,
        medes: true,
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

export async function getPostByUserId(userId: string, postId: string) {
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
      images: true,
      tags: {
        select: {
          tag: true,
        },
      },
      userId: true,
      medes: true,
    },
  });

  const formattedPosts = posts.map((post: ExtendPost) => ({
    ...post,
    tags: post.tags.map((tagRelation) => {
      return {
        name: tagRelation.tag.name,
        id: tagRelation.tag.id,
        userId: tagRelation.tag.userId,
      };
    }),
  }));

  return getUserPostsOutputSchema.parse(formattedPosts);
}

export async function getUserMedeCount({
  postId,
  userId,
}: {
  postId: PostId;
  userId: UserId | undefined;
}) {
  if (!userId) {
    return 0;
  }

  return getUserMedeCountForPost({ postId, userId });
}
