import { PrivacyPage } from "@/app/privacy/PrivacyPage";
import { ContentToolbar } from "@/components/ContentToolbar";
import { DetailPageLayout } from "@/components/DetailPageLayout";
import React from "react";

const page = () => {
  return (
    <DetailPageLayout>
      <PrivacyPage />
    </DetailPageLayout>
  );
};

export default page;
