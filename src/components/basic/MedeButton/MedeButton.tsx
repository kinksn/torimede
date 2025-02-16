"use client";

import axiosInstance from "@/lib/axios";
import * as motion from "motion/react-client";
import EyeHeartSmall from "@/components/assets/mede-button/eye-heart-small.svg";
import EyeHeartLarge from "@/components/assets/mede-button/eye-heart-large.svg";
import GoogleIcon from "@/components/assets/icon/color-fixed/google.svg";
import { Session } from "next-auth";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { emitParticles } from "./particle";
import { debounce } from "es-toolkit";
import { useMutation } from "@tanstack/react-query";
import { PostId } from "@/app/api/post/model";
import { useUIBlock } from "@/hooks/useUIBlock";
import {
  CreateCuteOutput,
  MAX_CUTE_COUNT,
} from "@/app/api/cute/[postId]/model";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginForm, loginFormSchema } from "@/app/api/user/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/basic/Button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/basic/Input";
import { cn } from "@/lib/utils";

const EYE = {
  default: {
    d: "M0.0737305 4.58205C0.0737305 7.9546 2.91917 8.79827 4.9791 8.67283C7.23729 8.53532 8.73724 8.09252 8.73735 4.58212C8.73743 1.99539 6.92806 0 4.49251 0C2.7921 0 0.0737305 1.44118 0.0737305 4.58205Z",
  },
  tap: {
    d: "M-0.00537107 5.01161C-0.00564225 8.15248 2.74576 5.23083 5.21308 4.72414C7.99277 4.57618 10.0169 5.6215 10.0169 3.42271C10.0169 1.44929 7.14527 0.433105 4.70972 0.433105C3.00931 0.433105 -0.0050999 1.87074 -0.00537107 5.01161Z",
  },
  disabled: {
    d: "M0.785581 0.991053C-0.647608 2.38907 2.62166 5.31509 5.24048 5.31509C9.86022 5.31509 11.2197 2.30376 10.3933 1.23991C9.36264 -0.08696 8.40303 1.73745 5.66486 1.73745C2.71646 1.73745 2.13595 -0.13455 0.785581 0.991053Z",
  },
};

const BEAK = {
  default: {
    d: "M10.8039 1.17166C9.87277 0.441582 8.72807 0 7.75638 0C6.51969 0 5.68051 0.282814 4.48799 1.17166C2.75764 2.46137 0.82959 6.95393 0.82959 8.2237C0.82959 9.49347 1.77603 10.1745 2.68461 10.3939C3.5932 10.6132 7.75638 11.1411 12.6761 10.6588C13.5898 10.5693 15.5584 10.3939 14.6933 7.22589C13.8744 4.22756 11.4223 1.65648 10.8039 1.17166Z",
  },
};

