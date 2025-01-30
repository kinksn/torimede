import { FormLabel as ShadcnFormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import * as React from "react";

type FormLabelProps = {
  requirement?: "optional" | "required";
  children: React.ReactNode;
  className?: string;
};

export const FormLabel = ({
  children,
  requirement = "optional",
  className,
}: FormLabelProps) => {
  return (
    <ShadcnFormLabel
      className={cn(
        "text-sm text-textColor-basic font-bold flex items-center gap-[2px] font-zenMaruGothic",
        className
      )}
    >
      {children}
      {requirement === "required" && (
        <div className="text-tertialy-oceanblue-400 font-bold">*</div>
      )}
    </ShadcnFormLabel>
  );
};
