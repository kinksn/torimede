import EditPostPage from "@/app/edit/[id]/EditPostPage";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { orderBy } from "es-toolkit";
import React from "react";

type EditPostPageProps = {
  params: {
    id: string;
  };
};

const Edit = async ({ params }: EditPostPageProps) => {
  const session = await getAuthSession();
  const tags = await db.tag.findMany({
    orderBy: {
      id: "desc",
    },
  });
  return <EditPostPage id={params.id} tags={tags} session={session} />;
};

export default Edit;