const BASE = {
  default: {
    fill: "M17.6038 65.997C21.065 68.2346 26.5104 70.0817 34.7536 70.0888C39.1493 70.0927 45.0745 69.7248 51.174 66.2071C56.3885 63.1997 65.2847 55.3362 64.8419 41.7837C64.6138 34.8003 61.0461 27.6286 56.4465 22.6493C55.4194 21.4169 53.361 19.4534 51.3087 17.7582C48.0151 15.1476 45.2589 14.0834 44.1914 13.6018C44.6773 10.2091 44.6683 8.2898 42.657 7.28414C41.9518 6.93154 40.9085 6.93654 40.3287 7.13726C39.2136 7.68738 37.2733 9.03495 36.3967 9.52347L35.7594 9.91795C35.7045 9.82906 35.5463 9.56031 35.3341 9.22472C35.167 8.96043 34.6699 8.14027 34.0989 7.18929C33.1771 5.44971 32.1177 4.11181 30.8428 4.11182C28.1747 4.11183 27.3488 5.56871 27.2819 7.73946C27.2779 8.46743 27.5859 9.02337 27.7428 9.52347C28.2579 11.166 28.2928 11.3275 28.5299 12.0516C23.0325 14.3205 18.4508 15.9542 13.8713 20.8664C9.96551 25.0559 4.82715 32.2217 4.82715 41.7127C4.82714 55.1491 11.1065 61.4423 17.6038 65.997Z",
    stroke:
      "M16.0009 69.6977C19.7246 72.1056 26.2299 74.1006 34.6478 74.1006C38.0598 74.1006 45.9092 73.8897 52.4712 70.1042C60.3462 65.5613 68.8428 56.4455 68.8428 41.7693C68.8428 35.8288 66.1244 26.9856 58.4218 18.8628C57.5675 17.9619 56.0714 16.4484 54.3738 15.0458C52.2252 13.2706 49.5881 11.6475 48.4397 11.1292C48.7271 7.98534 46.9822 4.70969 44.3247 3.63804C41.9154 2.66645 39.5286 2.86213 37.8191 3.96637L37.0883 4.41426C37.0292 4.31861 36.863 4.03192 36.6706 3.65043C36.4301 3.17356 34.1655 0.10108 30.8735 0.100586C26.221 0.0998876 24.16 3.04025 23.6155 5.4494C23.071 7.85856 23.3604 9.00151 23.6155 9.78077C18.0025 12.1197 14.8696 14.1039 10.2452 18.8664C7.20154 22.0009 0.875608 30.7042 0.842963 41.79C0.800384 56.249 7.95354 64.4941 16.0009 69.6977Z",
  },
  hover: {
    fill: "M17.2175 66.229C20.6788 68.4665 26.1242 70.3136 34.3674 70.3208C38.7631 70.3246 44.6883 69.9568 50.7878 66.439C56.0023 63.4316 64.8985 55.5681 64.4557 42.0156C64.2275 35.0323 60.6599 27.8605 56.0602 22.8813C55.0332 21.6488 52.9748 19.6854 50.9225 17.9901C47.6289 15.3795 44.8727 14.3154 43.8052 13.8338C44.2911 10.4411 44.2821 8.52174 42.2708 7.51608C41.5656 7.16347 40.5223 7.16847 39.9425 7.36919C38.8273 7.91932 36.8871 9.26689 36.0105 9.7554L35.3732 10.1499C35.3183 10.061 35.1601 9.79225 34.9479 9.45666C34.7808 9.19237 34.2836 8.3722 33.7127 7.42122C32.7909 5.68164 31.7315 4.34374 30.4566 4.34375C27.7885 4.34376 26.9625 5.80064 26.8956 7.97139C26.8917 8.69936 27.1997 9.2553 27.3565 9.7554C27.8716 11.3979 27.9066 11.5594 28.1437 12.2835C22.6463 14.5524 18.0646 16.1861 13.4851 21.0983C9.57928 25.2878 4.44092 32.4537 4.44092 41.9447C4.44091 55.381 10.7203 61.6743 17.2175 66.229Z",
    stroke:
      "M15.6146 69.9296C19.3384 72.3376 25.8437 74.3325 34.2616 74.3325C37.6735 74.3325 45.523 74.1216 52.085 70.3361C59.96 65.7932 68.4565 56.6775 68.4565 42.0013C68.4565 36.0607 65.7382 27.2176 58.0356 19.0948C57.1812 18.1938 55.6851 16.6803 53.9876 15.2778C51.839 13.5025 49.2019 11.8794 48.0535 11.3612C48.3409 8.21727 46.596 4.94162 43.9385 3.86998C41.5291 2.89838 39.1424 3.09406 37.4329 4.1983L36.702 4.6462C36.643 4.55054 36.4767 4.26386 36.2844 3.88236C36.0439 3.40549 33.7793 0.333014 30.4873 0.33252C25.8348 0.331821 23.7738 3.27218 23.2293 5.68134C22.6847 8.09049 22.9742 9.23344 23.2293 10.0127C17.6162 12.3517 14.4834 14.3359 9.859 19.0983C6.81531 22.2329 0.489378 30.9361 0.456732 42.022C0.414153 56.4809 7.56731 64.726 15.6146 69.9296Z",
  },
  press: {
    fill: "M17.2175 65.8964C20.6788 68.134 26.1242 69.9811 34.3674 69.9883C38.7631 69.9921 44.6883 69.6243 50.7878 66.1065C56.0023 63.0991 64.8985 55.2356 64.4557 41.6831C64.2275 34.6998 60.6599 27.528 56.0602 22.5488C55.0332 21.3163 52.9748 19.3528 50.9225 17.6576C47.6289 15.047 44.8727 13.9828 43.8052 13.5013C44.2911 10.1086 44.2821 8.18922 42.2708 7.18356C41.5656 6.83095 40.5223 6.83595 39.9425 7.03667C38.8273 7.5868 36.8871 8.93437 36.0105 9.42288L35.3732 9.81737C35.3183 9.72848 35.1601 9.45973 34.9479 9.12414C34.7808 8.85985 34.2836 8.03968 33.7127 7.0887C32.7909 5.34912 31.7315 4.01122 30.4566 4.01123C27.7885 4.01125 26.9625 5.46812 26.8956 7.63887C26.8917 8.36684 27.1997 8.92278 27.3565 9.42288C27.8716 11.0654 27.9066 11.2269 28.1437 11.951C22.6463 14.2199 18.0646 15.8536 13.4851 20.7658C9.57928 24.9553 4.44092 32.1211 4.44092 41.6122C4.44091 55.0485 10.7203 61.3417 17.2175 65.8964Z",
    stroke:
      "M15.6146 69.5971C19.3384 72.005 25.8437 74 34.2616 74C37.6735 74 45.523 73.7891 52.085 70.0036C59.96 65.4607 68.4565 56.3449 68.4565 41.6687C68.4565 35.7282 65.7382 26.885 58.0356 18.7623C57.1812 17.8613 55.6851 16.3478 53.9876 14.9452C51.839 13.17 49.2019 11.5469 48.0535 11.0287C48.3409 7.88475 46.596 4.6091 43.9385 3.53746C41.5291 2.56586 39.1424 2.76154 37.4329 3.86578L36.702 4.31368C36.643 4.21802 36.4767 3.93134 36.2844 3.54984C36.0439 3.07297 33.7793 0.000494516 30.4873 1.24398e-07C25.8348 -0.000698297 23.7738 2.93966 23.2293 5.34882C22.6847 7.75797 22.9742 8.90092 23.2293 9.68018C17.6162 12.0191 14.4834 14.0033 9.859 18.7658C6.81531 21.9003 0.489378 30.6036 0.456732 41.6894C0.414153 56.1484 7.56731 64.3935 15.6146 69.5971Z",
  },
};

