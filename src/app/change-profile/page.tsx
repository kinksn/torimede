import React from "react";
import { ChangeProfile } from "./_page/ChangeProfile";
import { auth } from "@/lib/auth";

const ChangeProfilePage = async () => {
  const session = await auth();
  return <ChangeProfile session={session} />;
};

export default ChangeProfilePage;
