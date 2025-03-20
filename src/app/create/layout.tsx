import {
  COMMON_OG_IMAGE,
  DESCRIPTION,
  METADATA_TITLE,
} from "@/app/shared-metadata";
import { ContentToolbar } from "@/components/ContentToolbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: METADATA_TITLE.post.create,
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
  return (
    <>
      <ContentToolbar />
      <div className="px-5 max-sm:px-0 h-full max-sm:h-auto">
        <div className="w-full bg-white rounded-20 py-10 max-sm:px-5">
          {children}
        </div>
      </div>
    </>
  );
}
