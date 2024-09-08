import { db } from "@/lib/db";
import { FC } from "react";
import Modal from "@/components/Modal";
import { GetPostOutput, GetPostSelectTags } from "@/app/api/post/model";
import { Cute, User } from "@prisma/client";
import { PostDetailPage } from "@/app/post/[...id]/PostDetailPage";

type PostProps = {
  params: {
    id: [postId: string, userId: string];
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
    })),
  };

  return formattedPosts;
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

  const formattedPosts: GetPostOutput[] = posts.map((post: any) => ({
    ...post,
    tags: post.tags.map((tagRelation: any) => {
      return {
        name: tagRelation.tag.name,
        id: tagRelation.tag.id,
      };
    }),
  }));

  return formattedPosts;
}
const PostDetail: FC<PostProps> = async ({ params }) => {
  const [postId, userId] = params.id;
  const post = await getPost(postId);
  const userPost = await getPostByUserId(userId, postId);

  return (
    <Modal>
      <PostDetailPage post={post} userPosts={userPost} />
    </Modal>
  );
};

export default PostDetail;
