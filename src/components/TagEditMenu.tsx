"use client";

import axios from "axios";
import MenuIcon from "@/components/assets/icon/menu.svg";
import TrashIcon from "@/components/assets/icon/trash.svg";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/basic/Input";
import { RoundButton } from "@/components/basic/RoundButton";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { TextButton } from "@/components/basic/TextButton";
import { Button } from "@/components/basic/Button";
import { Form, FormField } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { Tag } from "@/app/api/tag/model";
import { tagUpdateInputSchema } from "@/app/api/tag/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Modal } from "@/components/basic/Modal";

type TagEditMenuProps = {
  tag: Tag;
};

export const TagEditMenu = ({ tag }: TagEditMenuProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const router = useRouter();

  const { mutate: updateTag } = useMutation({
    mutationFn: (newPost: Tag) => {
      return axios.patch("/api/tag", { ...newPost, id: tag.id });
    },
    onError: (error) => {
      toast.error("タグの更新に失敗しました");
      console.error(error);
    },
    onSuccess: async () => {
      toast.success("タグを更新しました");
      setIsPopoverOpen(false);
      router.refresh();
    },
  });

  const { mutate: deleteTag } = useMutation({
    mutationFn: () => {
      return axios.delete(`/api/tag/${tag.id}`);
    },
    onError: (error) => {
      toast.error("タグの削除に失敗しました");
      console.error(error);
    },
    onSuccess: async () => {
      toast.success("タグを削除しました");
      setIsDialogOpen(false);
      setIsPopoverOpen(false);
      router.refresh();
    },
  });

  const form = useForm<Tag>({
    mode: "onChange",
    resolver: zodResolver(tagUpdateInputSchema),
    defaultValues: tag,
  });

  const handleSubmit: SubmitHandler<Tag> = async (data) => {
    updateTag(data);
  };

  const handleDeleteTag = async () => {
    deleteTag();
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger>
        <RoundButton
          icon={
            <div>
              <SVGIcon svg={MenuIcon} className="w-3" />
            </div>
          }
          type="button"
          size={"xs"}
          colorTheme="white"
          isActive={isPopoverOpen}
          asChild
        />
      </PopoverTrigger>
      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(handleSubmit)(e);
            }}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  label="タグ名を編集"
                  placeholder="Post title..."
                  size={"sm"}
                  className="w-full p-2"
                  error={!!fieldState.error}
                  {...field}
                />
              )}
            />
            <div className="flex justify-end gap-1 w-full px-2 pb-[6px]">
              <TextButton
                size={"sm"}
                colorTheme={"red"}
                icon={<SVGIcon svg={TrashIcon} className="w-4" />}
                onClick={() => setIsDialogOpen(true)}
              >
                削除
              </TextButton>
              <Button
                type="submit"
                size={"sm"}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "保存中" : "保存"}
              </Button>
            </div>
          </form>
        </Form>
        <Modal
          title="タグを削除する"
          description="削除してもよろしいでしょうか？"
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          close={() => setIsDialogOpen(false)}
          submit={handleDeleteTag}
          submitButtonLabel="削除"
          submitButtonIcon={<SVGIcon svg={TrashIcon} className="w-6" />}
          submitButtonType="text"
          submitClassName="text-state-delete hover:bg-tertialy-fleshTomato-50"
        />
      </PopoverContent>
    </Popover>
  );
};
