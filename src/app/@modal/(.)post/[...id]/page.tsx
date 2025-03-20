import { FC } from "react";
import { PostId } from "@/app/api/post/model";
import { UserId } from "@/app/api/user/model";
import { auth } from "@/lib/auth";
import ModalPostDetailPage from "@/app/@modal/(.)post/[...id]/ModalPostDetailPage";
import { getUserMedeCount, getPost, getPostByUserId } from "@/lib/fetcher/post";

type PostProps = {
  params: {
    id: [postId: PostId, userId: UserId];
  };
};

const PostDetail: FC<PostProps> = async ({ params }) => {
  const [postId, userId] = params.id;
  const session = await auth();
  const post = await getPost(postId);
  const userPost = await getPostByUserId(userId, postId);
  // 現在ログインしているユーザーがpostで取得した投稿を何回メデたかの回数取得
  const userMedeCount = await getUserMedeCount({
    postId,
    userId: session?.user?.id,
  });

  return (
    <ModalPostDetailPage
      post={post}
      userPosts={userPost}
      userMedeCount={userMedeCount}
      session={session}
    />
  );
};

export default PostDetail;
