import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const roundButtonStyles = cva(
  "rounded-full flex items-center justify-center transition cursor-pointer",
  {
    variants: {
      size: {
        md: "w-12 h-12",
        sm: "w-9 h-9",
        xs: "w-6 h-6",
      },
      colorTheme: {
        primary:
          "bg-primary-700 hover:bg-primary-800 data-[active=true]:bg-primary-900 data-[active=false]:bg-primary-700",
        white:
          "bg-white hover:bg-primary-100 active:bg-primary-200 data-[active=true]:bg-primary-200 data-[active=false]:bg-white",
      },
    },
    defaultVariants: {
      size: "md",
      colorTheme: "primary",
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof roundButtonStyles> & {
    asChild?: boolean;
    isActive?: boolean;
    icon: React.ReactNode;
  };

export const RoundButton = ({
  asChild = false,
  isActive = false,
  className,
  icon,
  size,
  colorTheme,
  onClick,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-active={isActive}
      onClick={onClick}
      className={cn(roundButtonStyles({ size, colorTheme }), className)}
      {...props}
    >
      {icon}
    </Comp>
  );
};
