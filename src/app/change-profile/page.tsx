import React from "react";
import { ChangeProfile } from "./_page/ChangeProfile";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import {
  COMMON_OG_IMAGE,
  DESCRIPTION,
  METADATA_TITLE,
} from "@/app/shared-metadata";

export const metadata: Metadata = {
  title: METADATA_TITLE.top,
  description: DESCRIPTION.common,
  openGraph: {
    ...COMMON_OG_IMAGE,
  },
};

const ChangeProfilePage = async () => {
  const session = await auth();
  return <ChangeProfile session={session} />;
};

export default ChangeProfilePage;
