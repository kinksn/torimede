"use client";

import { X } from "lucide-react";
import { FC } from "react";
import { Tag } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type TagProps = {
  tag: Tag;
  isEdit?: boolean;
};

const Tag: FC<TagProps> = ({ tag, isEdit = false }) => {
  const { id, name } = tag;
  const router = useRouter();
  const { mutate: deleteTag } = useMutation({
    mutationFn: async () => {
      return axios.delete(`/api/tags/${id}`);
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      console.log("tag is deleted");
      router.refresh();
    },
  });

  return (
    <span className="badge badge-neutral">
      {name}
      {isEdit && (
        <button className="btn btn-circle" onClick={() => deleteTag()}>
          <X />
        </button>
      )}
    </span>
  );
};

export default Tag;
