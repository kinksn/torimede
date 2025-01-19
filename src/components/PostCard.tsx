import { FC } from "react";
import ButtonAction from "@/components/ButtonAction";
import { Session } from "next-auth";
import { PostId } from "@/app/api/post/model";
import { UserId } from "@/app/api/user/model";
import { ImageItem } from "@/components/basic/ImageItem";

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
    <ImageItem
      imageUrl={image}
      href={`/post/${id}/${userId}`}
      actionButton={isMyPost && <ButtonAction postId={id} userId={userId} />}
    />
  );
};

export default PostCard;
