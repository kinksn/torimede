"use client";

import Logout from "@/components/assets/icon/logout.svg";
import { Avatar } from "@/components/basic/Avatar";
import { MenuItem } from "@/components/basic/MenuItem";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AccountMenuProps = {
  initialSession: Session | null;
  profileImage: string | null | undefined;
};

export const AccountMenu = ({
  initialSession,
  profileImage,
}: AccountMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const gotoMypage = () => {
    router.push(`/user/${initialSession?.user?.id}`);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Avatar
          profileImage={profileImage}
          isContentActive={isOpen}
          isHoverActive
          className="max-sm:w-9 max-sm:h-9"
        />
      </PopoverTrigger>
      <PopoverContent align="end" className="max-h-48 overflow-y-scroll w-auto">
        <MenuItem menuType="button" onClick={gotoMypage}>
          マイページ
        </MenuItem>
        <MenuItem
          menuType="button"
          onClick={() => signOut()}
          isShowIcon
          iconSvg={Logout}
          iconSvgColor="text-textColor-basic"
        >
          ログアウト
        </MenuItem>
      </PopoverContent>
    </Popover>
  );
};
