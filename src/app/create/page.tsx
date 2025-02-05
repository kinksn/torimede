import CreatePostPage from "@/app/create/CreatePostPage";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { orderBy } from "es-toolkit";
import React from "react";

const CreatePage = async () => {
  const session = await getAuthSession();
  const tags = await db.tag.findMany({
    orderBy: {
      id: "desc",
    },
  });
  return <CreatePostPage tags={tags} session={session} />;
};

export default CreatePage;
