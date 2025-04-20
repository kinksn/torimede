"use client";

import ArrowLeft from "@/components/assets/icon/arrow-left.svg";
import ButtonAction from "@/components/ButtonAction";
import PostBottomRightPC from "@/components/assets/ornament/post-bottom-right-pc.svg";
import PostBottomLeftPC from "@/components/assets/ornament/post-bottom-left-pc.svg";
import PostBottomRightSP from "@/components/assets/ornament/post-bottom-right-sp.svg";
import PostBottomLeftSP from "@/components/assets/ornament/post-bottom-left-sp.svg";
import axiosInstance from "@/lib/axios";
import UserPostCards from "@/app/post/[...id]/_components/UserPostCards";
import { ShareButtons } from "@/components/ShareButtons";
import { UrlCopyButton } from "@/components/UrlCopyButton";
import {
  GetPostDetailOutput,
  GetUserPostsOutput,
  PostId,
} from "@/app/api/post/model";
import { ImageItem } from "@/components/basic/ImageItem";
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
import { useEffect, useRef, useState } from "react";
import { UIBlocker } from "@/components/UIBlocker";
import { useUIBlock } from "@/hooks/useUIBlock";
import { Tooltip } from "@/components/basic/Tooltip";
import {
  CreateMedeOutput,
  MAX_MEDE_COUNT,
} from "@/app/api/mede/[postId]/model";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { RoundButton } from "@/components/basic/RoundButton";
import { ReportForm } from "@/app/post/[...id]/_components/ReportForm";

// メデ文字のカラーバリエーション
const medeMojiColorKeys = Object.keys(
  MEDEMOJI_COLORS
) as MedeMojiColorsVariant[];

// メデ文字のプール値の型
type MedeMojiPoolItem = {
  /** アニメーション開始時に一意になるID */
  uniqueId: number;
  /** 表示(使用)中か否か */
  inUse: boolean;
  x: number;
  y: number;
  variant: MedeMojiColorsVariant;
};

type PostDetailPageProps = {
  post: GetPostDetailOutput;
  userPosts: GetUserPostsOutput;
  session: Session | null;
  userMedeCount: number;
  isParentModal?: boolean;
};

