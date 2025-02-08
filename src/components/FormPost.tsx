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
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  createPostSchema,
  updatePostBodySchema,
  EditPost,
} from "@/app/api/post/model";
import { FormInputPost } from "@/types";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/basic/Input";
import { Textarea } from "@/components/basic/Textarea";
import { MultiSelect } from "@/components/basic/MultiSelect";
import { Uploader } from "@/components/basic/Uploader";
import { Tag } from "@prisma/client";
import { Session } from "next-auth";
import { TagEditMenu } from "@/components/TagEditMenu";
import { Button } from "@/components/basic/Button";
import { TextButton } from "@/components/basic/TextButton";

interface FromPostProps {
  submit: SubmitHandler<FormInputPost>;
  isEditing?: boolean;
  initialValue?: EditPost;
  tags?: Tag[];
  session: Session | null;
  isLoadingSubmit: boolean;
}

const FormPost: FC<FromPostProps> = ({
  submit,
  isEditing,
  initialValue,
  tags,
  session,
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

  const createNewTag = async (tagName: string) => {
    try {
      const { data } = await axios.post("/api/tag", {
        name: tagName,
      });
      return data;
    } catch (error) {
      console.error("Failed to create new tag", error);
      return null;
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col items-center justify-center gap-5 mx-auto max-w-lg"
        >
          {/* 画像アップロード */}
          <FormField
            control={form.control}
            name="image"
            render={({ field, fieldState }) => (
              <Uploader
                label="画像"
                requirement="required"
                className="w-full"
                error={!!fieldState.error}
                disabled={isEditing}
                {...(isEditing && { image: initialValue?.image })}
                onChange={(e) => {
                  handleFileChange(e);
                  field.onChange(e.target.files);
                }}
              />
            )}
          />

          {/* タイトル */}
          <FormField
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Input
                label="タイトル"
                requirement="required"
                placeholder="Post title..."
                className="w-full"
                error={!!fieldState.error}
                {...field}
              />
            )}
          />

          {/* コンテンツ */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <Textarea
                label="説明"
                placeholder="例）生後4日のヒナがかわい過ぎた #ヒナ好きと繋がりたい"
                className="w-full"
                {...field}
              />
            )}
          />

          {/* タグ */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="w-full max-w-lg">
                <FormControl>
                  <MultiSelect
                    label="タグ"
                    options={tags}
                    defaultValue={field.value}
                    onChange={(selectedValues) => {
                      const selectedValueIds = selectedValues.map(
                        (value) => value.id
                      );
                      field.onChange(selectedValueIds);
                    }}
                    renderOption={(tag) => tag.name}
                    onCreateNewOption={createNewTag}
                    itemMenu={(tag) => {
                      return (
                        session?.user?.id &&
                        session?.user?.id === tag.userId && (
                          <TagEditMenu tag={tag} />
                        )
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 送信ボタン */}
          <Button
            type="submit"
            size={"lg"}
            className="w-full justify-center mt-5"
            disabled={isSubmitting || isLoadingSubmit}
          >
            {isLoadingSubmit && (
              <span className="loading loading-spinner"></span>
            )}
            {isEditing
              ? isLoadingSubmit
                ? "保存中"
                : "保存"
              : isLoadingSubmit
              ? "投稿中"
              : "投稿"}
          </Button>
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
  const [open, setOpen] = useState(false);
  const [nextRoute, setNextRoute] = useState<string | null>(null);
  const [isBack, setIsBack] = useState(false);

  // もともと router.push/back を保持する
  const originalPush = useRef(router.push);
  const originalBack = useRef(router.back);

  // モーダル「OK」時の挙動
  const handleConfirm = () => {
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-sm:w-[calc(100%-40px)]">
        <DialogHeader className="max-sm:text-left">
          <DialogTitle>フォームを離れますか？</DialogTitle>
          <DialogDescription>
            入力中のデータはリセットされます。
            <br className="max-sm:hidden" />
            よろしいでしょうか？
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-3 max-sm:flex-row">
          <TextButton onClick={handleConfirm}>離れる</TextButton>
          <Button onClick={() => setOpen(false)}>キャンセル</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormPost;
