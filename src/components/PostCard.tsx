import { FC } from "react";
import { Session } from "next-auth";
import { PostId } from "@/app/api/post/model";
import { UserId } from "@/app/api/user/model";
import { ImageItem } from "@/components/basic/ImageItem";
import * as motion from "motion/react-client";

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
      }}
    >
      <ImageItem imageUrl={image} href={`/post/${id}/${userId}`} />
    </motion.div>
  );
};

export default PostCard;
