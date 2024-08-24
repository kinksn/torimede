import BackButton from "@/components/BackButton";
import ButtonAction from "@/components/ButtonAction";
import { db } from "@/lib/db";
import Tag from "@/components/Tag";
import { FC } from "react";
import { getAuthSession } from "@/lib/auth";
import Image from "next/image";
import CuteButton from "@/components/CuteButton";

type PostProps = {
  params: {
    id: string;
  };
};

async function getPost(id: string) {
  const response = await db.post.findFirst({
    where: {
      id,
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
  const post = await getPost(params.id);
  const session = await getAuthSession();

  return (
    <div>
      <BackButton />
      <div className="mb-8">
        <h2 className="text-2xl font-bold my-4">{post?.title}</h2>
        {post.userId === session?.user?.id && (
          <ButtonAction id={params.id} userId={post.userId} />
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
    </div>
  );
};

export default BlogDetailPage;
