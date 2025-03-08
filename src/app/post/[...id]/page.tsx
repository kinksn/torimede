import {
  getPostDetailOutputSchema,
  GetPostSelectTags,
  getUserPostsOutputSchema,
  PostId,
} from "@/app/api/post/model";
import { PostDetailPage } from "@/app/post/[...id]/PostDetailPage";
import { Mede, User } from "@prisma/client";
import { Metadata, ResolvingMetadata } from "next";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getUserMedeCountForPost } from "@/app/api/mede/[postId]/medeDao";
import { UserId } from "@/app/api/user/model";
import { DESCRIPTION } from "@/app/shared-metadata";

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

async function getPost(postId: string) {
  const post: GetPostSelectTags & { user: User; medes: Mede[] } =
    await db.post.findFirst({
      where: {
        id: postId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        images: true,
        tags: {
          select: {
            tag: true,
          },
        },
        userId: true,
        medes: true,
        user: true,
      },
    });

  const formattedPosts = {
    ...post,
    tags: post.tags.map((tagRelation) => ({
      name: tagRelation.tag.name,
      id: tagRelation.tag.id,
      userId: tagRelation.tag.userId,
    })),
  };

  return getPostDetailOutputSchema.parse(formattedPosts);
}

async function fetchUserMedeCount({
  postId,
  userId,
}: {
  postId: PostId;
  userId: UserId | undefined;
}) {
  if (!userId) {
    return 0;
  }
  const userMedeCount = await getUserMedeCountForPost({ postId, userId });
  return userMedeCount;
}

async function getPostByUserId(userId: string, postId: string) {
  const posts = await db.post.findMany({
    where: {
      userId,
      id: {
        not: postId,
      },
    },
    select: {
      id: true,
      title: true,
      content: true,
      images: true,
      tags: {
        select: {
          tag: true,
        },
      },
      userId: true,
      medes: true,
    },
  });

  const formattedPosts = posts.map((post: any) => ({
    ...post,
    tags: post.tags.map((tagRelation: any) => {
      return {
        name: tagRelation.tag.name,
        id: tagRelation.tag.id,
        userId: tagRelation.tag.userId,
      };
    }),
  }));

  return getUserPostsOutputSchema.parse(formattedPosts);
}

export default async function PostDetail({ params }: PostProps) {
  const [postId, userId] = params.id;
  const session = await auth();
  const post = await getPost(postId);
  const userPost = await getPostByUserId(userId, postId);
  // 現在ログインしているユーザーがpostで取得した投稿を何回メデたかの回数取得
  const userMedeCount = await fetchUserMedeCount({
    postId,
    userId: session?.user?.id,
  });

  return (
    <PostDetailPage
      post={post}
      userPosts={userPost}
      userMedeCount={userMedeCount}
      session={session}
    />
  );
}
