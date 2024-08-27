"use client";

import { FormInputPost, Tag } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
  ChangeEvent,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface FromPostProps {
  submit: SubmitHandler<FormInputPost>;
  isEditing: boolean;
  initialValue?: FormInputPost;
  isLoadingSubmit: boolean;
}

const FormPost: FC<FromPostProps> = ({
  submit,
  isEditing,
  initialValue,
  isLoadingSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { register, handleSubmit, formState } = useForm<FormInputPost>({
    defaultValues: initialValue
      ? initialValue
      : { title: "", content: "", tagId: "", image: "" },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const uploadImage = async (
    file: File | null,
    currentImage: string
  ): Promise<string | null> => {
    if (!file) {
      return currentImage || "";
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/api/post/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

  const handleFormSubmit: SubmitHandler<FormInputPost> = async (data) => {
    setIsSubmitting(true);

    const imageUrl = await uploadImage(file, data.image || "");
    if (!imageUrl) {
      setIsSubmitting(false);
      return;
    }

    submit({ ...data, image: imageUrl });
  };

  const { isDirty } = formState;

  // fetch list tags
  const { data: dataTags, isLoading: isLoadingTags } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await axios.get("/api/tag");
      return response.data;
    },
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col items-center justify-center gap-5 mt-10"
      >
        <input
          type="text"
          {...register("title", { required: true })}
          placeholder="post title..."
          className="input input-bordered w-full max-w-lg"
        />
        <textarea
          {...register("content", { required: true })}
          className="textarea textarea-bordered w-full max-w-lg"
          placeholder="Post content..."
        ></textarea>
        <input
          type="file"
          onChange={handleFileChange}
          className="input input-bordered w-full max-w-lg"
          accept="image/*,.png,.jpg,.jpeg,.gif"
        />
        {isLoadingTags ? (
          <span className="loading loading-dots loading-md"></span>
        ) : (
          <select
            {...register("tagId")}
            className="select select-bordered w-full max-w-lg"
            defaultValue={""}
          >
            <option value="">Select tags</option>
            {dataTags?.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        )}

        <button
          type="submit"
          className="btn bg-yellow-400 hover:bg-yellow-500 w-full max-w-lg text-gray-900"
        >
          {isLoadingSubmit && <span className="loading loading-spinner"></span>}
          {isEditing
            ? isLoadingSubmit
              ? "Updating..."
              : "Update"
            : isLoadingSubmit
            ? "Creating..."
            : "Create"}
        </button>
      </form>
      {!isSubmitting && <ConfirmDialog disabled={!isDirty} />}
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
