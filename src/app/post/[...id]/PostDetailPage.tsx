import BackButton from "@/components/BackButton";
import ButtonAction from "@/components/ButtonAction";
import { PostTag } from "@/components/Tag";
import { getAuthSession } from "@/lib/auth";
import Image from "next/image";
import CuteButton from "@/components/CuteButton";
import PostCard from "@/components/PostCard";
import { ShareButtons } from "@/components/ShareButtons";
import { UrlCopyButton } from "@/components/UrlCopyButton";
import { GetPostDetailOutput, GetUserPostsOutput } from "@/app/api/post/model";
import Link from "next/link";

type PostDetailPageProps = {
  post: GetPostDetailOutput;
  userPosts: GetUserPostsOutput;
};

export async function PostDetailPage({ post, userPosts }: PostDetailPageProps) {
  const session = await getAuthSession();
  const { name: userName, image: userProfileImage } = post.user;

  const isMyPost = post.userId === session?.user?.id;

  return (
    <div>
      <div className="flex justify-between">
        <BackButton />
        {isMyPost && <ButtonAction id={post.id} userId={post.userId} />}
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold my-4">{post?.title}</h2>
      </div>
      <div className="flex mb-4">
        {userProfileImage && (
          <Link href={`/user/${post.userId}`}>
            <Image src={userProfileImage} alt="" width="28" height="28" />
          </Link>
        )}
        <p>{userName}</p>
      </div>
      <Image
        src={post.image}
        alt=""
        width="900"
        height="900"
        className="w-full h-auto"
      />
      {!isMyPost && session !== null && (
        <div className="flex justify-center items-center mt-4 mb-4">
          <CuteButton postId={post.id} />
        </div>
      )}
      <div className="flex justify-between mt-4">
        <div>
          <p className="text-state-700 mt-4 mb-4">{post?.content}</p>
          <div className="flex gap-2">
            {post.tags.map((tag) => (
              <PostTag tag={tag} key={tag.id} session={session} />
            ))}
          </div>
        </div>
        <div>
          <ShareButtons text={post.title} />
          <UrlCopyButton />
        </div>
      </div>
      <h2 className="text-1xl font-bold my-4">{userName}の投稿</h2>
      {userPosts.map((post) => (
        <PostCard post={post} key={post.id} session={session} />
      ))}
    </div>
  );
}
