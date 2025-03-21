"use client";

import { Modal } from "@/components/basic/Modal";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type ConfirmModalProps = {
  disabled: boolean;
  title?: string;
  description?: string;
  submitButtonLabel?: string;
  closeButtonLabel?: string;
};

export const ConfirmModal = ({
  disabled,
  title = "フォームを離れますか？",
  description = "入力中のデータはリセットされます。<br />よろしいでしょうか？",
  submitButtonLabel = "留まる",
  closeButtonLabel = "離れる",
}: ConfirmModalProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [nextRoute, setNextRoute] = useState<string | null>(null);
  const [isBack, setIsBack] = useState(false);
  const hasHandledConfirm = useRef(false);

  // もともと router.push/back を保持する
  const originalPush = useRef(router.push);
  const originalBack = useRef(router.back);

  const handleConfirm = () => {
    // すでに1度呼び出されていたら何もしない
    if (hasHandledConfirm.current) return;
    hasHandledConfirm.current = true;

    setOpen(false);
    window.removeEventListener("beforeunload", beforeUnloadHandler);

    if (isBack) {
      originalBack.current();
      return;
    }
    if (nextRoute) {
      originalPush.current(nextRoute);
      return;
    }
  };

  // beforeUnload イベント
  const beforeUnloadHandler = useCallback(
    (event: BeforeUnloadEvent) => {
      if (!disabled) {
        event.preventDefault();
        // これがないとChromeで動作しない
        event.returnValue = "";
      }
    },
    [disabled]
  );

  // ページ離脱時のダイアログ表示設定
  useEffect(() => {
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, [beforeUnloadHandler]);

  // router の push/back をフックして確認モーダルを表示する
  useEffect(() => {
    if (!disabled) {
      const handleRouteChange = (url: string, isBackAction = false) => {
        setNextRoute(url);
        setIsBack(isBackAction);
        setOpen(true);
      };

      // router.push を上書き
      router.push = async (url) => {
        handleRouteChange(url);
      };

      // router.back を上書き
      router.back = () => {
        handleRouteChange(document.referrer, true);
      };

      // cleanup で元に戻す
      const currentPush = originalPush.current;
      const currentBack = originalBack.current;
      return () => {
        router.push = currentPush;
        router.back = currentBack;
      };
    }
  }, [disabled, router]);

  // モーダルの描画
  return (
    <Modal
      title={title}
      description={description}
      open={open}
      onOpenChange={setOpen}
      submit={() => setOpen(false)}
      submitButtonLabel={submitButtonLabel}
      close={handleConfirm}
      closeButtonLabel={closeButtonLabel}
      onPointerDownOutside={(e) => e.preventDefault()}
      className="[&>button]:hidden"
    />
  );
};
