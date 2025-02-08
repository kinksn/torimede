import { getPostDetailOutputSchema, PostId } from "@/app/api/post/model";
import EditPostPage from "@/app/edit/[id]/EditPostPage";
import ButtonAction from "@/components/ButtonAction";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";

async function getPostByUserId(postId: string) {
  const post = await db.post.findFirst({
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
      user: true,
      userId: true,
      cutes: true,
    },
  });

  const formattedPost = {
    ...post,
    tags: post.tags.map((tag: any) => {
      return {
        id: tag.tag.id,
        name: tag.tag.name,
        userId: tag.tag.userId,
      };
    }),
  };

  return getPostDetailOutputSchema.parse(formattedPost);
}

type EditPostPageProps = {
  params: {
    id: PostId;
  };
};

const Edit = async ({ params }: EditPostPageProps) => {
  const post = await getPostByUserId(params.id);
  const session = await getAuthSession();
  const tags = await db.tag.findMany({
    orderBy: {
      id: "desc",
    },
  });
  return (
    <>
      <ButtonAction
        className="absolute top-2 right-2"
        postId={post.id}
        userId={post.userId}
        isDeleteOnly
      />
      <EditPostPage post={post} tags={tags} session={session} />
    </>
  );
};

export default Edit;
