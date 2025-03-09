"use client";

import axios from "axios";
import MenuIcon from "@/components/assets/icon/menu.svg";
import TrashIcon from "@/components/assets/icon/trash.svg";
import EditIcon from "@/components/assets/icon/edit.svg";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { postKeys } from "@/service/post/key";
import { PostId } from "@/app/api/post/model";
import { UserId } from "@/app/api/user/model";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MenuItem } from "@/components/basic/MenuItem";
import { RoundButton } from "@/components/basic/RoundButton";
import { toast } from "sonner";
import { Modal } from "@/components/basic/Modal";

type ButtonActionProps = {
  postId: PostId;
  userId: UserId;
  className?: string;
  // 投稿詳細モーダルから読み込まれているかどうか
  isParentModal?: boolean;
  isDeleteOnly?: boolean;
  redirectOnDelete?: boolean;
};

const ButtonAction = ({
  postId,
  userId,
  className,
  isParentModal,
  isDeleteOnly,
  redirectOnDelete = true,
}: ButtonActionProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // iOSの Chrome/Safariのみ、Drawer（Vaul）の中でPopoverを使うとpopoverのtriggerが効かなくなるバグがあるため、
  // useEffectとrefで自前で領域外クリックでpopover contentを閉じる処理を実装している
  // Vaul側のバグなので、アップデートで修正されてたら関連処理は削除する
  // @see（ https://github.com/emilkowalski/vaul/issues/559 ）
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // ---- 外部クリック or ESCキー押下を検知して閉じる ----
  useEffect(() => {
    if (!isPopoverOpen) return;

    function handleClickOutside(event: MouseEvent) {
      // Popover または Trigger の外をクリックした場合に閉じる
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsPopoverOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPopoverOpen]);

  const { sm } = useBreakpoints();
  const { mutate: deletePost } = useMutation({
    mutationFn: async (userId: UserId) => {
      return axios.delete(`/api/post/${postId}`, { data: { userId } });
    },
    onError: (error) => {
      toast.error("投稿を削除できませんでした");
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.infiniteList() });
      toast.success("投稿を削除しました");
      if (redirectOnDelete) {
        if (isParentModal) {
          // Intercepting Routesで表示したモーダルがrouter.pushなどで閉じれず、
          // 親モーダルのセッター変数を渡しても挙動がおかしくなるので、
          // location.hrefを直接更新している
          location.href = "/";
        }
        router.push("/");
      } else {
        router.refresh();
      }
    },
  });

  const handleEditPost = () => {
    if (isParentModal) {
      // Intercepting Routesで表示したモーダルがrouter.pushなどで閉じれず、
      // 親モーダルのセッター変数を渡しても挙動がおかしくなるので、
      // location.hrefを直接更新している
      location.href = `/edit/${postId}`;
    }
    router.push(`/edit/${postId}`);
  };

  const handleDeletePost = () => {
    deletePost(userId);
    setIsDialogOpen(false);
  };

  return (
    <div className={className}>
      <Popover open={isPopoverOpen}>
        <PopoverTrigger
          ref={triggerRef}
          onClick={() => setIsPopoverOpen((prev) => !prev)}
        >
          <RoundButton
            size={sm ? "sm" : "md"}
            icon={
              <div>
                <SVGIcon svg={MenuIcon} className="w-6 max-sm:w-4" />
              </div>
            }
            colorTheme={"white"}
            asChild
          />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto" ref={popoverRef}>
          {!isDeleteOnly && (
            <MenuItem
              menuType="button"
              isShowIcon
              iconSvg={EditIcon}
              onClick={handleEditPost}
            >
              編集
            </MenuItem>
          )}
          <MenuItem
            menuType="button"
            onClick={() => setIsDialogOpen(true)}
            isShowIcon
            iconSvg={TrashIcon}
            iconSvgColor="text-state-delete"
            className="text-state-delete hover:bg-tertialy-fleshTomato-50"
          >
            削除
          </MenuItem>
        </PopoverContent>
      </Popover>
      <Modal
        title="削除する"
        description="1度削除した投稿は元に戻すことはできません<br />削除してもよろしいでしょうか？"
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        close={() => setIsDialogOpen(false)}
        closeButtonType="outline"
        submit={handleDeletePost}
        submitButtonLabel="削除"
        submitButtonIcon={<SVGIcon svg={TrashIcon} className="w-6" />}
        submitButtonType="text"
        submitClassName="text-state-delete hover:bg-tertialy-fleshTomato-50"
      />
    </div>
  );
};

export default ButtonAction;
