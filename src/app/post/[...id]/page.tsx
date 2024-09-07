import BackButton from "@/components/BackButton";
import ButtonAction from "@/components/ButtonAction";
import { db } from "@/lib/db";
import { default as PostTag } from "@/components/Tag";
import { FC } from "react";
import { getAuthSession } from "@/lib/auth";
import Image from "next/image";
import CuteButton from "@/components/CuteButton";
import PostCard from "@/components/PostCard";
import { ShareButtons } from "@/components/ShareButtons";
import { UrlCopyButton } from "@/components/UrlCopyButton";
import type { Metadata, ResolvingMetadata } from "next";
import { GetPostOutput, GetPostSelectTags } from "@/app/api/post/model";
import { Cute, User } from "@prisma/client";
import Link from "next/link";

type PostProps = {
  params: {
    id: [postId: string, userId: string];
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
            tag: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
        userId: true,
        cutes: true,
        user: true,
      },
    });

  const formattedPosts = {
    ...post,
    tags: post.tags.map((tagRelation: any) => {
      return {
        name: tagRelation.tag.name,
        id: tagRelation.tag.id,
      };
    }),
  };

  return formattedPosts;
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
          tag: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
      userId: true,
      cutes: true,
    },
  });

  const formattedPosts: GetPostOutput[] = posts.map((post: any) => ({
    ...post,
    tags: post.tags.map((tagRelation: any) => {
      return {
        name: tagRelation.tag.name,
        id: tagRelation.tag.id,
      };
    }),
  }));

  return formattedPosts;
}

const BlogDetailPage: FC<PostProps> = async ({ params }) => {
  const [postId, userId] = params.id;
  const post = await getPost(postId);
  const userPost = await getPostByUserId(userId, postId);
  const session = await getAuthSession();
  const { name: userName, image: userProfileImage } = post.user;

  return (
    <div>
      <BackButton />
      <div className="mb-8">
        <h2 className="text-2xl font-bold my-4">{post?.title}</h2>
        {post.userId === session?.user?.id && (
          <ButtonAction id={postId} userId={post.userId} />
        )}
        {post.userId !== session?.user?.id && session !== null && (
          <>
            <CuteButton
              ids={{
                postId: post.id,
                userId: post.userId,
              }}
            />
            <span>{post.cutes.length}</span>
          </>
        )}
      </div>
      {post?.image && (
        <Image src={post.image} alt="" width="100" height="100" />
      )}
      <div className="flex">
        {userProfileImage && (
          <Link href={`/user/${userId}`}>
            <Image src={userProfileImage} alt="" width="28" height="28" />
          </Link>
        )}
        <p>{userName}</p>
      </div>
      <p className="text-state-700">{post?.content}</p>
      {post.tags.map((tag) => (
        <PostTag tag={tag} key={tag.id} />
      ))}
      <div>
        <ShareButtons text={post.title} />
        <UrlCopyButton />
      </div>
      <h2 className="text-1xl font-bold my-4">{userName}の投稿</h2>
      {userPost.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </div>
  );
};

export default BlogDetailPage;
