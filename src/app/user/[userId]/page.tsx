import { GetUserOutput, UserId } from "@/app/api/user/model";
import { UserPage } from "@/app/user/[userId]/_page/UserPage";
import { getAuthSession } from "@/lib/auth";
import React from "react";

type UserProps = {
  params: {
    userId: UserId;
  };
};

export default async function User({ params }: UserProps) {
  const session = await getAuthSession();
  const userId = params.userId;
  const profile: GetUserOutput = await (
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`)
  ).json();

  return <UserPage profile={profile} session={session} />;
}
