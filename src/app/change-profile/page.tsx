import React from "react";
import { ChangeProfile } from "./_page/ChangeProfile";
import { getAuthSession } from "@/lib/auth";

const ChangeProfilePage = async () => {
  const session = await getAuthSession();
  return <ChangeProfile session={session} />;
};

export default ChangeProfilePage;
