import Link from "next/link";
import Image from "next/image";
import { FC } from "react";
import ButtonAction from "@/components/ButtonAction";
import { Session } from "next-auth";
import { PostId } from "@/app/api/post/model";
import { UserId } from "@/app/api/user/model";

type PostCardProps = {
  post: {
    id: PostId;
    userId: UserId;
    image: string;
  };
  session: Session | null;
};

const PostCard: FC<PostCardProps> = ({ post, session }) => {
  const { id, userId, image } = post;

  const isMyPost = session?.user?.id === userId;

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        {isMyPost && <ButtonAction postId={id} userId={userId} />}
      </div>
      <Link
        href={`/post/${id}/${userId}`}
        passHref
        className="card w-full bg-base-100 shadow-xl border block overflow-hidden"
        scroll={false}
      >
        <div className="card-body p-0">
          <div className="card-actions justify-center">
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
    </div>
  );
};

export default PostCard;
