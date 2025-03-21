import { DetailPageLayout } from "@/components/DetailPageLayout";

export default async function EditLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DetailPageLayout>{children}</DetailPageLayout>;
}
