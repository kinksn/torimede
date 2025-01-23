"use client";

import { useAtom } from "jotai";
import { historyIndexTrackerIndexAtom } from "@/lib/globalState/historyIndexTrackerIndexAtom";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Modal = ({ children }: { children: React.ReactNode }) => {
  const [historyIndex] = useAtom(historyIndexTrackerIndexAtom);

  function onDismiss() {
    history.go(-historyIndex);
  }

  return (
    <Dialog defaultOpen onOpenChange={onDismiss}>
      <DialogContent
        className="max-h-[98svh] p-0 h-full bg-base-bg translate-x-0 translate-y-0 overflow-y-scroll bottom-0 w-full rounded-br-none rounded-bl-none data-[state=open]:!animate-slideUp data-[state=closed]:!animate-slideDown"
        style={{ top: "unset", left: "unset" }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
