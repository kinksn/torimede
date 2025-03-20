"use client";

import Image from "next/image";
import MedeFace from "@/components/assets/icon/mede-face.svg";
import CameraIcon from "@/components/assets/icon/camera.svg";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const overlayStyle =
  "before:content-[''] before:transition-opacity before:opacity-0 before:rounded-full before:block before:pointer-events-none before:absolute before:inset-0 before:w-full before:h-full before:bg-overlay-icon";

const avatarStyles = cva(
  `relative rounded-full flex items-center justify-center bg-white border-2 border-primary-50 ${overlayStyle}`,
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
  profileImage?: string | null;
  isContentActive?: boolean;
  isHoverActive?: boolean;
  className?: string;
  isEditable?: boolean;
  children?: React.ReactNode;
  avatarTrigger?: React.ReactNode;
  onClick?: () => void;
};

export const Avatar = ({
  size,
  profileImage,
  isContentActive,
  isHoverActive,
  className,
  isEditable,
  children,
  onClick,
}: AvatarProps) => {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <div
      className={cn(
        `${avatarStyles({ size })} ${isContentActive && "before:opacity-100"} ${
          isHoverActive && "hover:before:opacity-100 cursor-pointer"
        }`,
        className
      )}
      onClick={handleClick}
    >
      {isEditable && <EditBadge size={size} />}
      {!!profileImage ? (
        <Image
          src={profileImage}
          className={`${isEditable && "cursor-pointer"} rounded-full`}
          alt="ユーザープロフィール画像"
          width="96"
          height="96"
        />
      ) : (
        <SVGIcon svg={MedeFace} className="w-6 text-primary-300" />
      )}
      {children}
    </div>
  );
};

const EdigBadgeStyles = cva(
  "absolute -top-[2px] -right-[2px] rounded-full overflow-hidden w-4 h-4 flex items-center justify-center text-white bg-textColor-basic",
  {
    variants: {
      size: {
        lg: "w-6 h-6",
        md: "w-5 h-5",
        sm: "w-4 h-4",
      },
    },
  }
);

const EditBadge = ({ size }: VariantProps<typeof avatarStyles>) => {
  const IconSizeStyles = (() => {
    switch (size) {
      case "lg":
        return "w-4";
      case "md":
        return "w-[14px]";
      default:
        return "w-3"; // デフォルトのスタイルを指定
    }
  })();

  return (
    <div className={EdigBadgeStyles({ size })}>
      <SVGIcon svg={CameraIcon} className={IconSizeStyles} />
    </div>
  );
};