export function PostDetailPage({
  post,
  userPosts,
  session,
  userMedeCount,
  isParentModal,
}: PostDetailPageProps) {
  const { id: postId } = post;
  const { id: userId, name: userName, image: userProfileImage } = post.user;
  // 「メデ」回数関連
  const [tempMedeCount, setTempMedeCount] = useState(0);
  const [internalUserMedeCount, setInternalUserMedeCount] =
    useState(userMedeCount);
  // 使い回し用のプール配列。初期は空配列。
  const [medeMojiPool, setMedeMojiPool] = useState<MedeMojiPoolItem[]>([]);
  // カラーを順繰りに切り替えるためのインデックス
  const [medeMojiColorIndex, setMedeMojiColorIndex] = useState(0);
  const { isUIBlock } = useUIBlock();
  const router = useRouter();
  const medeMojiContainerRef = useRef<HTMLDivElement>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);

  const isMyPost = post.userId === session?.user?.id;

  useEffect(() => {
    const containerEl = medeMojiContainerRef.current;
    if (!containerEl) return;

    // ResizeObserverで要素のサイズ変更を監視
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        // 要素の幅や高さを取得してステートに反映
        // getBoundingClientRect() でもOK
        // ここでは contentRect も使えますが、余白や座標など必要なら boundingClientRectの方が確実です
        setContainerRect(containerEl.getBoundingClientRect());
      }
    });
    observer.observe(containerEl);

    // クリーンアップ
    return () => {
      observer.disconnect();
    };
  }, []);

  const postMede = async ({
    postId,
    medeCount,
  }: {
    postId: PostId;
    medeCount: number;
  }) => {
    if (isMyPost) return;
    const response = await axiosInstance.post<CreateMedeOutput>(
      `/mede/${postId}`,
      {
        medeCount,
      }
    );
    return response.data;
  };

  const { mutate: submitMede } = useMutation({
    mutationFn: () => postMede({ postId: post.id, medeCount: tempMedeCount }),
    onSuccess: (data) => {
      if (data) {
        setInternalUserMedeCount(data.totalMedeCount);
      }
      setTempMedeCount(0);
      router.refresh();
    },
    onError: (error) => {
      console.error("Error adding mede:", error);
    },
  });

  const onShowMedemoji = () => {
    if (!containerRect) return;

    const padding = 80;
    const x = padding + Math.random() * (containerRect.width - padding * 2);
    const y = padding + Math.random() * (containerRect.height - padding * 2);

    // メデ文字の色を順番に切り替える
    const currentVariant = medeMojiColorKeys[medeMojiColorIndex];
    setMedeMojiColorIndex(
      (prevIndex) => (prevIndex + 1) % medeMojiColorKeys.length
    );

    // メデ文字プールから未使用要素を探す
    setMedeMojiPool((prev) => {
      const next = [...prev];
      const freeIndex = next.findIndex((item) => !item.inUse);

      if (freeIndex >= 0) {
        // 未使用アイテムが見つかったら再利用
        next[freeIndex] = {
          uniqueId: Date.now() + Math.random(),
          inUse: true,
          x,
          y,
          variant: currentVariant,
        };
      } else {
        // 未使用が無ければ新規にプールへ追加する
        next.push({
          uniqueId: Date.now() + Math.random(),
          inUse: true,
          x,
          y,
          variant: currentVariant,
        });
      }
      return next;
    });
  };

  // アニメーション終了時に inUse を false に戻し、再利用可能にする
  const removeMoji = (uniqueId: number) => {
    setMedeMojiPool((prev) =>
      prev.map((item) =>
        item.uniqueId === uniqueId ? { ...item, inUse: false } : item
      )
    );
  };

  return (
    <div
      className={`relative max-sm:mt-4 ${
        isParentModal && "max-sm:h-full max-sm:mt-auto"
      }`}
    >
      <UIBlocker zIndex={1} />
      <div className="max-w-[1064px] mx-auto px-5 max-sm:px-0">
        {!isParentModal && (
          <div className="flex justify-between items-center gap-3 max-sm:px-5 mt-10 max-sm:mt-0 mb-5 max-sm:mb-2 z-[21] w-full">
            <div className="flex items-center gap-4">
              <h2
                className={`text-typography-xl max-sm:text-base font-bold leading-normal max-sm:leading-none font-zenMaruGothic line-clamp-2 max-sm:line-clamp-1`}
              >
                {post?.title}
              </h2>
            </div>
            <div className="flex max-sm:text-xs font-bold items-center">
              {userProfileImage && (
                <a
                  href={`/user/${post.userId}`}
                  className="flex items-center gap-1"
                >
                  <Avatar
                    size="sm"
                    profileImage={userProfileImage}
                    className="max-sm:w-6 max-sm:h-6"
                  />
                  <p className="overflow-hidden whitespace-nowrap text-ellipsis max-w-[20ch] max-sm:max-w-[9ch]">
                    {userName}
                  </p>
                </a>
              )}
            </div>
          </div>
        )}
        <div
          className={`relative flex justify-center`}
          ref={medeMojiContainerRef}
        >
          {post.images.map((image) => (
            <ImageItem
              key={image.id}
              imageUrl={image.url}
              alt={image?.alt}
              className="w-full max-h-[768px] max-sm:rounded-none max-sm:max-h-[72svh]"
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

          {/* プール内のMedeMojiItemをすべて描画。
              inUse=true なら表示 / false ならnull */}
          {medeMojiPool.map((item, index) => {
            if (!item.inUse) return null;
            return (
              <MedeMojiItem
                key={index} // 配列の順番が変わらないならindexでもOK。あるいは uniqueIdを使ってもOK
                x={item.x}
                y={item.y}
                variant={item.variant}
                onAnimationEnd={() => removeMoji(item.uniqueId)}
              />
            );
          })}
        </div>
      </div>
      <div className="flex max-w-[1064px] w-full mx-auto px-[34px] max-sm:px-0">
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
              disabled={internalUserMedeCount < MAX_MEDE_COUNT}
            >
              <MedeButton
                userMedeCount={userMedeCount}
                session={session}
                tempMedeCount={tempMedeCount}
                setTempMedeCount={setTempMedeCount}
                submitMede={submitMede}
                submitCallback={onShowMedemoji}
                disabled={internalUserMedeCount === MAX_MEDE_COUNT}
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
        style={{
          userSelect: isUIBlock ? "none" : "auto",
          WebkitUserSelect: isUIBlock ? "none" : "auto",
        }}
      >
        <div
          className={`${!post?.content && post.tags.length === 0 && "hidden"}`}
        >
          {post?.content && (
            <p
              className={`text-typography-md whitespace-pre-line ${
                post.tags.length > 0 && "mb-4"
              }`}
            >
              {post.content}
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 max-sm:select-none">
              {post.tags.map((tag) => (
                <Tag href={tag.name} key={tag.id}>
                  {tag.name}
                </Tag>
              ))}
            </div>
          )}
        </div>
        <div
          className={`flex flex-col gap-5 max-sm:w-full ${!post?.content && post.tags.length === 0 && "w-full"} ${userPosts.length <= 0 && isParentModal && "max-sm:pb-14"}`}
        >
          <div
            className={`flex items-center max-sm:flex-col max-sm:items-start gap-3 max-sm:gap-2 min-w-[fit-content] max-sm:min-w-[unset] border border-primary-50 bg-base-bg rounded-20 p-6 max-sm:p-4 max-sm:w-full ${
              !post?.content &&
              post.tags.length === 0 &&
              "w-full justify-center max-sm:mb-5"
            }`}
          >
            <p className="text-typography-xs">共有</p>
            <div className="flex gap-3 max-sm:w-full max-sm:justify-between whitespace-nowrap">
              <ShareButtons text={post.title} />
              <UrlCopyButton />
            </div>
          </div>
          {session?.user && <ReportForm postId={postId} userId={userId} />}
        </div>
      </div>
      {userPosts.length > 0 && (
        <UserPostCards
          userPosts={userPosts}
          userName={userName}
          className={isParentModal ? "max-sm:pb-5" : ""}
        />
      )}
    </div>
  );
}
