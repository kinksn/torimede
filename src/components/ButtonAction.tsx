"use client";

import axios from "axios";
import MenuIcon from "@/components/assets/icon/menu.svg";
import TrashIcon from "@/components/assets/icon/trash.svg";
import EditIcon from "@/components/assets/icon/edit.svg";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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

type ButtonActionProps = {
  postId: PostId;
  userId: UserId;
};

const ButtonAction = ({ postId, userId }: ButtonActionProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate: deletePost } = useMutation({
    mutationFn: async (userId: UserId) => {
      return axios.delete(`/api/post/${postId}`, { data: { userId } });
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.infiniteList() });
      router.push("/");
    },
  });

  const handleDeletePost = () => {
    deletePost(userId);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <RoundButton
            icon={<SVGIcon svg={MenuIcon} className="w-6" />}
            colorTheme={"white"}
          />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto">
          <MenuItem
            menuType="button"
            isShowIcon
            isLink
            iconSvg={EditIcon}
            href={`/edit/${postId}`}
          >
            編集
          </MenuItem>
          <MenuItem
            menuType="button"
            onClick={() => setIsDialogOpen(true)}
            isShowIcon
            iconSvg={TrashIcon}
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
    </>
  );
};

export default ButtonAction;
