"use client";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { GetUserProfile } from "@/app/api/user/model";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

type UserProfile = {
  userProfile: GetUserProfile;
  readonly: boolean;
};

const formSchema = z.object({
  name: z
    .string()
    .min(1, "1文字以上入力してください")
    .max(15, "15文字以内で入力してください"),
});

export const UserProfile = ({ userProfile, readonly }: UserProfile) => {
  const [isEdit, setIsEdit] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>({
    defaultValues: userProfile ? { name: userProfile.name } : { name: "" },
    resolver: zodResolver(formSchema),
  });
  const { mutate: updateProfile } = useMutation({
    mutationFn: ({ name }: { name: string }) => {
      return axios.patch(`/api/user/${userProfile.id}`, { name });
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleFormSubmit: SubmitHandler<{ name: string }> = (name) => {
    updateProfile(name);
    setIsEdit(false);
  };

  if (readonly) {
    return <ReadonlyProfile userProfile={userProfile} />;
  }

  return (
    <div>
      <div className="avatar">
        <div className="w-24 rounded-full">
          <Image src={userProfile.image} alt="" width="24" height="24" />
        </div>
      </div>
      <h1 className="h1">{userProfile.name}</h1>

      {isEdit ? (
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
      ) : (
        <button className="btn" onClick={() => setIsEdit(true)}>
          編集
        </button>
      )}
    </div>
  );
};

const ReadonlyProfile = ({ userProfile }: { userProfile: GetUserProfile }) => {
  return (
    <>
      <div className="avatar">
        <div className="w-24 rounded-full">
          <Image src={userProfile.image} alt="" width="24" height="24" />
        </div>
      </div>
      <h1 className="h1">{userProfile.name}</h1>
    </>
  );
};
