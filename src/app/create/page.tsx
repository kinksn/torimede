import CreatePostPage from "@/app/create/CreatePostPage";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";

const CreatePage = async () => {
  const session = await auth();
  const tags = await db.tag.findMany({
    orderBy: {
      id: "desc",
    },
  });
  return <CreatePostPage tags={tags} session={session} />;
};

export default CreatePage;
