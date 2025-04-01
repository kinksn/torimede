import React from "react";
import { notFound } from "next/navigation";
import { GetUserOutput, UserId } from "@/app/api/user/model";
import { UserPage } from "@/app/user/[userId]/_page/UserPage";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { COMMON_OG_IMAGE, DESCRIPTION } from "@/app/shared-metadata";
import { getUser } from "@/lib/fetcher/user";

type UserProps = {
  params: {
    userId: UserId;
  };
};

export async function generateMetadata({
  params,
}: UserProps): Promise<Metadata | undefined> {
  const profile: GetUserOutput = await getUser(params.userId);

  if (profile.profile === undefined) return;

  return {
    title: `${profile.profile.name}のプロフィール`,
    description: DESCRIPTION.common,
    openGraph: {
      ...COMMON_OG_IMAGE,
    },
  };
}

export default async function User({ params }: UserProps) {
  const session = await auth();
  const profile: GetUserOutput = await getUser(params.userId, {
    posts: true,
    mededPosts: true,
    kiraPosts: true,
  });

  if (profile.profile === undefined) {
    notFound();
  }

  return <UserPage profile={profile} session={session} />;
}
