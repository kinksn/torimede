"use client";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  GetUserProfile,
  UpdateUserInput,
  userNameSchema,
} from "@/app/api/user/model";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { staticProfileIconList } from "@/lib/util/staticProfileIconList";

type UserProfile = {
  userProfile: GetUserProfile;
  readonly: boolean;
};

const formSchema = z.object({
  name: userNameSchema,
  image: z.string(),
});
type Form = z.infer<typeof formSchema>;

export const UserProfile = ({ userProfile, readonly }: UserProfile) => {
  const [isEdit, setIsEdit] = useState(false);
  const router = useRouter();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: { name: userProfile.name, image: userProfile.image },
    resolver: zodResolver(formSchema),
  });

  const userImage = watch("image", userProfile.image);

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

  const handleFormSubmit: SubmitHandler<UpdateUserInput> = ({
    name,
    image,
  }) => {
    updateProfile({ name, image });
    setIsEdit(false);
  };

  if (readonly) {
    return <ReadonlyProfile userProfile={userProfile} />;
  }

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="avatar">
          <div className="w-24 rounded-full">
            <Image src={userImage} alt="" width="96" height="96" />
          </div>
        </div>
      </div>
      {!isEdit && <h1 className="h1">{userProfile.name}</h1>}

      {isEdit ? (
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col items-center justify-center gap-5 mt-10"
        >
          <select
            className="select select-bordered w-full max-w-xs"
            {...register("image")}
          >
            <option
              value={
                userProfile.oAuthProfileImage ||
                staticProfileIconList[0].imageURL
              }
            >
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
          <div className="flex gap-2">
            <button onClick={() => setIsEdit(false)} className="btn">
              キャンセル
            </button>
            <button type="submit" className="btn">
              保存
            </button>
          </div>
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
    <div className="flex items-center justify-center flex-col gap-2">
      <div className="avatar">
        <div className="w-24 rounded-full">
          <Image src={userProfile.image} alt="" width="24" height="24" />
        </div>
      </div>
      <h1 className="h1">{userProfile.name}</h1>
    </div>
  );
};
