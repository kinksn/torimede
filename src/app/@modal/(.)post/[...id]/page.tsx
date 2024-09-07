import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import ButtonAction from "@/components/ButtonAction";
import CuteButton from "@/components/CuteButton";
import { default as PostTag } from "@/components/Tag";
import Image from "next/image";
import { FC } from "react";
import Modal from "@/components/Modal";
import PostCard from "@/components/PostCard";
import { ShareButtons } from "@/components/ShareButtons";
import { UrlCopyButton } from "@/components/UrlCopyButton";
import { GetPostOutput, GetPostSelectTags } from "@/app/api/post/model";
import { Cute, User } from "@prisma/client";
import Link from "next/link";

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
            tag: {
              select: {
                name: true,
                id: true,
              },
            },
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
          tag: {
            select: {
              name: true,
              id: true,
            },
          },
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
  const session = await getAuthSession();
  const { name: userName, image: userProfileImage } = post.user;

  return (
    <Modal>
      <div className="mb-8">
        <h2 className="text-2xl font-bold my-4">{post?.title}</h2>
        {post.userId === session?.user?.id && (
          <ButtonAction id={postId} userId={post.userId} />
        )}
        {post.userId !== session?.user?.id && session !== null && (
          <>
            <CuteButton
              ids={{
                postId: post.id,
                userId: post.userId,
              }}
            />
            <span>{post.cutes.length}</span>
          </>
        )}
      </div>
      {post?.image && (
        <Image src={post.image} alt="" width="100" height="100" />
      )}
      <div className="flex">
        {userProfileImage && (
          <Link href={`/user/${userId}`}>
            <Image src={userProfileImage} alt="" width="28" height="28" />
          </Link>
        )}
        <p>{userName}</p>
      </div>
      <p className="text-state-700">{post?.content}</p>
      {post.tags.map((tag) => (
        <PostTag tag={tag} key={tag.id} />
      ))}
      <div>
        <ShareButtons text={post.title} />
        <UrlCopyButton />
      </div>
      <h2 className="text-1xl font-bold my-4">{userName}の投稿</h2>
      {userPost.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </Modal>
  );
};

export default PostDetail;
