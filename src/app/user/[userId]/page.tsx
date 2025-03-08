import { GetUserOutput, UserId } from "@/app/api/user/model";
import { UserPage } from "@/app/user/[userId]/_page/UserPage";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import React from "react";
import { COMMON_OG_IMAGE, DESCRIPTION } from "@/app/shared-metadata";

type UserProps = {
  params: {
    userId: UserId;
  };
};

const getProfile = async (userId: UserId) => {
  const profile: GetUserOutput =
    await // 本番環境だと名前を変更してもすぐに反映しなかったので `{chache: "no-store"}` を設定したら変更が反映されるようになった
    (
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`, {
        cache: "no-store",
      })
    ).json();
  return profile;
};

export async function generateMetadata({
  params,
}: UserProps): Promise<Metadata> {
  const profile: GetUserOutput = await getProfile(params.userId);

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
  const profile: GetUserOutput = await getProfile(params.userId);

  return <UserPage profile={profile} session={session} />;
}
