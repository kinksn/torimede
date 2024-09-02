"use client";

import { X } from "lucide-react";
import { FC } from "react";
import type { Tag } from "@prisma/client";
import { useDeleteTag } from "@/hooks/useTags";
import Link from "next/link";

type TagProps = {
  tag: Tag;
  isEdit?: boolean;
};

const Tag: FC<TagProps> = ({ tag, isEdit = false }) => {
  const { id, name } = tag;
  const { mutate: deleteTag } = useDeleteTag();

  return (
    <span className="badge badge-neutral flex px-2 py-3">
      <Link href={`/post?tag=${name}`}>{name}</Link>
      {isEdit && (
        <button
          className="btn btn-circle w-4 h-4 min-h-4 flex items-center justify-center ml-3"
          style={{
            position: "relative",
            right: "-2px",
          }}
          onClick={() => deleteTag(id)}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export default Tag;