const CHEEKS = {
  left: {
    top: "M23.0911 15.363C23.0911 17.7517 19.6356 19.1683 17.0392 19.0795C14.193 18.9821 12.1715 17.8494 12.1714 15.3631C12.1713 13.531 14.4518 12.1177 17.5216 12.1177C19.6648 12.1177 23.0911 13.1384 23.0911 15.363Z",
    bottom:
      "M23.0911 16.3581C23.0911 18.7468 19.6356 20.1634 17.0392 20.0746C14.193 19.9772 12.1715 18.8445 12.1714 16.3582C12.1713 14.5261 14.4518 13.1128 17.5216 13.1128C19.6648 13.1128 23.0911 14.1335 23.0911 16.3581Z",
  },
  right: {
    top: "M12.9155 15.363C12.9155 17.7517 16.371 19.1683 18.9674 19.0795C21.8136 18.9821 23.8351 17.8494 23.8352 15.3631C23.8353 13.531 21.5548 12.1177 18.485 12.1177C16.3418 12.1177 12.9155 13.1384 12.9155 15.363Z",
    bottom:
      "M12.9155 16.3581C12.9155 18.7468 16.371 20.1634 18.9674 20.0746C21.8136 19.9772 23.8351 18.8445 23.8352 16.3582C23.8353 14.5261 21.5548 13.1128 18.485 13.1128C16.3418 13.1128 12.9155 14.1335 12.9155 16.3581Z",
  },
};

const faceGradient = (id: string) => (
  <linearGradient
    id={`${id}`}
    x1="4.77268"
    y1="0.703125"
    x2="4.77268"
    y2="9.38774"
    gradientUnits="userSpaceOnUse"
  >
    <stop stopColor="#634A97" />
    <stop offset="1" stopColor="#5A77BF" />
  </linearGradient>
);

type MedeButtonProps = {
  userMedeCount: number;
  session: Session | null;
  className?: string;
  disabled?: boolean;
  tempMedeCount: number;
  setTempMedeCount: Dispatch<SetStateAction<number>>;
  submitMede: () => void;
  submitCallback: () => void;
};

