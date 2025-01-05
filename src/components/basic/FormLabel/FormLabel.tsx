import { FormLabel as ShadcnFormLabel } from "@/components/ui/form";

type FormLabelProps = {
  type?: "optional" | "required";
  children: React.ReactNode;
};

export const FormLabel = ({ children, type }: FormLabelProps) => {
  return (
    <ShadcnFormLabel className="text-sm text-textColor-basic font-bold flex items-center gap-[2px]">
      {children}
      {type === "required" && (
        <div className="text-tertialy-oceanblue-400 font-bold">*</div>
      )}
    </ShadcnFormLabel>
  );
};
