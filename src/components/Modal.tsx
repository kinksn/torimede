"use client";

import { usePathname } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { historyIndexTrackerIndexAtom } from "@/lib/globalState/historyIndexTrackerIndexAtom";

const Modal = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const dialogRef = useRef<ElementRef<"dialog">>(null);
  const [currentPath, _setCurrentPath] = useState(pathname);
  const [historyIndex] = useAtom(historyIndexTrackerIndexAtom);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  useEffect(() => {
    if (pathname !== currentPath) {
      // URL が変わった場合、モーダルを閉じる
      dialogRef.current?.close();
    }
  }, [pathname, currentPath]);

  function onDismiss() {
    history.go(-historyIndex);
  }

  return (
    <dialog id="my_modal_3" ref={dialogRef} className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onDismiss}
          >
            ✕
          </button>
        </form>
        {children}
      </div>
    </dialog>
  );
};

export default Modal;
