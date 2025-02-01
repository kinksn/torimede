import {
  getPostDetailOutputSchema,
  GetPostSelectTags,
  getUserPostsOutputSchema,
  PostId,
} from "@/app/api/post/model";
import { PostDetailPage } from "@/app/post/[...id]/PostDetailPage";
import { Cute, User } from "@prisma/client";
import { Metadata, ResolvingMetadata } from "next";
import { db } from "@/lib/db";
import { UserId } from "@/app/api/user/model";
import { getAuthSession } from "@/lib/auth";

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

export async function generateMetadata(
  { params }: PostProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const [postId] = params.id;
  const post = await getPost(postId);

  const ogParams: OgParams[] = [
    { param: "title", value: post.title },
    { param: "image", value: post.image },
    { param: "userName", value: post.user.name },
  ];

  const ogImage = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/og${ogParamsGenerate(ogParams)}`
  );

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post.title,
    openGraph: {
      images: [ogImage, ...previousImages],
    },
  };
}

async function getPost(postId: string) {
  const post: GetPostSelectTags & { user: User; cutes: Cute[] } =
    await db.post.findFirst({
      where: {
        id: postId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        tags: {
          select: {
            tag: true,
          },
        },
        userId: true,
        cutes: true,
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
      image: true,
      tags: {
        select: {
          tag: true,
        },
      },
      userId: true,
      cutes: true,
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
  const session = await getAuthSession();
  const post = await getPost(postId);
  const userPost = await getPostByUserId(userId, postId);
  return <PostDetailPage post={post} userPosts={userPost} session={session} />;
}
