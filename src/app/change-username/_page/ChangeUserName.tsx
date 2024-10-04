"use client";

import { UpdateUserInput, userNameSchema } from "@/app/api/user/model";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Session } from "next-auth";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { staticProfileIconList } from "@/lib/util/staticProfileIconList";
import Image from "next/image";

type ChangeUserNameProps = {
  session: Session | null;
};

const formSchema = z.object({
  name: userNameSchema,
  image: z.string(),
});
type Form = z.infer<typeof formSchema>;

export const ChangeUserName = ({ session }: ChangeUserNameProps) => {
  const userId = session?.user?.id;
  const userName = session?.user?.name || "";
  const defaultUserImage =
    session?.user?.image || staticProfileIconList[0].imageURL;
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: { name: userName, image: defaultUserImage },
    resolver: zodResolver(formSchema),
  });

  // 連携先のサービスでアイコン画像を設定してない場合デフォルトアイコン画像を設定
  const userImage = watch("image", defaultUserImage);

  const checkFirstLogin = async () => {
    try {
      const token = await axios.get("/api/auth/session"); // セッションの再取得
      if (token.data.user.isFirstLogin === false) {
        // TODO: 本番環境でrouter.push()でもいけるか調べる
        location.href = "/";
      } else {
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
        isFirstLogin: isFirstLogin ? isFirstLogin : false,
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
    <div>
      <div className="flex items-center justify-center">
        <div className="avatar">
          <div className="w-24 rounded-full">
            <Image src={userImage} alt="" width="96" height="96" />
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col items-center justify-center gap-5 mt-10"
      >
        <select
          className="select select-bordered w-full max-w-xs"
          {...register("image")}
        >
          <option value={session?.user?.oAuthProfileImage || ""}>
            default
          </option>
          {staticProfileIconList.map((icon, index) => {
            return (
              <option key={`${icon.name}-${index}`} value={icon.imageURL}>
                {icon.name}
              </option>
            );
          })}
        </select>
        <input
          type="text"
          {...register("name", { required: true })}
          className="input input-bordered w-full max-w-lg"
        />
        {errors.name && (
          <p className="text-red-500 text-left w-full max-w-lg text-xs ml-1">
            {errors.name.message}
          </p>
        )}
        <button type="submit" className="btn">
          保存
        </button>
      </form>
      <button className="btn" onClick={handleSkip}>
        スキップ
      </button>
    </div>
  );
};
