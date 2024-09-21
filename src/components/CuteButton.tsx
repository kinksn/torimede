"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { MAX_CUTE_COUNT } from "@/app/api/cute/[postId]/model";

type CuteButtonProps = {
  ids: {
    postId: string;
    userId: string;
  };
  initialCuteCount: number;
};

type AddCuteProps = {
  ids: CuteButtonProps["ids"];
  cuteCount: number;
};

const addCute = async ({ ids, cuteCount }: AddCuteProps) => {
  const response = await axiosInstance.post(`/cute/${ids.postId}`, {
    userId: ids.userId,
    cuteCount,
  });
  return response.data;
};

const CuteButton: React.FC<CuteButtonProps> = ({ ids, initialCuteCount }) => {
  const [cuteCount, setCuteCount] = useState(initialCuteCount);
  const [tempCuteCount, setTempCuteCount] = useState(0);
  const [isClapping, setIsClapping] = useState(false);
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: () => addCute({ ids, cuteCount: tempCuteCount }),
    onSuccess: () => {
      setCuteCount(cuteCount + tempCuteCount);
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
    if (cuteCount + tempCuteCount < MAX_CUTE_COUNT) {
      setTempCuteCount((count) => count + 1);
      setIsClapping(true);
      setTimeout(() => setIsClapping(false), 300);
    }
  };

  return (
    <button onClick={handleCute} className="btn">
      Cute {cuteCount + tempCuteCount}
    </button>
  );
};

export default CuteButton;
