import { PostId } from "@/app/api/post/model";
import { PostDetailPage } from "@/app/post/[...id]/PostDetailPage";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { UserId } from "@/app/api/user/model";
import { DESCRIPTION } from "@/app/shared-metadata";
import { getPost, getPostByUserId, getUserMedeCount } from "@/lib/fetcher/post";
import { notFound } from "next/navigation";

type PostProps = {
  params: {
    id: [postId: PostId, userId: UserId];
  };
};

type OgParams = {
  param: string;
  value: string;
};

const ogParamsGenerate = (params: OgParams[]) => {
  const result = params.map((item, index) => {
    const isFirstElement = index === 0;
    const isLastElement = index === params.length - 1;
    if (isLastElement) {
      return `${item.param}=${item.value}`;
    } else {
      return `${isFirstElement ? "?" : ""}${item.param}=${item.value}&`;
    }
  });

  return result.join("");
};

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  // read route params
  const [postId] = params.id;
  const post = await getPost(postId);

  if (post == null) {
    return {
      title: "投稿が見つかりませんでした",
    };
  }

  const ogParams: OgParams[] = [
    { param: "title", value: post.title },
    { param: "image", value: post.images[0].url },
    { param: "userName", value: post.user.name },
  ];

  const ogImage = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/og${ogParamsGenerate(ogParams)}`
  );

  return {
    title: post.title,
    description: post.content || DESCRIPTION.common,
    openGraph: {
      images: [ogImage],
    },
  };
}

export default async function PostDetail({ params }: PostProps) {
  const [postId, userId] = params.id;
  const session = await auth();
  const post = await getPost(postId);
  const userPost = await getPostByUserId(userId, postId);
  // 現在ログインしているユーザーがpostで取得した投稿を何回メデたかの回数取得
  const userMedeCount = await getUserMedeCount({
    postId,
    userId: session?.user?.id,
  });

  if (post == null) {
    notFound();
  }

  return (
    <PostDetailPage
      post={post}
      userPosts={userPost}
      userMedeCount={userMedeCount}
      session={session}
    />
  );
}
