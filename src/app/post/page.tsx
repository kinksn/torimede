import { InitialPagePathSetter } from "@/components/InitialPagePathSetter";
import { ContentToolbar } from "@/components/ContentToolbar";
import { getAuthSession } from "@/lib/auth";
import { PostSearchPage } from "@/app/post/PostSearchPage";

export default async function PostsPage() {
  const session = await getAuthSession();

  return (
    <>
      <InitialPagePathSetter />
      <ContentToolbar />
      <PostSearchPage session={session} />
    </>
  );
}
