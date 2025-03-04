"use client";

import ArrowLeft from "@/components/assets/icon/arrow-left.svg";
import ButtonAction from "@/components/ButtonAction";
import PostBottomRightPC from "@/components/assets/ornament/post-bottom-right-pc.svg";
import PostBottomLeftPC from "@/components/assets/ornament/post-bottom-left-pc.svg";
import PostBottomRightSP from "@/components/assets/ornament/post-bottom-right-sp.svg";
import PostBottomLeftSP from "@/components/assets/ornament/post-bottom-left-sp.svg";
import axiosInstance from "@/lib/axios";
import { ShareButtons } from "@/components/ShareButtons";
import { UrlCopyButton } from "@/components/UrlCopyButton";
import {
  GetPostDetailOutput,
  GetUserPostsOutput,
  PostId,
} from "@/app/api/post/model";
import { ImageItem } from "@/components/basic/ImageItem";
import UserPostCards from "@/app/post/[...id]/_components/UserPostCards";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { Avatar } from "@/components/basic/Avatar";
import { Tag } from "@/components/basic/Tag";
import { Session } from "next-auth";
import { MedeButton } from "@/components/basic/MedeButton";
import {
  MEDEMOJI_COLORS,
  MedeMojiColorsVariant,
  MedeMojiItem,
} from "@/components/basic/MedeButton/MedeMojiItem";
import { useRef, useState } from "react";
import { UIBlocker } from "@/components/UIBlocker";
import { useUIBlock } from "@/hooks/useUIBlock";
import { Tooltip } from "@/components/basic/Tooltip";
import {
  CreateCuteOutput,
  MAX_CUTE_COUNT,
} from "@/app/api/cute/[postId]/model";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { RoundButton } from "@/components/basic/RoundButton";

