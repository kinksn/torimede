"use client";

import axios from "axios";
import SpinnerIcon from "@/components/assets/icon/color-fixed/spinner.svg";
import Cropper, { Area } from "react-easy-crop";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { UpdateUserInput, userNameSchema } from "@/app/api/user/model";
import { useMutation } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { staticProfileIconList } from "@/lib/util/staticProfileIconList";
import { Avatar } from "@/components/basic/Avatar";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/basic/Input";
import { Button } from "@/components/basic/Button";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/basic/Modal";
import { TermsText } from "@/app/terms/TermsPage";
import { PrivacyText } from "@/app/privacy/PrivacyPage";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getCroppedImg } from "@/app/edit/[id]/getCroppedImg";
import { AvatarSelector } from "@/components/basic/AvatarSelector";
import { Slider } from "@/components/basic/Slider";
import { UIBlocker } from "@/components/UIBlocker";
import { useUIBlock } from "@/hooks/useUIBlock";

type ChangeProfileProps = {
  session: Session | null;
};

const formSchema = z.object({
  name: userNameSchema,
  image: z.string(),
});
type Form = z.infer<typeof formSchema>;

export const ChangeProfile = ({ session }: ChangeProfileProps) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // トリミング後の画像データ
  // このデータのfileプロパティが最終的に api/upload/image のbodyに渡されてアップロードされる
  const [uploadProfileImagePreview, setUploadProfileImagePreview] = useState<
    string | null
  >(null);
  //
  const [uploadedProfileImage, setUploadedProfileImage] = useState<
    string | null
  >(null);
  // 元ファイルのファイル名(拡張子除く)
  const [baseName, setBaseName] = useState("cropped-image");
  // 元ファイルのMIME Type
  const [originalMimeType, setOriginalMimeType] = useState("image/jpeg");

  /** react-easy-crop 周りのステート */
  // アップロードした画像のURL
  const [imgSrc, setImgSrc] = useState("");
  // トリミング範囲の座標
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  // トリミング範囲の拡大率
  const [zoom, setZoom] = useState(1);
  // トリミング画像の座標、バイナリデータ生成のために必要
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  const { block, unblock } = useUIBlock();

  const router = useRouter();

  const { update } = useSession();
  const userId = session?.user?.id;
  const userName = session?.user?.name || "";
  const defaultUserImage =
    session?.user?.image || staticProfileIconList[0].imageURL;
  const form = useForm<Form>({
    defaultValues: { name: userName, image: defaultUserImage },
    resolver: zodResolver(formSchema),
  });

  const checkFirstLogin = async () => {
    try {
      const updatedSession = await update({ forceRefresh: Date.now() });
      if (updatedSession?.user?.isFirstLogin === false) {
        // TODO: 本番環境でrouter.push()でもいけるか調べる
        location.href = "/";
      } else {
        await update();
        // 状態が更新されるまでポーリング
        setTimeout(checkFirstLogin, 500); // 0.5秒後に再確認
      }
    } catch {
      console.error("failt to get session");
    }
  };

  const { mutate: updateProfile } = useMutation({
    mutationFn: ({
      name,
      image,
      uploadProfileImage,
      isFirstLogin,
    }: UpdateUserInput) => {
      block();
      return axios.patch(`/api/user/${userId}`, {
        name,
        image,
        isFirstLogin,
        uploadProfileImage,
      });
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast.error("プロフィールの更新に失敗しました");
      console.error(error);
    },
    onSuccess: async (result) => {
      checkFirstLogin();
      setIsSubmitting(false);
      const updateImageUrl = result.data.updateResult.image;
      setUploadedProfileImage(updateImageUrl);
      form.setValue("image", updateImageUrl);
      unblock();
      router.refresh();
    },
  });

  /**
   * ファイルアップロード後
   * 画像ファイルのURLをセットしモーダルを表示する
   */
  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // オブジェクトURLを生成してCropperに渡せる形にする
      // createObjectURLを使うことで `blob:`プロトコルで始まる
      // ブラウザのメモリ上のバイナリデータを参照できるようになる
      const objectUrl = URL.createObjectURL(file);
      setImgSrc(objectUrl);

      // MIME typeを保持
      setOriginalMimeType(file.type);

      // getCroppedImg.tsの中で元となるファイルの拡張子によって出力する拡張子を決める処理がある
      // そのためにここでファイル名だけ抽出している
      // 例）"myPhoto.png" → ["myPhoto", "png"] → baseName = "myPhoto"
      const parts = file.name.split(".");
      parts.pop(); // 拡張子を取り除く
      setBaseName(parts.join(".") || "cropped-image");

      setIsShowModal(true);

      e.target.value = "";
    },
    []
  );

  // トリミング終了時に座標をstateに格納
  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  // トリミング後の画像を File 化 → state に格納
  const makeCroppedImage = async (): Promise<File | null> => {
    if (!imgSrc || !croppedAreaPixels) return null;

    // トリミング画像のバイナリデータを取得
    const file = await getCroppedImg(
      imgSrc,
      croppedAreaPixels,
      baseName, // 例: "myPicture"
      originalMimeType // 例: "image/png"
    );
    if (!file) return null;

    // 以前のオブジェクトURLがあれば解放
    if (uploadProfileImagePreview) {
      URL.revokeObjectURL(uploadProfileImagePreview);
    }

    // トリミング画像のURLを取得してstate変数にセット
    const newBlobUrl = URL.createObjectURL(file);
    form.setValue("image", newBlobUrl);

    setIsShowModal(false);

    return file;
  };

  // トリミング後のFileをS3へアップロード
  const handleUploadCroppedImage = async () => {
    if (!uploadProfileImagePreview) return;
    // ボタン押下で直接クロップ＆アップロードしたい場合
    const file = await makeCroppedImage();
    if (!file) {
      // トリミングに失敗
      console.error("Cropping failed or no file returned");
      return null;
    }

    // アップロード
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 && res.data?.fileUrl) {
        const s3Url = res.data.fileUrl;
        return s3Url;
      }
    } catch (err) {
      toast.error("アップロードに失敗しました");
      console.error(err);
    } finally {
      setIsShowModal(false);
    }

    return null;
  };

  const onModalClose = () => {
    if (imgSrc) {
      URL.revokeObjectURL(imgSrc);
      setImgSrc("");
    }
    setIsShowModal(false);
    setUploadProfileImagePreview(null);
    setZoom(1);
  };

  const handleFormSubmit: SubmitHandler<
    Omit<UpdateUserInput, "isFirstLogin">
  > = async ({ name, image }) => {
    setIsSubmitting(true);
    const uploadProfileImage = await handleUploadCroppedImage();
    updateProfile({
      name,
      image,
      isFirstLogin: false,
      ...(uploadProfileImage && { uploadProfileImage }),
    });
  };

  return (
    <div className="flex flex-col justify-center items-center max-w-[460px] mx-auto h-screen max-sm:h-auto px-5 pt-20 max-sm:pt-10 pb-10 max-sm:pb-5">
      <div>
        <h1 className="text-typography-xxxl max-sm:text-typography-xxl max-sm:font-bold text-center text-primary-700 font-zenMaruGothic font-bold">
          トリメデにようこそ！
        </h1>
        <p className="text-center">
          アイコンと表示名を
          <br className="hidden max-sm:block" />
          変更することができます
        </p>
        <small className="block text-center font-bold mt-1">
          （<span className="text-primary-700">*</span>
          マイページからいつでも変更できます）
        </small>
      </div>
      <UIBlocker />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-10 items-center justify-center bg-white rounded-20 mt-5 w-full p-10"
        >
          <div className="flex flex-col w-full max-sm:gap-2 max-sm:w-full">
            {/* プロフィール画像選択 */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormControl>
                    <AvatarSelector
                      profileImage={field.value}
                      previewProfileImage={uploadProfileImagePreview}
                      avatarTrigger={
                        <input
                          type="file"
                          className="absolute block top-0 left-0 opacity-0 w-full h-full cursor-pointer text-[0px]"
                          onChange={onFileChange}
                        />
                      }
                      popoverContent={
                        <div className="grid grid-cols-3 gap-4 w-fit">
                          {uploadedProfileImage && (
                            <Avatar
                              profileImage={uploadedProfileImage}
                              onClick={() =>
                                field.onChange(uploadedProfileImage)
                              }
                              size="lg"
                              isHoverActive
                            />
                          )}
                          {session?.user?.oAuthProfileImage && (
                            <Avatar
                              profileImage={session.user.oAuthProfileImage}
                              onClick={() =>
                                field.onChange(
                                  session?.user?.oAuthProfileImage ||
                                    staticProfileIconList[0].imageURL
                                )
                              }
                              size="lg"
                              isHoverActive
                            />
                          )}
                          {staticProfileIconList
                            .filter(
                              (icon) =>
                                icon.imageURL !==
                                session?.user?.oAuthProfileImage
                            )
                            .map((icon) => (
                              <Avatar
                                key={icon.imageURL}
                                profileImage={icon.imageURL}
                                onClick={() => {
                                  setUploadProfileImagePreview(null);
                                  field.onChange(icon.imageURL);
                                }}
                                size="lg"
                                isContentActive={field.value === icon.imageURL}
                                isHoverActive
                              />
                            ))}
                        </div>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* 表示名入力 */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  type="text"
                  label="表示名"
                  placeholder="表示名を入力してください"
                  error={!!fieldState.error}
                  className="w-[inherit]"
                  {...field}
                />
              )}
            />
          </div>
          <footer className="flex gap-2 justify-end w-full max-sm:p-0 max-sm:flex-row max-sm:max-w-[296px] max-sm:w-full">
            <div className="flex flex-col gap-2 w-full">
              <div className="text-typography-xs leading-loose text-center">
                <Modal
                  title="利用規約"
                  triggerContent={
                    <p className="font-bold text-textColor-link underline">
                      利用規約
                    </p>
                  }
                  childrenClassName="h-[40svh] overflow-y-scroll"
                  triggerContentClassName="inline"
                  isShowFooter={false}
                >
                  <TermsText />
                </Modal>
                と
                <Modal
                  title="プライバシーポリシー"
                  triggerContent={
                    <p className="font-bold text-textColor-link underline">
                      プライバシーポリシー
                    </p>
                  }
                  childrenClassName="h-[40svh] overflow-y-scroll"
                  triggerContentClassName="inline"
                  isShowFooter={false}
                >
                  <PrivacyText />
                </Modal>
                をご確認の上、
                <br />
                以下のボタンを押すとサービスをご利用いただけます。
              </div>
              <Button
                size={"lg"}
                type="submit"
                className="w-full justify-center whitespace-nowrap"
                disabled={isSubmitting}
                iconLeft={
                  isSubmitting ? (
                    <SVGIcon svg={SpinnerIcon} className="w-6 animate-spin" />
                  ) : (
                    <></>
                  )
                }
              >
                規約に同意してはじめる
              </Button>
            </div>
          </footer>
        </form>
      </Form>
      <Modal
        title="画像をトリミング"
        open={isShowModal}
        onOpenChange={setIsShowModal}
        submitButtonLabel="決定"
        submit={makeCroppedImage}
        close={onModalClose}
        className="max-w-[600px] max-sm:max-w-[100%] w-full max-sm:w-full max-sm:h-screen max-sm:auto-rows-max"
        footerClassName="pt-5"
      >
        <div className="flex flex-col gap-5">
          <div className="w-full aspect-[3/2] relative rounded-md overflow-hidden">
            <Cropper
              // Cropperが画像を読み込むにはバイナリデータのURLを渡す必要がある
              image={imgSrc}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.01}
              className="w-full"
              onValueChange={(value) => {
                setZoom(value[0]);
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
