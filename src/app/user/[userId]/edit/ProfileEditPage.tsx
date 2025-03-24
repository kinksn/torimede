"use client";

import axios from "axios";
import Cropper, { Area } from "react-easy-crop";
import SpinnerIcon from "@/components/assets/icon/color-fixed/spinner.svg";
import imageCompression from "browser-image-compression";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { useCallback, useState } from "react";
import {
  GetUserProfile,
  UpdateUserInput,
  userNameSchema,
} from "@/app/api/user/model";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/basic/Button";
import { Input } from "@/components/basic/Input";
import { Avatar } from "@/components/basic/Avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { staticProfileIconList } from "@/lib/util/staticProfileIconList";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/basic/Modal";
import { getCroppedImg } from "@/app/edit/[id]/getCroppedImg";
import { AvatarSelector } from "@/components/basic/AvatarSelector";
import { Slider } from "@/components/basic/Slider";
import { ConfirmModal } from "@/components/ConfirmModal";
import { UIBlocker } from "@/components/UIBlocker";
import { useUIBlock } from "@/hooks/useUIBlock";
import { POST_COMPRESSION_OPTIONS } from "@/lib/constants/image";

type ProfileEditPageProps = {
  userProfile: GetUserProfile;
};

const formSchema = z.object({
  name: userNameSchema,
  image: z.string(),
});
type FormType = z.infer<typeof formSchema>;

export const ProfileEditPage = ({ userProfile }: ProfileEditPageProps) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oldUploadProfileImage, setOldUploadProfileImage] = useState(
    userProfile.uploadProfileImage
  );

  // トリミング後の画像データ
  // このデータのfileプロパティが最終的に api/image/upload のbodyに渡されてアップロードされる
  const [uploadProfileImagePreview, setUploadProfileImagePreview] = useState<
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
  const form = useForm<FormType>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userProfile.name,
      image: userProfile.image,
    },
  });

  // プロフィール更新用のMutation
  const { mutate: updateProfile } = useMutation({
    mutationFn: ({ name, image, uploadProfileImage }: UpdateUserInput) => {
      block();
      return axios.patch(`/api/user/${userProfile.id}`, {
        name,
        image,
        uploadProfileImage,
      });
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast.error("プロフィールの更新に失敗しました");
      console.error(error);
    },
    onSuccess: async (result) => {
      setIsSubmitting(false);
      const updateImageUrl = result.data.updateResult.image;
      form.setValue("image", updateImageUrl);
      // 古いアップロードプロフィール画像がある場合は削除
      if (!!oldUploadProfileImage && uploadProfileImagePreview) {
        try {
          await axios.post("/api/image/delete", {
            imageUrl: oldUploadProfileImage,
          });
          setOldUploadProfileImage(updateImageUrl);
        } catch {
          console.error("failt to delete upload profile image");
        }
      }
      setUploadProfileImagePreview(null);
      toast.success("プロフィールを更新しました");
      unblock();
      router.refresh();
      // ダーティフラグをリセット
      form.reset(form.getValues());
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
    setUploadProfileImagePreview(newBlobUrl);
    form.setValue("image", newBlobUrl, { shouldDirty: true });

    setIsShowModal(false);

    return file;
  };

  // トリミング後のFileをS3へアップロード
  const handleUploadCroppedImage = async () => {
    if (!uploadProfileImagePreview) return;
    try {
      const file = await makeCroppedImage();
      if (!file) {
        toast.error("画像のアップロードに失敗しました");
        console.error("Cropping failed or no file returned");
        return;
      }
      // 画像を圧縮
      const compressedFile = await imageCompression(
        file,
        POST_COMPRESSION_OPTIONS
      );
      // S3の署名付きURL取得APIを呼び出し
      const signedUrlRes = await axios.post("/api/s3SignedUrl", {
        fileType: compressedFile.type,
      });
      if (signedUrlRes.status !== 200) {
        toast.error("画像のアップロードに失敗しました");
        console.error("Failed to get signed URL");
        return null;
      }
      const { signedUrl, fileUrl } = signedUrlRes.data;
      // 取得した署名付きURLを使ってS3に直接アップロード
      const uploadRes = await axios.put(signedUrl, compressedFile, {
        headers: { "Content-Type": compressedFile.type },
      });
      if (uploadRes.status !== 200) {
        toast.error("画像のアップロードに失敗しました");
        console.error("Image upload failed");
        return null;
      }
      return fileUrl;
    } catch (err) {
      toast.error("アップロードに失敗しました");
      console.error(err);
    } finally {
      setIsShowModal(false);
    }

    return null;
  };

  const handleFormSubmit = async (values: UpdateUserInput) => {
    setIsSubmitting(true);
    const uploadProfileImage = await handleUploadCroppedImage();
    form.setValue("image", uploadProfileImage);
    const patchData = {
      ...values,
      ...(uploadProfileImage && { uploadProfileImage }),
    };
    updateProfile(patchData);
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

  return (
    <div>
      <UIBlocker />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col max-w-[420px] mx-auto items-center justify-center gap-10 pt-5"
        >
          <div className="flex flex-col w-full max-sm:gap-2 max-sm:w-full">
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
                          {userProfile.uploadProfileImage && (
                            <Avatar
                              profileImage={userProfile.uploadProfileImage}
                              onClick={() =>
                                field.onChange(userProfile.uploadProfileImage)
                              }
                              size="lg"
                              isHoverActive
                            />
                          )}
                          <Avatar
                            profileImage={userProfile.oAuthProfileImage}
                            onClick={() =>
                              field.onChange(
                                userProfile.oAuthProfileImage ||
                                  staticProfileIconList[0].imageURL
                              )
                            }
                            size="lg"
                            isHoverActive
                          />
                          {staticProfileIconList
                            .filter(
                              (icon) =>
                                icon.imageURL !== userProfile.oAuthProfileImage
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
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  type="text"
                  label="表示名"
                  placeholder="表示名を入力してください"
                  error={!!fieldState.error}
                  className="w-full"
                  {...field}
                />
              )}
            />
          </div>
          <div className="gap-2 justify-end w-full">
            <Button
              type="submit"
              size={"lg"}
              className="w-full justify-center"
              disabled={isSubmitting}
              iconLeft={
                isSubmitting ? (
                  <SVGIcon svg={SpinnerIcon} className="w-6 animate-spin" />
                ) : (
                  <></>
                )
              }
            >
              {isSubmitting ? "保存中" : "保存"}
            </Button>
          </div>
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
              className={cn("w-full")}
              onValueChange={(value) => {
                setZoom(value[0]);
              }}
            />
          </div>
        </div>
      </Modal>
      {!isSubmitting && form.formState.isDirty && (
        <ConfirmModal disabled={!form.formState.isDirty} />
      )}
    </div>
  );
};
