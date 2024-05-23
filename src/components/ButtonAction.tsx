"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Pen, Trash } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { useRouter } from "next/navigation";

type ButtonActionProps = {
  id: string;
};

const ButtonAction: FC<ButtonActionProps> = ({ id }) => {
  const router = useRouter();
  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: async () => {
      return axios.delete(`/api/posts/${id}`);
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });

  return (
    <div>
      <Link href={`/edit/${id}`} className="btn mr-2">
        <Pen />
        Edit
      </Link>
      <button onClick={() => deletePost()} className="btn btn-error">
        {isPending ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <Trash />
        )}
        Delete
      </button>
    </div>
  );
};

export default ButtonAction;
