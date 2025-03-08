import {
  COMMON_OG_IMAGE,
  DESCRIPTION,
  METADATA_TITLE,
} from "@/app/shared-metadata";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: METADATA_TITLE.login,
  description: DESCRIPTION.common,
  openGraph: {
    ...COMMON_OG_IMAGE,
  },
};

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children} </>;
}
