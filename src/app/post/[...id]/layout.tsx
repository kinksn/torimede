import { ContentToolbar } from "@/components/ContentToolbar";
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
    <>
      <ContentToolbar />
      <div className="px-5 max-sm:px-0 h-full max-sm:h-auto">
        <div className="w-full rounded-20">{children}</div>
      </div>
    </>
  );
}