export const MedeButton = ({
  userMedeCount,
  session,
  className,
  disabled,
  tempMedeCount,
  setTempMedeCount,
  submitMede,
  submitCallback,
}: MedeButtonProps) => {
  const [isButtonBarrage, setIsButtonBarrage] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPress, setIsPress] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const { block, unblock } = useUIBlock();

  // パーティクル放射用の要素
  const medebuttonRef = useRef<HTMLButtonElement>(null);

  // 最後のタップ終了後に「ブロックを解除するタイマー」を管理
  const unblockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isButtonBarrage) return;
    timeoutId = setTimeout(() => {
      if (tempMedeCount > 0) {
        submitMede();
      }
    }, 1000);
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isButtonBarrage, tempMedeCount, submitMede]);

  const jadgeButtonBarrage = () => {
    if (userMedeCount + tempMedeCount < MAX_CUTE_COUNT) {
      setTempMedeCount((medeCount: number) => medeCount + 1);
      setIsButtonBarrage(true);
      setTimeout(() => setIsButtonBarrage(false), 300);
    }
  };

  const handlePressStart = () => {
    if (disabled) return;
    // すでにブロック中なら、タイマーをクリアしてブロック継続
    if (unblockTimerRef.current) {
      clearTimeout(unblockTimerRef.current);
      unblockTimerRef.current = null;
    }
    if (!isBlocking) {
      block();
      setIsBlocking(true);
    }
    if (medebuttonRef.current && !disabled) {
      emitParticles(medebuttonRef);
    }
  };

  const handlePressEnd = () => {
    if (disabled) return;
    // 連打が止まったかどうかを判定するための猶予時間
    const UNBLOCK_DELAY = 1500;

    // もしすでにタイマーがセットされていれば解除
    if (unblockTimerRef.current) {
      clearTimeout(unblockTimerRef.current);
    }

    // 連打が来なければ`UNBLOCK_DELAY`ミリ秒後にUIブロック解除
    unblockTimerRef.current = setTimeout(() => {
      unblock();
      setIsBlocking(false);
      unblockTimerRef.current = null;
    }, UNBLOCK_DELAY);
  };

  const handleSubmit = () => {
    if (!session) return setIsDialogOpen(true);
    if (disabled) return;
    if (medebuttonRef.current) {
      submitCallback();
      jadgeButtonBarrage();
      emitParticles(medebuttonRef);
    }
  };

  const debouncedHandleClick = debounce(() => {
    if (disabled) return;
    if (medebuttonRef.current) {
      emitParticles(medebuttonRef);
      setIsPress(true);
    }
  }, 40);

  return (
    <>
      <button
        className={cn("block relative w-[0] h-[0]", className)}
        ref={medebuttonRef}
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          touchAction: "none",
          WebkitTouchCallout: "none",
        }}
        aria-label="メデボタン"
        aria-pressed={isPress}
        disabled={disabled}
      >
        <div className="absolute z-10">
          <div className="flex items-center justify-center w-[80px] h-[80px] absolute -left-[40px] -top-[40px]">
            <motion.div
              className="relative w-[68px] h-[74px] cursor-pointer"
              onTapStart={() => setIsPress(true)}
              onTapCancel={() => setIsPress(false)}
              onTap={() => setIsPress(false)}
              onHoverStart={() => setIsHover(true)}
              onHoverEnd={() => setIsHover(false)}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1 }}
              onMouseDown={handleSubmit}
              onTouchEnd={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchMove={debouncedHandleClick}
            >
              {/* base */}
              <div className="absolute top-0 left-0">
                <div className="relative">
                  <svg
                    width="69"
                    height="74"
                    viewBox="0 0 69 74"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-0 left-0"
                  >
                    <path
                      d="M23.3237 9.71087C18.1778 11.5677 13.6752 14.7127 9.95409 18.7716C4.4314 24.7956 0.523438 32.8326 0.523438 41.659C0.523438 54.1823 6.31821 64.1212 16.4066 69.9712C21.3711 72.85 28.1276 74 34.2753 74C40.4229 74 47.1794 72.85 52.1439 69.9712C62.2323 64.1212 68.5234 54.1823 68.5234 41.659C68.5234 32.8326 63.6228 24.7956 58.1001 18.7716C55.1553 15.5595 51.8342 12.9197 48.0973 11.0378C48.5285 7.9431 46.8957 4.87939 44.005 3.55869C41.9127 2.60336 39.4917 2.72383 37.5052 3.87681L36.774 4.30122L36.3524 3.5671C35.207 1.57273 33.1704 0.254686 30.882 0.0330956C27.4241 -0.300914 24.2295 1.92442 23.3278 5.29865L23.253 5.57863C22.8871 6.94775 22.9179 8.37997 23.3237 9.71087Z"
                      fill="white"
                    />
                  </svg>
                  <motion.svg
                    initial="default"
                    width="73"
                    height="81"
                    viewBox="0 0 73 81"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="outline-none relative z-10"
                    animate={isPress ? "tap" : "default"}
                  >
                    <defs>
                      <filter
                        id="shadow-default"
                        x="0.842773"
                        y="0.100586"
                        width="72"
                        height="80"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                      >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="1" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_1275_14982"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_1275_14982"
                          result="shape"
                        />
                      </filter>
                      <linearGradient
                        id="stroke-default-grad"
                        x1="0.842773"
                        y1="13.5649"
                        x2="71.3335"
                        y2="17.1688"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#FEF8E6" />
                        <stop offset="1" stopColor="#FFF6E7" />
                      </linearGradient>
                      <linearGradient
                        id="fill-default-grad"
                        x1="0.864098"
                        y1="7.31806"
                        x2="71.891"
                        y2="11.2129"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#FFF8D8" />
                        <stop offset="0.2" stopColor="#FFF4B9" />
                        <stop offset="0.49699" stopColor="#F9E5C8" />
                        <stop offset="0.75" stopColor="#FDEAC3" />
                        <stop offset="1" stopColor="#FFF2D0" />
                      </linearGradient>
                      <linearGradient
                        id="stroke-hover-grad"
                        x1="0.456543"
                        y1="16.3089"
                        x2="70.931"
                        y2="20.068"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#FFDF8D" />
                        <stop offset="1" stopColor="#FFC7A8" />
                      </linearGradient>
                      <linearGradient
                        id="fill-hover-grad"
                        x1="0.477868"
                        y1="10.1548"
                        x2="71.4859"
                        y2="14.2172"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#FFF8D8" />
                        <stop offset="0.2" stopColor="#FFF4B9" />
                        <stop offset="0.49699" stopColor="#F9E5C8" />
                        <stop offset="0.75" stopColor="#FDEAC3" />
                        <stop offset="1" stopColor="#FFF2D0" />
                      </linearGradient>
                      <linearGradient
                        id="stroke-press-grad"
                        x1="38.9565"
                        y1="79.3102"
                        x2="48.7567"
                        y2="4.39162"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#F8B8BB" />
                        <stop offset="1" stopColor="#F9CABF" />
                      </linearGradient>
                      <linearGradient
                        id="fill-press-grad"
                        x1="0.477868"
                        y1="9.5423"
                        x2="71.4881"
                        y2="13.586"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#FFF8D8" />
                        <stop offset="0.2" stopColor="#FFF4B9" />
                        <stop offset="0.49699" stopColor="#F9E5C8" />
                        <stop offset="0.75" stopColor="#FDEAC3" />
                        <stop offset="1" stopColor="#FFF2D0" />
                      </linearGradient>
                    </defs>
                    <motion.g
                      filter="url(#shadow-default)"
                      initial={{ opacity: 1 }}
                      animate={
                        !disabled && {
                          opacity: isHover ? 0 : 1,
                          scale: isHover ? 0 : 1,
                        }
                      }
                      transition={{ duration: 0.4 }}
                    >
                      <motion.path
                        d={BASE.default.stroke}
                        fill="url(#stroke-default-grad)"
                      />
                      <motion.path
                        d={BASE.default.fill}
                        fill="url(#fill-default-grad)"
                      />
                    </motion.g>
                    <motion.g
                      filter="url(#shadow-default)"
                      initial={{ opacity: 0 }}
                      animate={
                        !disabled && {
                          opacity: isHover ? (!isPress ? 1 : 0) : 0,
                        }
                      }
                      transition={{ duration: 0.4 }}
                    >
                      <motion.path
                        d={BASE.hover.stroke}
                        fill="url(#stroke-hover-grad)"
                      />
                      <motion.path
                        d={BASE.hover.fill}
                        fill="url(#fill-hover-grad)"
                      />
                    </motion.g>
                    <motion.g
                      filter="url(#shadow-default)"
                      initial={{ opacity: 0 }}
                      animate={
                        !disabled && {
                          opacity: isPress ? 1 : 0,
                        }
                      }
                      transition={{ duration: 0.2 }}
                    >
                      <motion.path
                        d={BASE.press.stroke}
                        fill="url(#stroke-press-grad)"
                      />
                      <motion.path
                        d={BASE.press.fill}
                        fill="url(#fill-press-grad)"
                      />
                    </motion.g>
                  </motion.svg>
                </div>
              </div>

              {/* eyes beak */}
              <div className="flex items-center justify-center gap-[1.7px] w-full h-full absolute z-10">
                <div className="relative">
                  {!disabled && (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{
                          scale: isHover && !isPress ? [1, 1.2, 1, 1.2, 1] : 0,
                          x:
                            isHover && !isPress ? [0.4, 0.2, 0.4, 0.2, 0.4] : 0,
                          y:
                            isHover && !isPress ? [0.8, 0.4, 0.8, 0.4, 0.8] : 0,
                        }}
                        transition={{
                          duration: 0.8,
                          times: [0, 0.2, 0.5, 0.8, 1],
                          repeat: Infinity,
                          scale: { visualDuration: 0.4, bounce: 0.6 },
                        }}
                        className="absolute -top-[1px] -left-[1px] z-10"
                      >
                        <SVGIcon svg={EyeHeartSmall} />
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{
                          scale: isHover && !isPress ? [1, 1.2, 1, 1.2, 1] : 0,
                          x:
                            isHover && !isPress ? [0.4, 0.2, 0.4, 0.2, 0.4] : 0,
                          y:
                            isHover && !isPress ? [0.8, 0.4, 0.8, 0.4, 0.8] : 0,
                        }}
                        transition={{
                          duration: 0.3,
                          times: [0, 0.2, 0.5, 0.8, 1],
                          repeat: Infinity,
                          scale: { visualDuration: 0.4, bounce: 0.6 },
                        }}
                        className="absolute -bottom-[5px] -right-[2px] z-10"
                      >
                        <SVGIcon svg={EyeHeartLarge} />
                      </motion.div>
                    </>
                  )}
                  <motion.svg
                    initial="default"
                    width="11"
                    height="10"
                    viewBox="0 0 11 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="outline-none transform -scale-x-100"
                    animate={
                      isPress && !disabled
                        ? "tap"
                        : disabled
                        ? "disabled"
                        : "default"
                    }
                  >
                    <defs>{faceGradient("leftEye")}</defs>
                    <motion.path
                      className="outline-none"
                      variants={EYE}
                      transition={{
                        duration: 0.2,
                      }}
                      fill="url(#leftEye)"
                    />
                  </motion.svg>
                  <motion.svg
                    initial="default"
                    width="11"
                    height="10"
                    viewBox="0 0 11 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute bottom-[-1.4px] opacity-[0.1] -z-10 transform -scale-x-100"
                    animate={
                      isPress && !disabled
                        ? "tap"
                        : disabled
                        ? "disabled"
                        : "default"
                    }
                  >
                    <defs>{faceGradient("leftEye")}</defs>
                    <motion.path
                      className="outline-none"
                      variants={EYE}
                      transition={{
                        duration: 0.2,
                      }}
                      fill="url(#leftEye)"
                    />
                  </motion.svg>
                </div>
                {/* beak */}
                <div className="relative top-[1.8px]">
                  <motion.svg
                    initial="default"
                    width="15"
                    height="11"
                    viewBox="0.5 0 15 11"
                    xmlns="http://www.w3.org/2000/svg"
                    className=""
                    animate={
                      !disabled && {
                        scale: isPress ? [1, 1.2, 1, 1.2, 1] : 1,
                        x: isPress ? [0.4, 0.2, 0.4, 0.2, 0.4] : 0,
                        y: isPress ? [0.8, 0.4, 0.8, 0.4, 0.8] : 0,
                      }
                    }
                    transition={{
                      times: [0, 0.4, 0.8, 1.2, 1.5],
                      scale: { visualDuration: 0.4, bounce: 0.6 },
                    }}
                  >
                    <defs>{faceGradient("beak")}</defs>
                    <motion.path
                      className="outline-none"
                      variants={BEAK}
                      transition={{
                        duration: 0.1,
                      }}
                      fill="url(#beak)"
                    />
                  </motion.svg>
                  <svg
                    width="15"
                    height="11"
                    viewBox="0.5 0 15 11"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute bottom-[-1.4px] opacity-[0.1] -z-10"
                  >
                    <path d={BEAK.default.d} />
                  </svg>
                </div>
                <div className="relative">
                  {!disabled && (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{
                          scale: isHover && !isPress ? [1, 1.2, 1, 1.2, 1] : 0,
                          x:
                            isHover && !isPress ? [0.4, 0.2, 0.4, 0.2, 0.4] : 0,
                          y:
                            isHover && !isPress ? [0.8, 0.4, 0.8, 0.4, 0.8] : 0,
                        }}
                        transition={{
                          duration: 0.8,
                          times: [0, 0.2, 0.5, 0.8, 1],
                          repeat: Infinity,
                          scale: { visualDuration: 0.4, bounce: 0.6 },
                        }}
                        className="absolute -top-[1px] -left-[2px] z-10"
                      >
                        <SVGIcon svg={EyeHeartSmall} />
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{
                          scale: isHover && !isPress ? [1, 1.2, 1, 1.2, 1] : 0,
                          x:
                            isHover && !isPress ? [0.4, 0.2, 0.4, 0.2, 0.4] : 0,
                          y:
                            isHover && !isPress ? [0.8, 0.4, 0.8, 0.4, 0.8] : 0,
                        }}
                        transition={{
                          duration: 0.3,
                          times: [0, 0.2, 0.5, 0.8, 1],
                          repeat: Infinity,
                          scale: { visualDuration: 0.4, bounce: 0.6 },
                        }}
                        className="absolute -bottom-[5px] -right-[1px] z-10"
                      >
                        <SVGIcon svg={EyeHeartLarge} />
                      </motion.div>
                    </>
                  )}
                  <motion.svg
                    initial="default"
                    width="11"
                    height="10"
                    viewBox="0 0 11 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="outline-none"
                    animate={
                      isPress && !disabled
                        ? "tap"
                        : disabled
                        ? "disabled"
                        : "default"
                    }
                  >
                    <defs>{faceGradient("rightEye")}</defs>
                    <motion.path
                      className="outline-none"
                      variants={EYE}
                      transition={{
                        duration: 0.1,
                      }}
                      fill="url(#rightEye)"
                    />
                  </motion.svg>
                  <motion.svg
                    initial="default"
                    width="11"
                    height="10"
                    viewBox="0 0 11 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute bottom-[-1.4px] opacity-[0.1] -z-10"
                    animate={
                      isPress && !disabled
                        ? "tap"
                        : disabled
                        ? "disabled"
                        : "default"
                    }
                  >
                    <defs>{faceGradient("rightEye")}</defs>
                    <motion.path
                      className="outline-none"
                      variants={EYE}
                      transition={{
                        duration: 0.1,
                      }}
                      fill="url(#rightEye)"
                    />
                  </motion.svg>
                </div>
              </div>

              {/* cheeks */}
              <motion.div
                className="flex items-center justify-center w-full h-full absolute top-[10px] z-10"
                initial={{ y: 0, scale: 1 }}
                animate={
                  !disabled && {
                    y: isHover && !isPress ? -1 : isPress ? -1.2 : 0,
                    scale: isPress ? 1.1 : 1,
                  }
                }
                transition={{
                  duration: 0.4,
                  type: "spring",
                }}
              >
                {/* left */}
                <motion.div
                  className="w-[46px] mx-auto flex justify-between items-center"
                  initial={{ x: 0 }}
                  animate={!disabled && { x: isHover && !isPress ? -1 : 0 }}
                >
                  <motion.svg
                    width="36"
                    height="32"
                    viewBox="0 0 36 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <filter
                        id="filter0_d_1307_15430"
                        x="0.118164"
                        y="0.634766"
                        width="34.9199"
                        height="30.9658"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                      >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset />
                        <feGaussianBlur stdDeviation="6" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0.977751 0 0 0 0 0.594496 0 0 0 0 0.542235 0 0 0 0.8 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_1307_15430"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_1307_15430"
                          result="shape"
                        />
                      </filter>
                      <linearGradient
                        id="paint0_linear_1308_15438"
                        x1="17.6312"
                        y1="3.65928"
                        x2="17.6312"
                        y2="29.5321"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#F3B499" />
                        <stop offset="1" stopColor="#F3ABA7" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_1308_15438"
                        x1="17.6312"
                        y1="2.66416"
                        x2="17.6312"
                        y2="28.5369"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#FFBCA0" />
                        <stop offset="1" stopColor="#FCB2AD" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d={CHEEKS.left.bottom}
                      fill="url(#paint0_linear_1308_15438)"
                    />
                    <g filter="url(#filter0_d_1307_15430)">
                      <motion.path
                        d={CHEEKS.left.top}
                        fill="url(#paint1_linear_1308_15438)"
                        transition={{
                          duration: 0.1,
                        }}
                      />
                    </g>
                  </motion.svg>
                </motion.div>
                {/* right */}
                <motion.div
                  className="w-[46px] mx-auto flex justify-between items-center"
                  initial={{ x: 0 }}
                  animate={!disabled && { x: isHover && !isPress ? 1 : 0 }}
                >
                  <motion.svg
                    width="36"
                    height="32"
                    viewBox="0 0 36 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <filter
                        id="filter0_d_1307_15430"
                        x="0.118164"
                        y="0.634766"
                        width="34.9199"
                        height="30.9658"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                      >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset />
                        <feGaussianBlur stdDeviation="6" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0.977751 0 0 0 0 0.594496 0 0 0 0 0.542235 0 0 0 0.8 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_1307_15430"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_1307_15430"
                          result="shape"
                        />
                      </filter>
                      <linearGradient
                        id="paint0_linear_1308_15438"
                        x1="17.6312"
                        y1="3.65928"
                        x2="17.6312"
                        y2="29.5321"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#F3B499" />
                        <stop offset="1" stopColor="#F3ABA7" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_1308_15438"
                        x1="17.6312"
                        y1="2.66416"
                        x2="17.6312"
                        y2="28.5369"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#FFBCA0" />
                        <stop offset="1" stopColor="#FCB2AD" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d={CHEEKS.right.bottom}
                      fill="url(#paint0_linear_1308_15438)"
                    />
                    <g filter="url(#filter0_d_1307_15430)">
                      <motion.path
                        d={CHEEKS.right.top}
                        fill="url(#paint1_linear_1308_15438)"
                        transition={{
                          duration: 0.1,
                        }}
                      />
                    </g>
                  </motion.svg>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </button>
      {!session && isDialogOpen && (
        <CofirmSinginDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
      )}
    </>
  );
};

const CofirmSinginDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) => {
  const router = useRouter();

  const form = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginFormSchema),
  });

  const login = async (data: LoginForm) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      alert("could not login your account");
    } else {
      router.push("/");
    }
  };

  const handleSubmit: SubmitHandler<LoginForm> = async (data) => {
    login(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>無料登録して鳥さんをメデましょう</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-5 bg-white rounded-20 max-w-[388px] w-full p-10 max-sm:p-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col w-full gap-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Input
                    label="メールアドレス"
                    requirement="required"
                    placeholder="user@example.com"
                    className="w-full"
                    error={!!fieldState.error}
                    {...field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Input
                    label="パスワード"
                    type="password"
                    requirement="required"
                    placeholder="6文字以上入力してください"
                    className="w-full"
                    error={!!fieldState.error}
                    {...field}
                  />
                )}
              />
              <Button
                size={"lg"}
                type="submit"
                className="w-full justify-center"
              >
                ログイン
              </Button>
            </form>
          </Form>
          <Button
            iconLeft={<SVGIcon svg={GoogleIcon} className="w-6" />}
            colorTheme={"outline"}
            className="w-full justify-center"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            Googleアカウントでログイン
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
