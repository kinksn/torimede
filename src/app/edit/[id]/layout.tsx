import BackButton from "@/components/BackButton";
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
      <BackButton className="my-5 mx-11 max-sm:mx-5" />
      <div className="px-11 max-sm:px-0 h-full max-sm:h-auto">
        <div className="flex justify-center w-full bg-white rounded-20 py-10 max-sm:px-5 max-sm:py-5 min-h-[calc(100%-80px)] max-sm:min-h-[calc(100%-40px)]">
          {children}
        </div>
      </div>
    </>
  );
}
