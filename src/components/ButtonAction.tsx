"use client";

import axios from "axios";
import MenuIcon from "@/components/assets/icon/menu.svg";
import TrashIcon from "@/components/assets/icon/trash.svg";
import EditIcon from "@/components/assets/icon/edit.svg";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { postKeys } from "@/service/post/key";
import { PostId } from "@/app/api/post/model";
import { UserId } from "@/app/api/user/model";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MenuItem } from "@/components/basic/MenuItem";
import { Button } from "@/components/basic/Button";
import { TextButton } from "@/components/basic/TextButton";
import { RoundButton } from "@/components/basic/RoundButton";
import { toast } from "sonner";

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
      <Popover>
        <PopoverTrigger>
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
        <PopoverContent align="end" className="w-auto">
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="hidden" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>削除する</DialogTitle>
            <DialogDescription>
              1度削除した投稿は元に戻すことはできません
              <br className="max-sm:hidden" />
              削除してもよろしいでしょうか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-1">
            <Button colorTheme="outline" onClick={() => setIsDialogOpen(false)}>
              キャンセル
            </Button>
            <TextButton
              colorTheme="red"
              icon={<SVGIcon svg={TrashIcon} className="w-6" />}
              onClick={handleDeletePost}
            >
              削除
            </TextButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ButtonAction;
