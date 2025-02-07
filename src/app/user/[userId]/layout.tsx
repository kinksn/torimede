import BackButton from "@/components/BackButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ユーザー",
  description: "ユーザーページ",
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
        <div className="bg-white rounded-20 px-10 py-10 max-sm:px-5 max-sm:py-5 min-h-[calc(100%-80px)] max-sm:min-h-[calc(100%-40px)]">
          {children}
        </div>
      </div>
    </>
  );
}
