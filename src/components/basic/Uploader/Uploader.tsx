"use client";

import UploadIcon from "@/components/assets/icon/upload.svg";
import XmarkIcon from "@/components/assets/icon/x-mark.svg";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FormLabel } from "@/components/basic/FormLabel";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { Button } from "@/components/basic/Button";
import { RoundButton } from "@/components/basic/RoundButton";
import Image from "next/image";

const uploaderStylesProps = cva(
  "relative rounded-md border border-2 border-dashed boder-primary-100 transition-all [&>input]:block [&>input]:cursor-pointer [&>input]:absolute [&>input]:top-0 [&>input]:left-0 [&>input]:h-full [&>input]:z-10",
  {
    variants: {
      size: {
        md: "max-h-[228px] h-full bg-primary-50 py-10 md:h-[228px] max-sm:py-5",
      },
      colorTheme: {
        primary: "hover:border-primary-700",
      },
      isPreview: {
        true: "bg-base-content border-solid h-[228px]",
        false: "",
      },
      isError: {
        true: "bg-tertialy-bloodOrange-50 border-state-error hover:border-state-error",
        false: "",
      },
      isDesabled: {
        true: "bg-primary-50 border-primary-50 hover:border-primary-50 pointer-events-none",
        false: "",
      },
      isDragging: {
        true: "text-base-content bg-primary-700",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      colorTheme: "primary",
      isError: false,
      isDesabled: false,
    },
  }
);

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof uploaderStylesProps> & {
    label?: string;
    requirement?: "optional" | "required";
    error?: boolean;
    previewClassName?: string;
    image?: string;
    onResetFile?: () => void;
  };

export const Uploader = ({
  size,
  className,
  label,
  colorTheme,
  requirement,
  disabled,
  error = false,
  previewClassName,
  image,
  onResetFile,
  ...props
}: InputProps) => {
  const [preview, setPreview] = useState<string | null>(image ?? null);
  const [filename, setFilename] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (error) {
      // エラーがある場合はプレビューとファイル名をクリア
      setPreview(null);
      setFilename(null);
      // onResetFileを実行してファイルのセット状態を空にしてしまうと常にエラーメッセージが「画像を設定してください」になってしまうため、
      // ここでは一旦実行しないようにする
      // onResetFile?.();
      if (uploadInputRef.current) {
        uploadInputRef.current.value = "";
      }
    }
  }, [error, preview]);

  /**
   * ファイルプレビュー用の処理（既存のhandleFileChangeを少し編集）
   */
  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) {
      setPreview(null);
      setFilename(null);
      onResetFile?.();
      return;
    }

    const file = files[0];
    setFilename(file.name);

    props.onChange?.({
      // onChangeを手動でトリガーするためのEventのmock
      // フォームライブラリのバリデーション等を想定している場合に必要
      target: { files },
    } as React.ChangeEvent<HTMLInputElement>);

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Inputで通常のファイル選択が行われた場合
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
  };

  /**
   * ドラッグ&ドロップ
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
      // 一度ドロップしたファイル情報をクリアしておく（再ドロップ時の不具合防止）
      e.dataTransfer.clearData();
    }
  };

  const resetPreview = () => {
    setPreview(null);
    setFilename(null);
    if (uploadInputRef.current) {
      uploadInputRef.current.value = "";
    }

    onResetFile?.();
  };

  return (
    <FormItem className={cn("flex flex-col", className)}>
      {label && <FormLabel requirement={requirement}>{label}</FormLabel>}
      <FormControl>
        <div className="flex flex-col">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              uploaderStylesProps({
                size,
                colorTheme,
                isDragging: isDragging && !error ? true : false,
                isPreview: preview ? true : false,
                isDesabled: disabled ? true : false,
                isError: error ? true : false,
              }),
              className
            )}
          >
            {!disabled && (
              <Input
                disabled={disabled}
                className="opacity-0 p-0"
                ref={uploadInputRef}
                {...props}
                type="file"
                onChange={handleInputChange}
                accept="image/*"
              />
            )}
            {!preview && (
              <div className="relative flex flex-col items-center justify-center">
                <SVGIcon
                  svg={UploadIcon}
                  className={`w-12 text-primary-700 block mb-10 max-sm:hidden ${
                    isDragging && !error && "text-white"
                  }`}
                />
                <Button colorTheme={"outline"} size={"sm"}>
                  画像を選択
                </Button>
                <div className="mt-2 max-sm:hidden">
                  {isDragging ? (
                    <p className="text-center text-sm">
                      ここにファイルをドロップ
                    </p>
                  ) : (
                    <p className="text-center text-sm">
                      またはドラッグ&ドロップ
                    </p>
                  )}
                </div>
              </div>
            )}
            {preview && !error && (
              <div className="absolute top-0 h-full w-full flex items-center justify-center">
                <Image
                  src={preview}
                  alt="Preview"
                  className="max-w-full h-full object-contain"
                  fill
                />
                {!disabled && (
                  <RoundButton
                    type="button"
                    colorTheme="white"
                    size={"sm"}
                    className="absolute top-[10px] right-[10px] z-20"
                    icon={
                      <SVGIcon
                        svg={XmarkIcon}
                        className="w-3 text-primary-700"
                      />
                    }
                    onClick={resetPreview}
                  />
                )}
              </div>
            )}
          </div>
          {filename && (
            <p className="text-typography-xs text-textColor-basic font-medium leading-normal mt-1">
              {filename}
            </p>
          )}
        </div>
      </FormControl>
      <FormMessage className="!mt-1 text-state-error letter-spacing-[0] text-xs" />
    </FormItem>
  );
};
