import { DetailPageLayout } from "@/components/DetailPageLayout";

export default async function EditLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DetailPageLayout whiteSectionClassName="bg-transparent pt-0 px-0 pb-0 max-sm:px-0">
      {children}
    </DetailPageLayout>
  );
}
