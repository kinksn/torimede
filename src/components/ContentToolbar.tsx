import BackButton from "@/components/BackButton";
import React from "react";

export const ContentToolbar = () => {
  return (
    <div className="py-5 px-10 max-sm:px-5">
      <BackButton
        className="max-sm:h-9 max-sm:text-sm"
        iconClassName="max-sm:w-4 max-sm:h-4"
      />
    </div>
  );
};
