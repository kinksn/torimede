"use client";

import React from "react";
import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Post } from "@prisma/client";

const addCute = async (post: Post) => {
  const response = await axiosInstance.post(`/cute/${post.id}`, {
    userId: post.userId,
  });
  return response.data;
};

const CuteButton = ({ post }: { post: Post }) => {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: () => addCute(post),
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      console.error("Error adding cute:", error);
    },
  });
  return (
    <button onClick={() => mutate()} className="btn">
      Cute
    </button>
  );
};

export default CuteButton;
