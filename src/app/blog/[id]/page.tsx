import BackButton from "@/components/BackButton";
import ButtonAction from "@/components/ButtonAction";
import { db } from "@/lib/db";
import { FC } from "react";

type BlogDetailPageProps = {
  params: {
    id: string;
  };
};

async function getPost(id: string) {
  const response = await db.post.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      tag: true,
    },
  });
  return response;
}

const BlogDetailPage: FC<BlogDetailPageProps> = async ({ params }) => {
  const post = await getPost(params.id);

  return (
    <div>
      <BackButton />
      <div className="mb-8">
        <h2 className="text-2xl font-bold my-4">{post?.title}</h2>
        <ButtonAction id={params.id} />
      </div>
      <span className="badge badge-neutral">{post?.tag.name}</span>
      <p className="text-state-700">{post?.content}</p>
    </div>
  );
};

export default BlogDetailPage;
