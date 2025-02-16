"use client";

import { useAtom } from "jotai";
import { historyIndexTrackerIndexAtom } from "@/lib/globalState/historyIndexTrackerIndexAtom";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type {
  GetPostDetailOutput,
  GetUserPostsOutput,
} from "@/app/api/post/model";
import { Session } from "next-auth";
import { PostDetailPage } from "@/app/post/[...id]/PostDetailPage";

type ModalPostDetailPageProps = {
  post: GetPostDetailOutput;
  userPosts: GetUserPostsOutput;
  userCuteCount: number;
  session: Session | null;
};

const ModalPostDetailPage = ({
  post,
  userPosts,
  userCuteCount,
  session,
}: ModalPostDetailPageProps) => {
  const [historyIndex] = useAtom(historyIndexTrackerIndexAtom);

  const onDismiss = () => {
    history.go(-historyIndex);
  };

  return (
    <Dialog defaultOpen onOpenChange={onDismiss}>
      <DialogContent
        className="max-h-[98svh] p-0 h-full bg-base-bg translate-x-0 translate-y-0 overflow-y-scroll bottom-0 w-full rounded-br-none rounded-bl-none data-[state=open]:!animate-slideUp data-[state=closed]:transition-none data-[state=closed]:!animate-none"
        style={{ top: "unset", left: "unset" }}
      >
        <DialogTitle className="sr-only">{post.title}</DialogTitle>
        <DialogDescription className="sr-only">
          {post?.content}
        </DialogDescription>
        <PostDetailPage
          post={post}
          userPosts={userPosts}
          userCuteCount={userCuteCount}
          session={session}
          // 投稿詳細モーダルから読み込まれているかどうか
          isParentModal
        />
      </DialogContent>
    </Dialog>
  );
};

export default ModalPostDetailPage;
