"use client";

import { default as PostTag } from "@/components/Tag";
import { Tag } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { FC } from "react";

type PostCardProps = {
  post: {
    id: string;
    userId: string;
    image: string;
    title?: string;
    content?: string;
    tags?: Tag[];
  };
};

const PostCard: FC<PostCardProps> = ({ post }) => {
  const { id, userId, image } = post;

  return (
    <Link
      href={`/post/${id}/${userId}`}
      passHref
      className="card w-full bg-base-100 shadow-xl border block overflow-hidden"
      scroll={false}
    >
      <div className="card-body p-0">
        <div className="card-actions justify-end">
          <Image
            src={image}
            alt=""
            width="200"
            height="200"
            className="w-auto h-auto"
          />
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
