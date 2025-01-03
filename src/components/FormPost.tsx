"use client";

import {
  FC,
  useState,
  useRef,
  ChangeEvent,
  useCallback,
  useEffect,
} from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  createPostSchema,
  updatePostBodySchema,
  EditPost,
} from "@/app/api/post/model";
import { FormInputPost, Tag } from "@/types";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/basic/MultiSelect";

interface FromPostProps {
  submit: SubmitHandler<FormInputPost>;
  isEditing: boolean;
  initialValue?: EditPost;
  isLoadingSubmit: boolean;
}

const FormPost: FC<FromPostProps> = ({
  submit,
  isEditing,
  initialValue,
  isLoadingSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<EditPost>({
    mode: "onChange",
    resolver: zodResolver(isEditing ? updatePostBodySchema : createPostSchema),
    defaultValues: initialValue
      ? initialValue
      : { title: "", content: "", tags: [], image: "" },
  });

  const handleFormSubmit: SubmitHandler<FormInputPost> = async (data) => {
    setIsSubmitting(true);

    const imageUrl = isEditing
      ? initialValue?.image
      : await uploadImage(imageFile, data.image || "");

    if (!imageUrl) {
      setIsSubmitting(false);
      return;
    }
    submit({ ...data, image: imageUrl });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      setImageFile(files[0]);
    }
  };

  const uploadImage = async (file: File | null, currentImage: string) => {
    if (!file) {
      return currentImage || "";
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("/api/post/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status !== 200) {
        console.error("Image upload failed");
        return null;
      }
      return res.data.fileUrl;
    } catch (error) {
      console.error("Image upload failed", error);
      return null;
    }
  };

  // TODO: useQueryを使って取得する必要が無いのでprisma clientから取得するなど検討する
  const { data: dataTags, isLoading: isLoadingTags } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await axios.get("/api/tag");
      return response.data;
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col items-center justify-center gap-5 mt-10"
        >
          {isEditing && initialValue?.image && (
            <Image
              src={initialValue.image}
              width="300"
              height="300"
              alt="selected image"
            />
          )}

          {/* 画像アップロード欄 （作成時のみ表示） */}
          {!isEditing && (
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="w-full max-w-lg">
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      className="input input-bordered w-full max-w-lg"
                      // react-hook-formの field に紐付けるなら onChange etc.を手動対応
                      // or ここでは handleFileChange で間接的に管理
                      onChange={(e) => {
                        handleFileChange(e);
                        field.onChange(e.target.files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* タイトル */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full max-w-lg">
                <FormLabel>Post title</FormLabel>
                <FormControl>
                  <Input placeholder="Post title..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* コンテンツ */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full max-w-lg">
                <FormLabel>Post content</FormLabel>
                <FormControl>
                  <Textarea placeholder="Post content..." rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* タグ */}
          {isLoadingTags ? (
            <span className="loading loading-dots loading-md"></span>
          ) : (
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="w-full max-w-lg">
                  <FormControl>
                    <MultiSelect
                      label="タグ"
                      options={dataTags}
                      defaultValue={field.value}
                      onChange={(selectedValues) => {
                        const selectedValueIds = selectedValues.map(
                          (value) => value.id
                        );
                        field.onChange(selectedValueIds);
                      }}
                      renderOption={(tag) => tag.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* 送信ボタン */}
          <button
            type="submit"
            className="btn bg-yellow-400 hover:bg-yellow-500 w-full max-w-lg text-gray-900"
            disabled={isSubmitting || isLoadingSubmit}
          >
            {isLoadingSubmit && (
              <span className="loading loading-spinner"></span>
            )}
            {isEditing
              ? isLoadingSubmit
                ? "Updating..."
                : "Update"
              : isLoadingSubmit
              ? "Creating..."
              : "Create"}
          </button>
        </form>
      </Form>

      {!isSubmitting && <ConfirmDialog disabled={!form.formState.isDirty} />}
    </>
  );
};

type ConfirmModalProps = {
  disabled: boolean;
};

const ConfirmDialog: FC<ConfirmModalProps> = ({ disabled }) => {
  const router = useRouter();
  const modalRef = useRef<HTMLDialogElement>(null);
  const [nextRoute, setNextRoute] = useState<string | null>(null);
  const [isBack, setIsBack] = useState(false);
  const originalPush = useRef(router.push);
  const originalBack = useRef(router.back);

  const handleOpenModal = () => modalRef.current?.showModal();

  const handleConfirm = () => {
    modalRef.current?.close();

    // ページ遷移を実行する前にイベントリスナーを削除
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

  useEffect(() => {
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, [beforeUnloadHandler]);

  useEffect(() => {
    if (!disabled) {
      const handleRouteChange = (
        url: string,
        isBackAction: boolean = false
      ) => {
        setNextRoute(url);
        setIsBack(isBackAction);
        handleOpenModal();
        // throw "Route change blocked.";
      };

      router.push = async (url) => {
        handleRouteChange(url);
      };

      router.back = () => {
        handleRouteChange(document.referrer, true);
      };

      const currentPush = originalPush.current;
      const currentBack = originalBack.current;
      return () => {
        router.push = currentPush;
        router.back = currentBack;
      };
    }
  }, [disabled, router]);

  return (
    <dialog
      ref={modalRef}
      role="dialog"
      id="my_modal_5"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Navigation</h3>
        <p className="py-4">
          You have unsaved changes. Do you really want to leave?
        </p>
        <div className="modal-action">
          <form method="dialog">
            <div className="flex gap-3">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleConfirm}
              >
                OK
              </button>
              <button className="btn">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default FormPost;
