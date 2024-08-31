import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import ButtonAction from "@/components/ButtonAction";
import CuteButton from "@/components/CuteButton";
import Tag from "@/components/Tag";
import Image from "next/image";
import { FC } from "react";
import Modal from "@/components/Modal";
import { PostAddRelationFields } from "@/types";
import PostCard from "@/components/PostCard";
import { ShareButtons } from "@/components/ShareButtons";
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
      user: true,
    },
  });
  return response;
}

async function getPostByUserId(userId: string, postId: string) {
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
            <CuteButton post={post} />
            <span>{post.cutes.length}</span>
          </>
        )}
      </div>
      {post?.image && (
        <Image src={post.image} alt="" width="100" height="100" />
      )}
      <div className="flex">
        {userProfileImage && (
          <Image src={userProfileImage} alt="" width="28" height="28" />
        )}
        <p>{userName}</p>
      </div>
      <p className="text-state-700">{post?.content}</p>
      {post?.tag && <Tag tag={post.tag} />}
      <div>
        <ShareButtons text={post.title} />
        <UrlCopyButton />
      </div>
      {userPost.map((post: PostAddRelationFields) => (
        <PostCard post={post} key={post.id} />
      ))}
    </Modal>
  );
};

export default PostDetail;
