"use client";

import React, { FC } from "react";
import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Post } from "@prisma/client";

type CuteButtonProps = {
  ids: {
    postId: string;
    userId: string;
  };
};

const addCute = async ({ ids }: CuteButtonProps) => {
  const response = await axiosInstance.post(`/cute/${ids.postId}`, {
    userId: ids.userId,
  });
  return response.data;
};

const CuteButton: FC<CuteButtonProps> = ({ ids }) => {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: () => addCute({ ids }),
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
