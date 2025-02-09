"use client";

import SearchIcon from "@/components/assets/icon/search.svg";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { SearchInput } from "@/components/basic/SearchInput";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RoundButton } from "@/components/basic/RoundButton";
import { SVGIcon } from "@/components/ui/SVGIcon";

type SearchFormInputs = {
  searchQuery: string;
};

type SearchFormProps = {
  className?: string;
};

export const SearchForm = ({ className }: SearchFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { sm } = useBreakpoints();
  const [isSearchPopoverOpen, setIsSearchPoporverOpen] = useState(false);

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
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        action="/"
        className="max-sm:hidden"
      >
        <SearchInput
          onClear={handleClear}
          value={searchQuery}
          size={sm ? "sm" : "md"}
          placeholder="鳥さんを探す"
          className={className}
          {...register("searchQuery")}
        />
      </form>
      <div className="hidden max-sm:block">
        <Popover
          open={isSearchPopoverOpen}
          onOpenChange={setIsSearchPoporverOpen}
        >
          <PopoverTrigger>
            <RoundButton
              colorTheme={"white"}
              asChild
              isActive={isSearchPopoverOpen}
              aria-label="検索フォーム表示ボタン"
              icon={
                <div>
                  <SVGIcon
                    svg={SearchIcon}
                    className="text-primary-700 w-6 h-6"
                  />
                </div>
              }
            />
          </PopoverTrigger>
          <PopoverContent className="relative -top-[2px] w-[100svw] !animate-none border-none py-3 px-2 rounded-none">
            <form onSubmit={handleSubmit(onSubmit)} action="/">
              <SearchInput
                onClear={handleClear}
                value={searchQuery}
                size={"sm"}
                placeholder="鳥さんを探す"
                className={className}
                {...register("searchQuery")}
              />
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
