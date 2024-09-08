import BackButton from "@/components/BackButton";
import ButtonAction from "@/components/ButtonAction";
import { default as PostTag } from "@/components/Tag";
import { getAuthSession } from "@/lib/auth";
import Image from "next/image";
import CuteButton from "@/components/CuteButton";
import PostCard from "@/components/PostCard";
import { ShareButtons } from "@/components/ShareButtons";
import { UrlCopyButton } from "@/components/UrlCopyButton";
import { GetPostOutput } from "@/app/api/post/model";
import { Cute, User } from "@prisma/client";
import Link from "next/link";

type PostDetailPageProps = {
  post: GetPostOutput & { user: User; cutes: Cute[] };
  userPosts: GetPostOutput[];
};

export async function PostDetailPage({ post, userPosts }: PostDetailPageProps) {
  const session = await getAuthSession();
  const { name: userName, image: userProfileImage } = post.user;

  return (
    <div>
      <BackButton />
      <div className="mb-8">
        <h2 className="text-2xl font-bold my-4">{post?.title}</h2>
        {post.userId === session?.user?.id && (
          <ButtonAction id={post.id} userId={post.userId} />
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
        <Image
          src={post.image}
          alt=""
          width="900"
          height="900"
          className="w-full h-auto"
        />
      )}
      <div className="flex">
        {userProfileImage && (
          <Link href={`/user/${post.userId}`}>
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
      {userPosts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </div>
  );
}
