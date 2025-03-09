"use client";

import { useAtom } from "jotai";
import { historyIndexTrackerIndexAtom } from "@/lib/globalState/historyIndexTrackerIndexAtom";
import {
  Credenza,
  CredenzaDescription,
  CredenzaContent,
  CredenzaBody,
  CredenzaTitle,
} from "@/components/ui/credenza";
import type {
  GetPostDetailOutput,
  GetUserPostsOutput,
} from "@/app/api/post/model";
import { Session } from "next-auth";
import { PostDetailPage } from "@/app/post/[...id]/PostDetailPage";
import { useState } from "react";

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
  const [historyIndex] = useAtom(historyIndexTrackerIndexAtom);
  const [isOpen, setIsOpen] = useState(true);

  const onDismiss = () => {
    setIsOpen(false);
    history.go(-historyIndex);
  };

  return (
    <Credenza open={isOpen} onOpenChange={onDismiss}>
      <CredenzaContent
        className="p-0 h-full bg-base-bg translate-x-0 translate-y-0 overflow-y-scroll bottom-0 w-full rounded-br-none rounded-bl-none max-sm:rounded-tr-[20px] max-sm:rounded-tl-[20px] data-[state=open]:!animate-slideUp data-[state=closed]:transition-none data-[state=closed]:!animate-none max-sm:mt-0 overflow-hidden border-none [&>.hinge]:mb-1"
        style={{ top: "12px", left: "unset" }}
      >
        <CredenzaTitle className="sr-only">{post.title}</CredenzaTitle>
        <CredenzaDescription className="sr-only">
          {post?.content}
        </CredenzaDescription>
        <CredenzaBody className="overflow-y-scroll max-sm:h-[calc(100%-32px)] p-0">
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
