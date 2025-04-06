import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { GetUserOutput, UserId } from "@/app/api/user/model";
import { ProfileEditPage } from "@/app/user/[userId]/edit/ProfileEditPage";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/fetcher/user";
import {
  COMMON_OG_IMAGE,
  DESCRIPTION,
  METADATA_TITLE,
} from "@/app/shared-metadata";

export const metadata: Metadata = {
  title: METADATA_TITLE.user.edit,
  description: DESCRIPTION.common,
  openGraph: {
    ...COMMON_OG_IMAGE,
  },
};

type UserEditProps = {
  params: {
    userId: UserId;
  };
};

const page = async ({ params }: UserEditProps) => {
  const session = await auth();
  const profile: GetUserOutput = await getUser(params.userId);

  if (profile.profile === undefined) {
    notFound();
  }

  if (session?.user?.id !== params.userId) {
    redirect("/");
  }

  return (
    <div className="bg-white h-full rounded-20 px-10 max-sm:px-5 py-10">
      <h1 className="text-2xl font-bold text-center mb-5 font-zenMaruGothic">
        {METADATA_TITLE.user.edit}
      </h1>
      <ProfileEditPage userProfile={profile.profile} />
    </div>
  );
};

export default page;
