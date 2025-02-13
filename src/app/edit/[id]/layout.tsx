import { ContentToolbar } from "@/components/ContentToolbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "投稿編集",
  description: "投稿編集ページ",
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
        <div className="relative flex justify-center w-full bg-white rounded-20 py-10 max-sm:px-5">
          {children}
        </div>
      </div>
    </>
  );
}
