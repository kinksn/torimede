"use client";

import { Avatar } from "@/components/basic/Avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SVGIcon } from "@/components/ui/SVGIcon";
import ChevronDown from "@/components/assets/icon/chevron-down.svg";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useState } from "react";

const avatarSelectorStyles = cva(
  "relative flex gap-[10px] items-center transition rounded-full border-2 border-primary-100",
  {
    variants: {
      size: {
        md: "h-20",
      },
      colorTheme: {
        primary: "hover:border-tertialy-oceanblue-400",
      },
      isPopoverOpen: {
        true: "border-tertialy-oceanblue-400",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      colorTheme: "primary",
      isPopoverOpen: false,
    },
  }
);

type AvatarSelectorProps = VariantProps<typeof avatarSelectorStyles> & {
  profileImage: string | null;
  previewProfileImage?: string | null;
  selectLabel?: string;
  className?: string;
  avatarTrigger?: React.ReactNode;
  popoverContent?: React.ReactNode;
};

export const AvatarSelector = ({
  size,
  colorTheme,
  profileImage,
  previewProfileImage,
  selectLabel = "アイコンを選択",
  className,
  avatarTrigger,
  popoverContent,
}: AvatarSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        avatarSelectorStyles({
          size,
          colorTheme,
          isPopoverOpen: isOpen,
        }),
        className
      )}
    >
      <Avatar
        profileImage={previewProfileImage ? previewProfileImage : profileImage}
        isEditable={true}
        size={"lg"}
        className="absolute left-2 border-none"
        isHoverActive
      >
        {avatarTrigger}
      </Avatar>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className="cursor-pointer h-full pl-[82px] pr-3">
          <div className="flex items-center justify-between gap-3">
            {selectLabel}
            <SVGIcon svg={ChevronDown} className="text-primary-700 w-6" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-7 pointer-events-auto" align="center">
          {popoverContent}
        </PopoverContent>
      </Popover>
    </div>
  );
};
