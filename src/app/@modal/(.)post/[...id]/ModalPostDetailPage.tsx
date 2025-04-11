"use client";

import ArrowLeft from "@/components/assets/icon/arrow-left.svg";
import { useAtom } from "jotai";
import { historyIndexTrackerIndexAtom } from "@/lib/globalState/historyIndexTrackerIndexAtom";
import {
  Credenza,
  CredenzaDescription,
  CredenzaContent,
  CredenzaBody,
  CredenzaTitle,
  CredenzaHeader,
} from "@/components/ui/credenza";
import type {
  GetPostDetailOutput,
  GetUserPostsOutput,
} from "@/app/api/post/model";
import { Session } from "next-auth";
import { PostDetailPage } from "@/app/post/[...id]/PostDetailPage";
import { useState } from "react";
import { RoundButton } from "@/components/basic/RoundButton";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/basic/Avatar";

type ModalPostDetailPageProps = {
  post: GetPostDetailOutput;
  userPosts: GetUserPostsOutput;
  userMedeCount: number;
  session: Session | null;
};

const ModalPostDetailPage = ({
  post,
  userPosts,
  userMedeCount,
  session,
}: ModalPostDetailPageProps) => {
  const { id: userId, name: userName, image: userProfileImage } = post.user;
  const router = useRouter();
  const [historyIndex] = useAtom(historyIndexTrackerIndexAtom);
  const [isOpen, setIsOpen] = useState(true);

  const onDismiss = () => {
    setIsOpen(false);
    history.go(-historyIndex);
  };

  return (
    <Credenza open={isOpen} onOpenChange={onDismiss}>
      <CredenzaContent
        className="p-0 h-full content-baseline bg-base-content translate-x-0 translate-y-0 overflow-y-scroll bottom-0 w-full rounded-br-none rounded-bl-none max-sm:rounded-tr-[20px] max-sm:rounded-tl-[20px] data-[state=open]:!animate-slideUp data-[state=closed]:transition-none data-[state=closed]:!animate-none max-sm:mt-0 overflow-hidden border-none [&>.hinge]:mb-1 gap-0"
        style={{ top: "12px", left: "unset" }}
      >
        <CredenzaHeader className="p-0 max-w-[1064px] px-5 max-sm:px-0 mx-auto w-full pb-5 max-sm:pb-0">
          <div
            className={`flex justify-between items-center gap-3 max-sm:px-5 mt-10 max-sm:mt-0 w-full max-sm:pb-2`}
          >
            <div className="flex items-center gap-4">
              {
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
              }
              <CredenzaTitle className="text-typography-xl max-sm:text-base font-bold leading-normal max-sm:leading-none font-zenMaruGothic line-clamp-2 max-sm:line-clamp-1">
                {post.title}
              </CredenzaTitle>
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

          <CredenzaDescription className="sr-only">
            {post?.content}
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="overflow-y-scroll p-0">
          <PostDetailPage
            post={post}
            userPosts={userPosts}
            userMedeCount={userMedeCount}
            session={session}
            // 投稿詳細モーダルから読み込まれているかどうか
            isParentModal
          />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
};

export default ModalPostDetailPage;
