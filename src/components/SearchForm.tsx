"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { SearchInput } from "@/components/basic/SearchInput";
import { cn } from "@/lib/utils";
import { useBreakpoints } from "@/hooks/useBreakpoints";

type SearchFormInputs = {
  searchQuery: string;
};

type SearchFormProps = {
  className?: string;
};

export const SearchForm = ({ className }: SearchFormProps) => {
  const router = useRouter();
  const { sm } = useBreakpoints();
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
      router.push(`/post?q=${encodeURIComponent(data.searchQuery.trim())}`);
    }
  };

  const handleClear = () => {
    reset({ searchQuery: "" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SearchInput
        onClear={handleClear}
        value={searchQuery}
        size={sm ? "sm" : "md"}
        placeholder="鳥さんを探す"
        className={className}
        {...register("searchQuery")}
      />
    </form>
  );
};
