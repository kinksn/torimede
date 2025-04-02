"use client";

import { FormInputPost } from "@/app/api/_common/model/form";
import { PostForm } from "@/components/PostForm";
import { postKeys } from "@/service/post/key";
import { Tag } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

type CreatePostPageProps = {
  tags: Tag[];
  session: Session | null;
};

const CreatePostPage = ({ tags, session }: CreatePostPageProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleCreatePost: SubmitHandler<FormInputPost> = (data) => {
    createPost(data);
  };

  const { mutate: createPost, isPending: isLoadingSubmit } = useMutation({
    mutationFn: (newPost: FormInputPost) => {
      return axios.post("/api/post/create", newPost);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message || "投稿できませんでした";
      toast.error(errorMessage);
      console.error(error);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: postKeys.infiniteList(),
        refetchType: "inactive",
      });
      toast.success("投稿しました");
      router.push("/");
    },
  });

  return (
    <div className="max-w-[420px] w-[inherit] mx-auto">
      <h1 className="text-2xl font-bold text-center mb-5 font-zenMaruGothic">
        新規投稿
      </h1>
      <PostForm
        isSubmitPending={isLoadingSubmit}
        submit={handleCreatePost}
        session={session}
        tags={tags}
      />
    </div>
  );
};

export default CreatePostPage;
