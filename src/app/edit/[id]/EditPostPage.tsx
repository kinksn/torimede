"use client";

import FormPost from "@/components/FormPost";
import { FormInputPost } from "@/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FC } from "react";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import hash from "stable-hash";
import { GetPostDetailOutput } from "@/app/api/post/model";
import { Tag } from "@prisma/client";
import { Session } from "next-auth";
import { toast } from "sonner";

type EditPostPageProps = {
  post: GetPostDetailOutput;
  tags: Tag[];
  session: Session | null;
};

const EditPostPage: FC<EditPostPageProps> = ({ post, tags, session }) => {
  const router = useRouter();

  const { mutate: updatePost, isPending: isLoadingSubmit } = useMutation({
    mutationFn: (newPost: FormInputPost) => {
      return axios.patch(`/api/post/${post.id}`, newPost);
    },
    onError: (error) => {
      toast.error("投稿を編集できませんでした");
      console.error(error);
    },
    onSuccess: () => {
      toast.success("投稿を編集しました");
      router.push(`/post/${post.id}/${post.userId}`);
      router.refresh();
    },
  });

  const handleEditPost: SubmitHandler<FormInputPost> = (post) => {
    updatePost(post);
  };

  return (
    <div className="max-w-[420px] w-[inherit] mx-auto">
      <h1 className="text-2xl font-bold text-center mb-5 font-zenMaruGothic">
        編集
      </h1>
      <FormPost
        /**
          react-hook-formのdefaultValueは初期化時にのみ評価され、
          apiから非同期でデータ取得するなどしてinitialValueが更新されてもフォームの値が更新されないという特性がある。
          keyにハッシュ化したオブジェクトを渡すことで「深い比較（ハッシュ化関数をつかっているので）」となり、
          keyが変わるのでFormPostがアンマウント→再マウントされることで最新のデータがdefaultValueに反映される。

          https://zenn.dev/kena/articles/ba26b3245c599a
        */
        key={hash(post)}
        isSubmitPending={isLoadingSubmit}
        submit={handleEditPost}
        initialValue={post}
        session={session}
        tags={tags}
        type="edit"
      />
    </div>
  );
};

export default EditPostPage;
