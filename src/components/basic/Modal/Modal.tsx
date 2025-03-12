"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/basic/Button";
import { TextButton } from "@/components/basic/TextButton";
import { cn } from "@/lib/utils";
import { breakText } from "@/lib/util/breakText";

type ModalProps = React.ButtonHTMLAttributes<HTMLDivElement> &
  React.ComponentProps<typeof DialogPrimitive.Root> & {
    title: string;
    titleClassName?: string;
    description?: string;
    headerClassName?: string;
    children?: React.ReactNode;
    childrenClassName?: string;
    triggerContent?: React.ReactNode;
    triggerContentClassName?: string;
    isShowFooter?: boolean;
    footerClassName?: string;
    submit?: () => void;
    submitButtonType?: "fill" | "text";
    submitButtonLabel?: string;
    submitClassName?: string;
    submitButtonIcon?: React.ReactNode;
    close?: () => void;
    closeButtonLabel?: string;
    closeClassName?: string;
    closeButtonType?: "text" | "outline";
  };

export const Modal = ({
  title,
  titleClassName,
  description,
  headerClassName,
  className,
  children,
  childrenClassName,
  triggerContent,
  triggerContentClassName,
  isShowFooter = true,
  footerClassName,
  open,
  onOpenChange,
  submit,
  submitButtonLabel = "保存",
  submitClassName,
  submitButtonType = "fill",
  submitButtonIcon,
  close,
  closeButtonLabel = "キャンセル",
  closeClassName,
  closeButtonType = "text",
}: ModalProps) => {
  const handleSubmit = () => {
    submit?.();
    onOpenChange?.(false);
  };

  const handleClose = () => {
    close?.();
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!!triggerContent && (
        <DialogTrigger
          role="button"
          tabIndex={0}
          className={triggerContentClassName}
          asChild
        >
          <div>{triggerContent}</div>
        </DialogTrigger>
      )}
      <DialogContent
        className={cn("max-sm:w-[89.3333%]", className)}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogHeader
          className={cn(
            "whitespace-pre-line max-sm:whitespace-normal text-left",
            headerClassName
          )}
        >
          <DialogTitle id="dialog-title" className={titleClassName}>
            {breakText(title)}
          </DialogTitle>
          {description && (
            <DialogDescription id="dialog-description">
              {breakText(description)}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className={childrenClassName}>{children}</div>
        {isShowFooter && (
          <DialogFooter className={cn("gap-2 flex-row", footerClassName)}>
            <DialogClose asChild>
              {closeButtonType === "outline" ? (
                <Button
                  colorTheme="outline"
                  className={cn("", closeClassName)}
                  onClick={handleClose}
                >
                  {closeButtonLabel}
                </Button>
              ) : (
                <TextButton
                  className={cn("", closeClassName)}
                  onClick={handleClose}
                >
                  {closeButtonLabel}
                </TextButton>
              )}
            </DialogClose>
            {submitButtonType === "fill" ? (
              <Button
                type="submit"
                onClick={handleSubmit}
                className={cn("", submitClassName)}
                iconLeft={submitButtonIcon}
              >
                {submitButtonLabel}
              </Button>
            ) : (
              <TextButton
                type="submit"
                onClick={handleSubmit}
                className={cn("", submitClassName)}
                icon={submitButtonIcon}
              >
                {submitButtonLabel}
              </TextButton>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
