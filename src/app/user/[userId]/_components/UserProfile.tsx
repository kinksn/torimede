"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  GetUserProfile,
  UpdateUserInput,
  userNameSchema,
} from "@/app/api/user/model";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { staticProfileIconList } from "@/lib/util/staticProfileIconList";
import { Avatar } from "@/components/basic/Avatar";
import { Button } from "@/components/basic/Button";
import { Input } from "@/components/basic/Input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PillButton } from "@/components/basic/PillButton";
import { TextButton } from "@/components/basic/TextButton";
import { useBreakpoints } from "@/hooks/useBreakpoints";

type UserProfile = {
  userProfile: GetUserProfile;
  readonly: boolean;
};

const formSchema = z.object({
  name: userNameSchema,
  image: z.string(),
});
type FormType = z.infer<typeof formSchema>;

export const UserProfile = ({ userProfile, readonly }: UserProfile) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { sm } = useBreakpoints();
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

  const form = useForm<FormType>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userProfile.name,
      image: userProfile.image,
    },
  });

  // 画像プレビュー用: RHFのwatchをそのまま使う
  const userImage = form.watch("image", userProfile.image);

  // プロフィール更新用のMutation
  const { mutate: updateProfile } = useMutation({
    mutationFn: ({ name, image }: UpdateUserInput) => {
      return axios.patch(`/api/user/${userProfile.id}`, { name, image });
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleFormSubmit = (values: UpdateUserInput) => {
    updateProfile(values);
    setIsOpen(false);
  };

  if (readonly) {
    return <ReadonlyProfile userProfile={userProfile} />;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Avatar profileImage={userImage} size={"lg"} />
      <h1 className="text-typography-xl font-bold font-zenMaruGothic">
        {userProfile.name}
      </h1>
      <Credenza open={isOpen} onOpenChange={setIsOpen}>
        <CredenzaTrigger asChild>
          <PillButton colorTheme={"secondary"} className="mt-2">
            プロフィールを編集
          </PillButton>
        </CredenzaTrigger>
        <CredenzaContent className="max-sm:gap-5 max-sm:px-10 max-sm:pb-5 max-sm:mt-0 max-sm:top-3">
          <CredenzaTitle className="max-sm:text-center max-sm:mb-1">
            プロフィールを編集
          </CredenzaTitle>
          <CredenzaBody className="max-sm:px-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="flex flex-col items-center justify-center gap-6"
              >
                <div className="flex gap-6 max-sm:gap-2 max-sm:flex-col max-sm:max-w-[296px] max-sm:w-full">
                  {/* プロフィール画像選択 */}
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center">
                        <FormControl>
                          <Popover open={isPopoverOpen}>
                            <PopoverTrigger
                              ref={triggerRef}
                              onClick={() => setIsPopoverOpen((prev) => !prev)}
                            >
                              <Avatar
                                profileImage={field.value}
                                size="lg"
                                isEditable={true}
                              />
                            </PopoverTrigger>
                            <PopoverContent
                              className="p-7 pointer-events-auto"
                              align={sm ? "center" : "start"}
                              ref={popoverRef}
                            >
                              <div className="grid grid-cols-3 gap-4 w-fit">
                                <Avatar
                                  profileImage={userProfile.oAuthProfileImage}
                                  onClick={() =>
                                    field.onChange(
                                      userProfile.oAuthProfileImage ||
                                        staticProfileIconList[0].imageURL
                                    )
                                  }
                                  size="lg"
                                  isContentActive={
                                    field.value ===
                                    userProfile.oAuthProfileImage
                                  }
                                  isHoverActive
                                />
                                {staticProfileIconList.map((icon) => {
                                  if (
                                    icon.imageURL ===
                                    userProfile.oAuthProfileImage
                                  )
                                    return;
                                  return (
                                    <Avatar
                                      key={icon.imageURL}
                                      profileImage={icon.imageURL}
                                      onClick={() =>
                                        field.onChange(icon.imageURL)
                                      }
                                      size="lg"
                                      isContentActive={
                                        field.value === icon.imageURL
                                      }
                                      isHoverActive
                                    />
                                  );
                                })}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* 表示名入力 */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Input
                        type="text"
                        label="表示名"
                        placeholder="表示名を入力してください"
                        error={!!fieldState.error}
                        {...field}
                      />
                    )}
                  />
                </div>
                <CredenzaFooter className="gap-2 justify-end w-full max-sm:p-0 max-sm:flex-row max-sm:max-w-[296px] max-sm:w-full">
                  <CredenzaClose asChild>
                    <TextButton type="button">キャンセル</TextButton>
                  </CredenzaClose>
                  <Button type="submit" className="btn">
                    保存
                  </Button>
                </CredenzaFooter>
              </form>
            </Form>
          </CredenzaBody>
        </CredenzaContent>
      </Credenza>
    </div>
  );
};

const ReadonlyProfile = ({ userProfile }: { userProfile: GetUserProfile }) => {
  return (
    <div className="flex items-center justify-center flex-col">
      <Avatar profileImage={userProfile.image} size={"lg"} />
      <h1 className="text-typography-xl font-bold font-zenMaruGothic">
        {userProfile.name}
      </h1>
    </div>
  );
};
