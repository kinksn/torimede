"use client";

import { UpdateUserInput } from "@/app/api/user/model";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Session } from "next-auth";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

type ChangeUserNameProps = {
  session: Session | null;
};

const formSchema = z.object({
  name: z
    .string()
    .min(1, "1文字以上入力してください")
    .max(15, "15文字以内で入力してください"),
});

export const ChangeUserName = ({ session }: ChangeUserNameProps) => {
  const router = useRouter();
  const userId = session?.user?.id;
  const userName = session?.user?.name;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>({
    defaultValues: userName ? { name: userName } : { name: "" },
    resolver: zodResolver(formSchema),
  });

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
    mutationFn: ({ name, isFirstLogin }: UpdateUserInput) => {
      return axios.patch(`/api/user/${userId}`, {
        name,
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
    Pick<UpdateUserInput, "name">
  > = async ({ name }) => {
    updateProfile({ name });
  };

  const handleSkip = () => {
    updateProfile({ isFirstLogin: false });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col items-center justify-center gap-5 mt-10"
      >
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
