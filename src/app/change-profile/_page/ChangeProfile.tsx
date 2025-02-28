"use client";

import axios from "axios";
import { UpdateUserInput, userNameSchema } from "@/app/api/user/model";
import { useMutation } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { staticProfileIconList } from "@/lib/util/staticProfileIconList";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { Avatar } from "@/components/basic/Avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/basic/Input";
import { TextButton } from "@/components/basic/TextButton";
import { Button } from "@/components/basic/Button";
import { useSession } from "next-auth/react";

type ChangeProfileProps = {
  session: Session | null;
};

const formSchema = z.object({
  name: userNameSchema,
  image: z.string(),
});
type Form = z.infer<typeof formSchema>;

export const ChangeProfile = ({ session }: ChangeProfileProps) => {
  const { data, update } = useSession();
  const userId = session?.user?.id;
  const userName = session?.user?.name || "";
  const defaultUserImage =
    session?.user?.image || staticProfileIconList[0].imageURL;
  const { sm } = useBreakpoints();
  const form = useForm<Form>({
    defaultValues: { name: userName, image: defaultUserImage },
    resolver: zodResolver(formSchema),
  });

  const checkFirstLogin = async () => {
    try {
      const updatedSession = await update({ forceRefresh: Date.now() });
      if (updatedSession?.user?.isFirstLogin === false) {
        // TODO: 本番環境でrouter.push()でもいけるか調べる
        location.href = "/";
      } else {
        await update();
        // 状態が更新されるまでポーリング
        setTimeout(checkFirstLogin, 500); // 0.5秒後に再確認
      }
    } catch (error) {
      console.error("failt to get session:", error);
    }
  };

  const { mutate: updateProfile } = useMutation({
    mutationFn: ({ name, image, isFirstLogin }: UpdateUserInput) => {
      return axios.patch(`/api/user/${userId}`, {
        name,
        image,
        isFirstLogin,
      });
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: async () => {
      checkFirstLogin();
    },
  });

  const handleFormSubmit: SubmitHandler<
    Omit<UpdateUserInput, "isFirstLogin">
  > = async ({ name, image }) => {
    updateProfile({ name, image, isFirstLogin: false });
  };

  const handleSkip = () => {
    updateProfile({ isFirstLogin: false });
  };

  return (
    <div className="flex flex-col justify-center items-center max-w-[460px] mx-auto h-full max-sm:h-auto px-5 pt-20 max-sm:pt-10 pb-10 max-sm:pb-5">
      <div>
        <h1 className="text-typography-xxxl max-sm:text-typography-xxl max-sm:font-bold text-center text-primary-700 font-zenMaruGothic font-bold">
          トリメデにようこそ！
        </h1>
        <p className="text-center max-sm:text-left">
          トリメデの中で表示する
          <br className="max-sm:hidden" />
          アイコンと表示名を変更することができます
        </p>
        <small className="block text-center font-bold mt-1">
          （<span className="text-primary-700">*</span>
          マイページからいつでも変更できます）
        </small>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-5 items-center justify-center bg-white rounded-20 mt-5 w-full pt-10 px-10 pb-5"
        >
          <div className="flex gap-6 w-full max-sm:gap-2 max-sm:flex-col">
            {/* プロフィール画像選択 */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormControl>
                    <Popover>
                      <PopoverTrigger aria-label="アイコンを選択">
                        <Avatar
                          profileImage={field.value}
                          size="lg"
                          isEditable={true}
                        />
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-7 pointer-events-auto"
                        align={sm ? "center" : "start"}
                        aria-label="アイコンの選択オプション"
                      >
                        <div className="grid grid-cols-3 gap-4 w-fit">
                          <Avatar
                            profileImage={session?.user?.oAuthProfileImage}
                            onClick={() =>
                              field.onChange(
                                session?.user?.oAuthProfileImage ||
                                  staticProfileIconList[0].imageURL
                              )
                            }
                            size="lg"
                            isContentActive={
                              field.value === session?.user?.oAuthProfileImage
                            }
                            isHoverActive
                          />
                          {staticProfileIconList.map((icon) => {
                            if (
                              icon.imageURL === session?.user?.oAuthProfileImage
                            )
                              return;
                            return (
                              <Avatar
                                key={icon.imageURL}
                                profileImage={icon.imageURL}
                                onClick={() => field.onChange(icon.imageURL)}
                                size="lg"
                                isContentActive={field.value === icon.imageURL}
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
                  className="w-[inherit]"
                  {...field}
                />
              )}
            />
          </div>
          <footer className="flex gap-2 justify-end w-full max-sm:p-0 max-sm:flex-row max-sm:max-w-[296px] max-sm:w-full">
            <TextButton type="button" className="btn" onClick={handleSkip}>
              スキップ
            </TextButton>
            <Button type="submit" className="btn">
              保存
            </Button>
          </footer>
        </form>
      </Form>
    </div>
  );
};
