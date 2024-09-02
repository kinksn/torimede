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
    title: string;
    content?: string;
    image: string;
    tags: Tag[];
  };
};

const PostCard: FC<PostCardProps> = ({ post }) => {
  const { id, userId, title, content, image, tags } = post;

  return (
    <div className="card w-full bg-base-100 shadow-xl border">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <Image src={image} alt="" width="100" height="100" />
        <p>{content?.slice(0, 60)}</p>
        <div className="card-actions justify-end">
          {tags && tags.map((tag, index) => <PostTag tag={tag} key={index} />)}
          <div className="card-actions justify-end">
            <Link
              href={`/post/${id}/${userId}`}
              className="hover:underline"
              passHref
            >
              Read more...
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