const medeMojiColorKeys = Object.keys(
  MEDEMOJI_COLORS
) as MedeMojiColorsVariant[];

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
  const [tempMedeCount, setTempMedeCount] = useState(0);
  const [userMedeCount, setUserMedeCount] = useState(userCuteCount);
  const [medeMoji, setMedeMoji] = useState<
    { id: number; x: number; y: number; variant: MedeMojiColorsVariant }[]
  >([]);
  const [medeMojiColorIndex, setMedeMojiColorIndex] = useState(0);
  const { uiBlock } = useUIBlock();
  const router = useRouter();

  const isMyPost = post.userId === session?.user?.id;

  const medeMojiContainerRef = useRef<HTMLDivElement>(null);

  const postMede = async ({
    postId,
    cuteCount,
  }: {
    postId: PostId;
    cuteCount: number;
  }) => {
    if (isMyPost) return;
    const response = await axiosInstance.post<CreateCuteOutput>(
      `/cute/${postId}`,
      {
        cuteCount,
      }
    );
    return response.data;
  };

  const { mutate: submitMede } = useMutation({
    mutationFn: () => postMede({ postId: post.id, cuteCount: tempMedeCount }),
    onSuccess: (data) => {
      data && setUserMedeCount(data.totalCuteCount);
      setTempMedeCount(0);
      router.refresh();
    },
    onError: (error) => {
      console.error("Error adding cute:", error);
    },
  });

  /**
   * クリックごとに1つのMedeMojiを追加
   * - containerRefの実際の幅高さを計測してランダム配置
   */
  const onShowMedemoji = () => {
    const container = medeMojiContainerRef.current;
    if (!container) return;

    // 表示領域を計測
    const rect = container.getBoundingClientRect();

    // アイコンサイズ想定で 100x100 を余白とみなす
    const padding = 100;
    const x = padding + Math.random() * (rect.width - padding * 2);
    const y = padding + Math.random() * (rect.height - padding * 2);

    const currentVariant = medeMojiColorKeys[medeMojiColorIndex];

    setMedeMoji((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        x,
        y,
        variant: currentVariant,
      },
    ]);

    setMedeMojiColorIndex(
      (prevIndex) => (prevIndex + 1) % medeMojiColorKeys.length
    );
  };

  /**
   * アニメ終了時にステートから削除 → DOMから消す
   */
  const removeMoji = (id: number) => {
    setMedeMoji((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div
      className={`relative mt-10 max-sm:mt-4 ${
        isParentModal && "max-sm:h-full"
      }`}
    >
      <UIBlocker zIndex={1} />
      <div className="max-w-[1064px] mx-auto">
        {isParentModal && (
          <div className="hidden max-sm:block w-full h-[16px]" />
        )}
        <div
          className={`flex justify-between items-center gap-3 max-sm:px-5 mt-10 max-sm:mt-0 z-[21] bg-base-bg w-full ${
            isParentModal && "max-sm:fixed max-sm:top-[19px] max-sm:pb-2 "
          }"
          }`}
        >
          <div className="flex items-center gap-4">
            {isParentModal && (
              <RoundButton
                size={"sm"}
                colorTheme={"white"}
                className="bg-transparent w-9 min-w-9 h-9 max-sm:w-6 max-sm:min-w-6 max-sm:h-6 relative top-[2px] max-sm:top-[1px] max-sm:-left-2"
                onClick={() => router.back()}
                icon={
                  <SVGIcon
                    svg={ArrowLeft}
                    className="w-5 font-bold text-textColor-basic"
                  />
                }
              />
            )}
            <h2
              className={`text-typography-xl max-sm:text-base font-bold leading-normal max-sm:leading-none font-zenMaruGothic line-clamp-2 max-sm:line-clamp-1`}
            >
              {post?.title}
            </h2>
          </div>
          <div className="flex max-sm:text-xs font-bold items-center">
            {userProfileImage && (
              // 投稿詳細モーダルからユーザーページに遷移する際、
              // なぜかユーザーページで投稿詳細モーダルを開いて閉じると移前のモーダルが残ったまま表示されてしまうため、
              // aタグでページ遷移して強制リフレッシュしている。
              // 原因は定かではないがおそらくParallel RouteかIntercepting Routeのバグかと思われる。
              <a
                href={`/user/${post.userId}`}
                className="flex items-center gap-1"
              >
                <Avatar
                  size="sm"
                  profileImage={userProfileImage}
                  className="max-sm:w-6 h-6"
                />
                <p className="overflow-hidden whitespace-nowrap text-ellipsis max-w-[20ch] max-sm:max-w-[9ch]">
                  {userName}
                </p>
              </a>
            )}
          </div>
        </div>
        <div
          className={`relative flex justify-center mt-5 ${
            isParentModal ? "max-sm:mt-0" : "max-sm:mt-4"
          }`}
          ref={medeMojiContainerRef}
        >
          {post.images.map((image) => (
            <ImageItem
              key={image.id}
              imageUrl={image.url}
              alt={image?.alt}
              className="w-full max-h-[633px] max-sm:rounded-none max-sm:max-h-[72svh]"
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
          ))}
          {medeMoji.map(({ id, x, y, variant }) => (
            <MedeMojiItem
              key={id}
              x={x}
              y={y}
              variant={variant}
              onAnimationEnd={() => removeMoji(id)}
            />
          ))}
        </div>
      </div>
      <div className="flex max-w-[1064px] w-full mx-auto px-5 max-sm:px-0">
        <div>
          <SVGIcon svg={PostBottomLeftPC} className="h-10 max-sm:hidden" />
          <SVGIcon svg={PostBottomLeftSP} className="h-5 hidden max-sm:block" />
        </div>
        <div className="relative h-10 w-full max-sm:h-5 bg-primary-50">
          <div className="absolute z-[2] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
            <Tooltip
              label="たくさんメデてくれてありがとメデ！<br />よければ他の鳥さんもメデてみてね🙏"
              aria-label="たくさんメデてくれてありがとメデ！よければ他の鳥さんもメデてみてね🙏"
              className="bottom-11"
              disabled={userCuteCount < MAX_CUTE_COUNT}
            >
              <MedeButton
                userMedeCount={userMedeCount}
                session={session}
                tempMedeCount={tempMedeCount}
                setTempMedeCount={setTempMedeCount}
                submitMede={submitMede}
                submitCallback={onShowMedemoji}
                disabled={userCuteCount === MAX_CUTE_COUNT}
                aria-live="polite"
              />
            </Tooltip>
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
      <div
        className={`flex justify-between max-sm:flex-col gap-10 max-sm:gap-5 items-start max-w-[1104px] w-full mx-auto mb-10 max-sm:mt-10 px-10 max-sm:px-5 ${
          !post?.content && post.tags.length === 0 ? "mt-10" : "mt-14"
        }`}
      >
        <div
          className={`${!post?.content && post.tags.length === 0 && "hidden"}`}
          style={{
            userSelect: uiBlock ? "none" : "auto",
            WebkitUserSelect: uiBlock ? "none" : "auto",
          }}
        >
          {post?.content && (
            <p
              className={`text-typography-md whitespace-pre-line max-sm:whitespace-normal ${
                post.tags.length > 0 && "mb-4"
              }`}
            >
              {post.content}
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="flex gap-2 max-sm:select-none">
              {post.tags.map((tag) => (
                <Tag href={tag.name} key={tag.id}>
                  {tag.name}
                </Tag>
              ))}
            </div>
          )}
        </div>
        <div
          className={`flex items-center max-sm:flex-col max-sm:items-start gap-3 max-sm:gap-2 min-w-[fit-content] max-sm:min-w-[unset] border border-primary-50 bg-base-content rounded-20 p-6 max-sm:p-4 max-sm:w-full ${
            !post?.content && post.tags.length === 0 && "w-full justify-center"
          }`}
        >
          <p className="text-typography-xs">共有</p>
          <div className="flex gap-3 max-sm:w-full max-sm:justify-between">
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
