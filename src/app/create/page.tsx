"use client";

import BackButton from "@/components/BackButton";
import FormPost from "@/components/FormPost";
import { postKeys } from "@/service/post/key";
import { FormInputPost } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";

const CreatePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleCreatePost: SubmitHandler<FormInputPost> = (data) => {
    createPost(data);
  };

  const { mutate: createPost, isPending: isLoadingSubmit } = useMutation({
    mutationFn: (newPost: FormInputPost) => {
      return axios.post("/api/post/create", newPost);
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: postKeys.infiniteList(),
        refetchType: "inactive",
      });
      router.push("/");
    },
  });

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl my-4 font-bold text-center">Add new post</h1>
      <FormPost
        isLoadingSubmit={isLoadingSubmit}
        submit={handleCreatePost}
        isEditing={false}
      />
    </div>
  );
};

export default CreatePage;
