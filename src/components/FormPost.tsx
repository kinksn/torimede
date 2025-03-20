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
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/basic/Input";
import { Textarea } from "@/components/basic/Textarea";
import { MultiSelect } from "@/components/basic/MultiSelect";
import { Uploader } from "@/components/basic/Uploader";
import { Tag } from "@prisma/client";
import { Session } from "next-auth";
import { TagEditMenu } from "@/components/TagEditMenu";
import { Button } from "@/components/basic/Button";
import { toast } from "sonner";
import { Modal } from "@/components/basic/Modal";
import { FormInputPost } from "@/app/api/_common/model/form";

interface FromPostProps {
  submit: SubmitHandler<FormInputPost>;
  type?: "post" | "edit";
  initialValue?: EditPost;
  tags?: Tag[];
  session: Session | null;
  isSubmitPending: boolean;
}

const FormPost: FC<FromPostProps> = ({
  submit,
  type = "post",
  initialValue,
  tags,
  session,
  isSubmitPending,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File[]>([]);

  const form = useForm<EditPost>({
    mode: "onChange",
    resolver: zodResolver(
      type === "edit" ? updatePostBodySchema : createPostSchema
    ),
    defaultValues: initialValue
      ? initialValue
      : { title: "", content: "", tags: [], images: [] },
  });

  const handleFormSubmit: SubmitHandler<FormInputPost> = async (data) => {
    try {
      setIsSubmitting(true);
      const imageUrl =
        type === "edit"
          ? initialValue?.images[0].url
          : await uploadImage(imageFile[0]);

      if (!imageUrl) {
        setIsSubmitting(false);
        return;
      }

      const images = [{ url: imageUrl, alt: data.title }];

      await submit({ ...data, images });
    } catch (error) {
      console.error("submit failed :", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // 既存の画像と新しい画像を結合
      setImageFile((prevFiles) =>
        Array.from(files).reduce((acc, file) => {
          // 重複チェック（必要に応じて）
          if (!acc.some((f) => f.name === file.name && f.size === file.size)) {
            return [...acc, file];
          }
          return acc;
        }, prevFiles)
      );
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("/api/upload/image", formData, {
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
      toast.success("タグを作成しました");
      return data;
    } catch (error) {
      console.error("Failed to create new tag", error);
      return null;
    }
  };

  const submitButtonLabel = (
    type: FromPostProps["type"],
    isSubmitting: boolean
  ) => {
    if (type === "edit") {
      return isSubmitting ? "保存中" : "保存";
    } else {
      return isSubmitting ? "投稿中" : "投稿";
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
            name="images"
            render={({ field, fieldState }) => (
              <Uploader
                label="画像"
                requirement="required"
                className="w-full"
                error={!!fieldState.error}
                disabled={type === "edit"}
                onResetFile={() => {
                  field.onChange([]);
                  setImageFile([]);
                }}
                {...(type === "edit" && { image: initialValue?.images[0].url })}
                onChange={(e) => {
                  handleFileChange(e);
                  const files = e.target.files;
                  if (!files?.length) return;
                  // 「複数ファイルを選択 or ドラッグ」しても、最後の1枚だけ使う
                  // 1投稿に対して複数投稿できるようにする際には処理を変える必要あり
                  const lastFile = files[files.length - 1];
                  setImageFile([lastFile]);
                  // RHF側も常に最後の1つだけをセット
                  field.onChange([lastFile]);
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
            disabled={isSubmitting}
          >
            {submitButtonLabel(type, isSubmitting)}
          </Button>
        </form>
      </Form>

      {!isSubmitting && !isSubmitPending && form.formState.isDirty && (
        <ConfirmDialog disabled={!form.formState.isDirty} />
      )}
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
    <Modal
      title="フォームを離れますか？"
      description="入力中のデータはリセットされます。<br />よろしいでしょうか？"
      open={open}
      onOpenChange={setOpen}
      submit={() => setOpen(false)}
      submitButtonLabel="留まる"
      close={handleConfirm}
      closeButtonLabel="離れる"
    />
  );
};

export default FormPost;
