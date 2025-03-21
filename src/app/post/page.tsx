import { InitialPagePathSetter } from "@/components/InitialPagePathSetter";
import { PostSearchPage } from "@/app/post/PostSearchPage";
import { Metadata } from "next";
import { DESCRIPTION, METADATA_TITLE } from "@/app/shared-metadata";
import { DetailPageLayout } from "@/components/DetailPageLayout";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string; tag?: string };
}): Promise<Metadata> {
  const searchQuery = searchParams?.q ?? "";
  const searchTag = searchParams?.tag ?? "";

  const title = searchQuery
    ? `「${searchQuery}」の検索結果`
    : searchTag
    ? `「${searchTag}」の検索結果`
    : METADATA_TITLE.search;

  return {
    title,
    description: DESCRIPTION.common,
  };
}

export default async function PostsPage() {
  return (
    <>
      <InitialPagePathSetter />
      <DetailPageLayout>
        <PostSearchPage />
      </DetailPageLayout>
    </>
  );
}
