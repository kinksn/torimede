"use client";

import ButtonAction from "@/components/ButtonAction";
import PostBottomRightPC from "@/components/assets/ornament/post-bottom-right-pc.svg";
import PostBottomLeftPC from "@/components/assets/ornament/post-bottom-left-pc.svg";
import PostBottomRightSP from "@/components/assets/ornament/post-bottom-right-sp.svg";
import PostBottomLeftSP from "@/components/assets/ornament/post-bottom-left-sp.svg";
import { CuteButton } from "@/components/CuteButton";
import { ShareButtons } from "@/components/ShareButtons";
import { UrlCopyButton } from "@/components/UrlCopyButton";
import { GetPostDetailOutput, GetUserPostsOutput } from "@/app/api/post/model";
import { ImageItem } from "@/components/basic/ImageItem";
import UserPostCards from "@/app/post/[...id]/_components/UserPostCards";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { Avatar } from "@/components/basic/Avatar";
import { Tag } from "@/components/basic/Tag";
import { Session } from "next-auth";

type PostDetailPageProps = {
  post: GetPostDetailOutput;
  userPosts: GetUserPostsOutput;
  session: Session | null;
  userCuteCount: number;
  // 投稿詳細モーダルから読み込まれているかどうか
  isParentModal?: boolean;
};

export function PostDetailPage({
  post,
  userPosts,
  session,
  userCuteCount,
  isParentModal,
}: PostDetailPageProps) {
  const { id: postId } = post;
  const { id: userId, name: userName, image: userProfileImage } = post.user;

  const isMyPost = post.userId === session?.user?.id;

  return (
    <div className="relative overflow-y-scroll">
      <div className="max-w-[1064px] mx-auto mt-10 max-sm:px-5">
        <div className="flex flex-col gap-3">
          <h2 className="text-typography-xl font-bold leading-normal font-zenMaruGothic">
            {post?.title}
          </h2>
          <div className="flex">
            {userProfileImage && (
              // 投稿詳細モーダルからユーザーページに遷移する際、
              // なぜかユーザーページで投稿詳細モーダルを開いて閉じると移前のモーダルが残ったまま表示されてしまうため、
              // aタグでページ遷移して強制リフレッシュしている。
              // 原因は定かではないがおそらくParallel RouteかIntercepting Routeのバグかと思われる。
              <a href={`/user/${post.userId}`}>
                <Avatar size="sm" profileImage={userProfileImage} />
              </a>
            )}
            <p>{userName}</p>
          </div>
        </div>
        <div className="flex justify-center mt-5">
          <ImageItem
            imageUrl={post.image}
            alt={post.title}
            className="w-full max-h-[633px]"
            actionButton={
              isMyPost && (
                <ButtonAction
                  postId={postId}
                  userId={userId}
                  isParentModal={isParentModal}
                />
              )
            }
            isFitContainer
          />
        </div>
      </div>
      <div className="flex max-w-[1064px] w-full mx-auto px-10 max-sm:px-10">
        <div>
          <SVGIcon svg={PostBottomLeftPC} className="h-10 max-sm:hidden" />
          <SVGIcon svg={PostBottomLeftSP} className="h-5 hidden max-sm:block" />
        </div>
        <div className="relative h-10 w-full max-sm:h-5 bg-primary-50">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
            <CuteButton
              postId={post.id}
              userCuteCount={userCuteCount}
              session={session}
            />
          </div>
        </div>
        <div>
          <SVGIcon svg={PostBottomRightPC} className="h-10 max-sm:hidden" />
          <SVGIcon
            svg={PostBottomRightSP}
            className="h-5 hidden max-sm:block"
          />
        </div>
      </div>
      <div className="flex justify-between max-sm:flex-col gap-10 max-sm:gap-5 items-start max-w-[1104px] w-full mx-auto my-10 px-10 max-sm:px-5">
        <div
          className={`${!post?.content && post.tags.length === 0 && "hidden"}`}
        >
          {post?.content && (
            <p
              className={`text-typography-md ${post.tags.length > 0 && "mb-4"}`}
            >
              {post.content}
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <Tag href={tag.name} key={tag.id}>
                  {tag.name}
                </Tag>
              ))}
            </div>
          )}
        </div>
        <div
          className={`${
            !post?.content && post.tags.length === 0 && "w-full justify-center"
          } flex items-center max-sm:flex-col max-sm:items-start gap-3 max-sm:gap-2 min-w-[386px] max-sm:min-w-[unset] border border-primary-50 bg-base-content rounded-20 p-6 max-sm:p-3 max-sm:w-full`}
        >
          <p className="text-typography-xs">共有</p>
          <div className="flex gap-3">
            <ShareButtons text={post.title} />
            <UrlCopyButton />
          </div>
        </div>
      </div>
      {userPosts.length > 0 && (
        <UserPostCards userPosts={userPosts} userName={userName} />
      )}
    </div>
  );
}
