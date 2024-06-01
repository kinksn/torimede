"use client";

import { default as PostTag } from "@/components/Tag";
import { Tag } from "@prisma/client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";

type PostCardProps = {
  post: {
    id: string;
    title: string;
    content: string;
    tag?: Tag;
  };
};

const PostCard: FC<PostCardProps> = ({ post }) => {
  const { id, title, content, tag } = post;
  const { data, status } = useSession();
  console.log("data = " + JSON.stringify(data));
  console.log("status = " + status);

  return (
    <div className="card w-full bg-base-100 shadow-xl border">
      <button onClick={() => signIn("google")}>google</button>
      <button onClick={() => signOut()}>signout</button>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{content.slice(0, 60)}</p>
        <div className="card-actions justify-end">
          {tag && <PostTag tag={tag} />}
          <div className="card-actions justify-end">
            <Link href={`/blog/${id}`} className="hover:underline">
              Read more...
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
