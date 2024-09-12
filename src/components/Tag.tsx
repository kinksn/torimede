"use client";

import { X } from "lucide-react";
import { FC } from "react";
import type { Tag } from "@prisma/client";
import { useDeleteTag } from "@/hooks/useTags";
import Link from "next/link";
import { Session } from "next-auth";

type PostTagProps = {
  tag: Tag;
  session: Session | null;
};

export const PostTag: FC<PostTagProps> = ({ tag, session }) => {
  const { id, name } = tag;
  const { mutate: deleteTag } = useDeleteTag();

  const isAdmin = session?.user?.isAdmin;

  console.log("isAdmin = ", isAdmin);

  return (
    <span className="badge badge-neutral flex px-2 py-3">
      <Link href={`/post?tag=${name}`}>{name}</Link>
      {isAdmin && (
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
