import { TermsPage } from "@/app/terms/TermsPage";
import { ContentToolbar } from "@/components/ContentToolbar";
import React from "react";

const page = () => {
  return (
    <>
      <ContentToolbar />
      <div className="px-5 max-sm:px-0 h-full max-sm:h-auto">
        <div className="w-full bg-white rounded-20 py-10 max-sm:px-5">
          <TermsPage />
        </div>
      </div>
    </>
  );
};

export default page;
