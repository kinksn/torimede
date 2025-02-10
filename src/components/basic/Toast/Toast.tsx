"use client";

import InfoIcon from "@/components/assets/icon/info.svg";
import XmarkIcon from "@/components/assets/icon/x-mark.svg";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { Toaster as SonnerToaster } from "sonner";
import { RoundButton } from "@/components/basic/RoundButton";

export const ToastProvider = () => {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "8px",
          padding: "40px",
          border: "2px solid #000",
          gap: "8px",
        },
        classNames: {
          closeButton:
            "block border-none min-w-6 min-h-6 left-[calc(100%-24px)] top-4",
          title: "text-base font-bold text-gray-900 font-zenMaruGothic",
        },
        closeButton: true,
      }}
      duration={2000}
      icons={{
        success: (
          <SVGIcon svg={InfoIcon} className="text-state-success w-6 h-6" />
        ),
        error: <SVGIcon svg={InfoIcon} className="text-state-error w-6 h-6" />,
        close: (
          <RoundButton
            type="button"
            size={"xs"}
            colorTheme={"white"}
            asChild
            icon={
              <div>
                <SVGIcon svg={XmarkIcon} className="w-2 text-textColor-basic" />
              </div>
            }
          />
        ),
      }}
    />
  );
};
