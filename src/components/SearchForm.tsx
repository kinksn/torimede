"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { X } from "lucide-react"; // Lucide Reactのアイコンを使用

type SearchFormInputs = {
  searchQuery: string;
};

export const SearchForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const { register, handleSubmit, setValue, watch, reset } =
    useForm<SearchFormInputs>({
      defaultValues: { searchQuery: initialQuery },
    });

  const searchQuery = watch("searchQuery");

  useEffect(() => {
    setValue("searchQuery", initialQuery);
  }, [initialQuery, setValue]);

  const onSubmit: SubmitHandler<SearchFormInputs> = (data) => {
    if (data.searchQuery.trim()) {
      router.push(`/posts?q=${encodeURIComponent(data.searchQuery.trim())}`);
    }
  };

  const handleClear = () => {
    reset({ searchQuery: "" });
  };

  return (
    <div className="flex-1 justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex relative">
        <input
          type="text"
          placeholder="キーワードを入力"
          className="input input-bordered w-full max-w-xs pr-8"
          {...register("searchQuery")}
        />
        {searchQuery && (
          <button type="button" onClick={handleClear}>
            <X size={18} />
          </button>
        )}
      </form>
    </div>
  );
};
