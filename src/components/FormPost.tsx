"use client";

import { FormInputPost } from "@/types";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface FromPostProps {
  submit: SubmitHandler<FormInputPost>;
  isEditing: boolean;
}

const FormPost: FC<FromPostProps> = ({ submit, isEditing }) => {
  const { register, handleSubmit } = useForm<FormInputPost>();

  return (
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
      <select
        {...register("tag")}
        className="select select-bordered w-full max-w-lg"
        defaultValue={""}
      >
        <option disabled value="">
          Select tags
        </option>
        <option>JavaScript</option>
        <option>PHP</option>
        <option>Python</option>
      </select>

      <button type="submit" className="btn btn-primary w-full max-w-lg">
        {isEditing ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default FormPost;
