import BackButton from "@/components/BackButton";
import ButtonAction from "@/components/ButtonAction";
import { db } from "@/lib/db";
import Tag from "@/components/Tag";
import { FC } from "react";
import { getAuthSession } from "@/lib/auth";
import Image from "next/image";
import CuteButton from "@/components/CuteButton";
import PostCard from "@/components/PostCard";
import { ShareButtons } from "@/components/ShareButtons";
import { PostAddRelationFields } from "@/types";
import { UrlCopyButton } from "@/components/UrlCopyButton";

type PostProps = {
  params: {
    id: [postId: string, userId: string];
  };
};

async function getPost(postId: string) {
  const response = await db.post.findFirst({
    where: {
      id: postId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      image: true,
      tag: true,
      userId: true,
      cutes: true,
    },
  });
  return response;
}

async function getPostByUserId(
  userId: string,
  postId: string
): Promise<PostAddRelationFields[]> {
  const response = await db.post.findMany({
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
      tag: true,
      userId: true,
      cutes: true,
    },
  });
  return response;
}

const BlogDetailPage: FC<PostProps> = async ({ params }) => {
  const [postId, userId] = params.id;
  const post = await getPost(postId);
  const userPost = await getPostByUserId(userId, postId);
  const session = await getAuthSession();

  return (
    <div>
      <BackButton />
      <div className="mb-8">
        <h2 className="text-2xl font-bold my-4">{post?.title}</h2>
        {post.userId === session?.user?.id && (
          <ButtonAction id={postId} userId={post.userId} />
        )}
        {post.userId !== session?.user?.id && session !== null && (
          <>
            <CuteButton post={post} />
            <span>{post.cutes.length}</span>
          </>
        )}
      </div>
      {post?.tag && <Tag tag={post.tag} />}
      {post?.image && (
        <Image src={post.image} alt="" width="100" height="100" />
      )}
      <p className="text-state-700">{post?.content}</p>
      <div>
        <ShareButtons text={post.title} />
        <UrlCopyButton />
      </div>
      {userPost.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </div>
  );
};

export default BlogDetailPage;
