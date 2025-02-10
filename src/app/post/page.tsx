import { InitialPagePathSetter } from "@/components/InitialPagePathSetter";
import { ContentToolbar } from "@/components/ContentToolbar";
import { PostSearchPage } from "@/app/post/PostSearchPage";

export default async function PostsPage() {
  return (
    <>
      <InitialPagePathSetter />
      <ContentToolbar />
      <PostSearchPage />
    </>
  );
}
