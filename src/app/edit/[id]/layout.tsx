import {
  COMMON_OG_IMAGE,
  DESCRIPTION,
  METADATA_TITLE,
} from "@/app/shared-metadata";
import { DetailPageLayout } from "@/components/DetailPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: METADATA_TITLE.post.edit,
  description: DESCRIPTION.common,
  openGraph: {
    ...COMMON_OG_IMAGE,
  },
};

export default async function EditLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DetailPageLayout>{children}</DetailPageLayout>;
}
