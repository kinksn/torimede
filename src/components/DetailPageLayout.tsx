import React from "react";
import { ContentToolbar } from "@/components/ContentToolbar";
import { cn } from "@/lib/utils";

type DetailPageLayoutProps = {
  children: React.ReactNode;
  className?: string;
  whiteSectionClassName?: string;
};

export const DetailPageLayout = ({
  children,
  className,
  whiteSectionClassName,
}: DetailPageLayoutProps) => {
  return (
    <div
      className={cn(
        "grid content-baseline h-full grid-rows-[auto_1fr]",
        className
      )}
    >
      <ContentToolbar />
      <div className="px-5 max-sm:px-0 max-sm:h-auto">
        <div
          className={cn(
            "bg-white rounded-20 px-10 py-10 max-sm:px-5 h-full",
            whiteSectionClassName
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
