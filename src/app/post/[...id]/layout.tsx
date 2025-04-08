import { DetailPageLayout } from "@/components/DetailPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "投稿",
  description: "投稿ページ",
};

export default async function EditLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DetailPageLayout whiteSectionClassName="px-0 py-0 overflow-hidden max-sm:px-0">
      {children}
    </DetailPageLayout>
  );
}
