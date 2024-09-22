"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  CreateCuteOutput,
  MAX_CUTE_COUNT,
} from "@/app/api/cute/[postId]/model";

type CuteButtonProps = {
  ids: {
    postId: string;
    userId: string;
  };
};

type AddCuteProps = {
  ids: CuteButtonProps["ids"];
  cuteCount: number;
};

const addCute = async ({ ids, cuteCount }: AddCuteProps) => {
  const response = await axiosInstance.post<CreateCuteOutput>(
    `/cute/${ids.postId}`,
    {
      userId: ids.userId,
      cuteCount,
    }
  );
  return response.data;
};

const CuteButton: React.FC<CuteButtonProps> = ({ ids }) => {
  const [userCuteCount, setUserCuteCount] = useState(0);
  const [tempCuteCount, setTempCuteCount] = useState(0);
  const [isClapping, setIsClapping] = useState(false);
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: () => addCute({ ids, cuteCount: tempCuteCount }),
    onSuccess: (data) => {
      setUserCuteCount(data.totalCuteCount);
      setTempCuteCount(0);
      router.refresh();
    },
    onError: (error) => {
      console.error("Error adding cute:", error);
    },
  });

  useEffect(() => {
    if (isClapping) return;
    const timeoutId = setTimeout(() => {
      if (tempCuteCount > 0) {
        mutate();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [isClapping, tempCuteCount, mutate]);

  const handleCute = () => {
    if (userCuteCount + tempCuteCount < MAX_CUTE_COUNT) {
      setTempCuteCount((count) => count + 1);
      setIsClapping(true);
      setTimeout(() => setIsClapping(false), 300);
    }
  };

  return (
    <button onClick={handleCute} className="btn">
      Cute {userCuteCount + tempCuteCount}
    </button>
  );
};

export default CuteButton;
