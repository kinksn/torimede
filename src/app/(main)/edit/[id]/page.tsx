"use client";

import BackButton from "@/components/BackButton";
import FormPost from "@/components/FormPost";
import { FormInputPost } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC } from "react";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import hash from "stable-hash";

type EditPostPageProps = {
  params: {
    id: string;
  };
};

const EditPostPage: FC<EditPostPageProps> = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const { data: dataPosts, isLoading: isLoadingPost } = useQuery({
    queryKey: ["posts", id],
    queryFn: async () => {
      const response = await axios.get(`/api/posts/${id}`);
      return response.data;
    },
  });

  const { mutate: updatePost, isPending: isLoadingSubmit } = useMutation({
    mutationFn: (newPost: FormInputPost) => {
      return axios.patch(`/api/posts/${id}`, newPost);
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });

  const handleEditPost: SubmitHandler<FormInputPost> = (newPost) => {
    // リクエストオブジェクトにuserIdを追加
    if (dataPosts?.userId) newPost.userId = dataPosts.userId;
    updatePost(newPost);
  };

  if (isLoadingPost) {
    return (
      <div className="text-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl my-4 font-bold text-center">Edit post</h1>
      <FormPost
        /**
        react-hook-formのdefaultValueは初期化時にのみ評価され、
        apiから非同期でデータ取得するなどしてinitialValueが更新されてもフォームの値が更新されないという特性がある。
        keyにハッシュ化したオブジェクトを渡すことで「深い比較（ハッシュ化関数をつかっているので）」となり、
        keyが変わるのでFormPostがアンマウント→再マウントされることで最新のデータがdefaultValueに反映される

        https://zenn.dev/kena/articles/ba26b3245c599a
      */
        key={hash(dataPosts)}
        isLoadingSubmit={isLoadingSubmit}
        submit={handleEditPost}
        initialValue={dataPosts}
        isEditing
      />
    </div>
  );
};

export default EditPostPage;
