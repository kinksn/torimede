import { PostId, PostImage as PostImageType } from "@/app/api/post/model";
import { ImageItem } from "@/components/basic/ImageItem";
import * as motion from "motion/react-client";
import { UserId } from "@/app/api/user/model";

type PostImageProps = {
  post: {
    id: PostId;
    userId: UserId;
    images: PostImageType[];
  };
  menu?: React.ReactNode;
  isAnimate?: boolean;
};

export const PostImage = ({ post, menu, isAnimate = true }: PostImageProps) => {
  const { id, userId, images } = post;

  return (
    <>
      {isAnimate ? (
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
      ) : (
        <ImageItem
          imageUrl={images[0].url}
          href={`/post/${id}/${userId}`}
          alt={images[0].alt ?? "投稿画像"}
          actionButton={menu}
        />
      )}
    </>
  );
};
