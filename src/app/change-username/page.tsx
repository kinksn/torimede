import React from "react";
import { ChangeUserName } from "@/app/change-username/_page/ChangeUserName";
import { getAuthSession } from "@/lib/auth";

const ChangeUserNamePage = async () => {
  const session = await getAuthSession();
  return <ChangeUserName session={session} />;
};

export default ChangeUserNamePage;
