"use client";

import { FormInputPost, Tag } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

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
  const { register, handleSubmit } = useForm<FormInputPost>({
    defaultValues: initialValue,
  });

  // fetch list tags
  const { data: dataTags, isLoading: isLoadingTags } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await axios.get("/api/tags");
      return response.data;
    },
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col items-center justify-center gap-5 mt-10"
      >
        <input
          type="text"
          {...register("title", { required: true })}
          placeholder="post title..."
          className="input input-bordered w-full max-w-lg"
        />
        <textarea
          {...register("content")}
          className="textarea textarea-bordered w-full max-w-lg"
          placeholder="Post content..."
        ></textarea>
        {isLoadingTags ? (
          <span className="loading loading-dots loading-md"></span>
        ) : (
          <select
            {...register("tagId")}
            className="select select-bordered w-full max-w-lg"
            defaultValue={""}
          >
            <option disabled value="">
              Select tags
            </option>
            {dataTags?.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        )}

        <button type="submit" className="btn btn-primary w-full max-w-lg">
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
    </>
  );
};

export default FormPost;
