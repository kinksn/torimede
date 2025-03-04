import { FC } from "react";
import { PostId, PostImage } from "@/app/api/post/model";
import { ImageItem } from "@/components/basic/ImageItem";
import * as motion from "motion/react-client";
import { UserId } from "@/app/api/user/model";

type PostCardProps = {
  post: {
    id: PostId;
    userId: UserId;
    images: PostImage[];
  };
  menu?: React.ReactNode;
};

const PostCard: FC<PostCardProps> = ({ post, menu }) => {
  const { id, userId, images } = post;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
      }}
    >
      <ImageItem
        imageUrl={images[0].url}
        href={`/post/${id}/${userId}`}
        alt={images[0].alt ?? "投稿画像"}
        actionButton={menu}
      />
    </motion.div>
  );
};

export default PostCard;
