"use client";

import { usePathname } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import { initialPagePath as atomInitialPagePath } from "@/lib/atom/initialPagePath";
import { InitialPagePathSetter } from "@/components/InitialPagePathSetter";
import { useRouter } from "next/navigation";

const Modal = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const dialogRef = useRef<ElementRef<"dialog">>(null);
  const [currentPath, _setCurrentPath] = useState(pathname);
  const initialPagePath = useAtomValue(atomInitialPagePath);
  const router = useRouter();

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
    router.push(initialPagePath);
  }

  return (
    <dialog id="my_modal_3" ref={dialogRef} className="modal">
      <InitialPagePathSetter />
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
