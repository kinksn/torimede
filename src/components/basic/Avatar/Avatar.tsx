import Image from "next/image";
import MedeFace from "@/components/assets/icon/mede-face.svg";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarStyles = cva(
  "relative rounded-full overflow-hidden flex items-center justify-center bg-white border-2 border-primary-50",
  {
    variants: {
      size: {
        lg: "w-16 h-16",
        md: "w-12 h-12",
        sm: "w-9 h-9",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

type AvatarProps = VariantProps<typeof avatarStyles> & {
  profileImage: string | null | undefined;
  isPopoverOpen: boolean;
  className?: string;
};

export const Avatar = ({
  size,
  profileImage,
  isPopoverOpen,
  className,
}: AvatarProps) => {
  return (
    <div
      className={cn(
        `${avatarStyles({ size })} ${
          isPopoverOpen &&
          "before:content-[''] before:block before:pointer-events-none before:absolute before:inset-0 before:w-full before:h-full before:bg-overlay-icon"
        }`,
        className
      )}
    >
      {!!profileImage ? (
        <Image
          src={profileImage}
          className="cursor-pointer"
          alt="ユーザープロフィール画像"
          width="96"
          height="96"
        />
      ) : (
        <SVGIcon svg={MedeFace} className="w-6 text-primary-300" />
      )}
    </div>
  );
};
