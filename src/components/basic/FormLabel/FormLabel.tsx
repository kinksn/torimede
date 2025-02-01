import { FormLabel as ShadcnFormLabel } from "@/components/ui/form";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import * as React from "react";

const formLabelStylesProps = cva(
  "text-sm text-textColor-basic font-bold flex items-center gap-[2px] font-zenMaruGothic",
  {
    variants: {
      size: {
        md: "text-sm",
        sm: "text-xs",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

type FormLabelProps = VariantProps<typeof formLabelStylesProps> & {
  requirement?: "optional" | "required";
  children: React.ReactNode;
  className?: string;
};

export const FormLabel = ({
  children,
  size,
  requirement = "optional",
  className,
}: FormLabelProps) => {
  return (
    <ShadcnFormLabel className={cn(formLabelStylesProps({ size }), className)}>
      {children}
      {requirement === "required" && (
        <div className="text-tertialy-oceanblue-400 font-bold">*</div>
      )}
    </ShadcnFormLabel>
  );
};
