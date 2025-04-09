"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SVGIcon } from "@/components/ui/SVGIcon";
import ChevronDown from "@/components/assets/icon/chevron-down.svg";
import SearchIcon from "@/components/assets/icon/search.svg";
import { isEqual } from "es-toolkit";
import { FormLabel } from "@/components/basic/FormLabel";
import { Separator } from "@/components/ui/separator";
import { Tag } from "@/components/basic/Tag";
import { MenuItem } from "@/components/basic/MenuItem";
import Check from "@/components/assets/icon/check.svg";
import { Input } from "@/components/basic/Input";
import { PillButton } from "@/components/basic/PillButton";

type MultiSelectProps<T> = {
  options?: T[];
  requirement?: "optional" | "required";
  value?: T[];
  defaultValue?: T[];
  label?: string;
  itemMenu?: (option: T) => React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: T[]) => void;
  renderOption?: (option: T) => React.ReactNode;
  onCreateNewOption?: (inputValue: string) => Promise<T | null>;
  filterOption?: (option: T, inputValue: string) => boolean;
};

export const MultiSelect = <T,>({
  options,
  requirement = "optional",
  value,
  defaultValue,
  label,
  itemMenu,
  placeholder = "選択してください",
  disabled = false,
  onChange,
  renderOption,
  onCreateNewOption,
  filterOption,
}: MultiSelectProps<T>) => {
  // value が渡されていない場合は、内部 state を使う (Uncontrolled)
  // defaultValue があればそれを初期値にし、なければ空配列を初期値にする
  const [internalValue, setInternalValue] = useState<T[]>(defaultValue ?? []);
  // 「タグ一覧」も外部propsの変更に合わせつつ、内部でも新規タグ追加したい場合があるのでステート管理
  const [internalOptions, setInternalOptions] = useState<T[]>(options ?? []);
  // ユーザーが検索欄に入力した文字
  const [searchTerm, setSearchTerm] = useState("");

  // Controlled or Uncontrolled を判定
  const isControlled = value !== undefined;

  // 現在の選択配列: Controlledなら props の value、Uncontrolledなら internalValue
  const currentValue = isControlled ? (value as T[]) : internalValue;

  /**
   * デフォルトのfilterOption
   *  - T に name というプロパティがある想定なら name で部分一致
   *  - なければ文字列化したものと searchTerm を部分一致判定
   */
  const defaultFilterOption = (option: T, searchTerm: string) => {
    const text =
      typeof option === "object" && option !== null && "name" in option
        ? ((option as any).name?.toString() ?? "")
        : String(option);
    return text.includes(searchTerm);
  };

  const actualFilterOption = filterOption ?? defaultFilterOption;

  // 検索文字列に応じて絞り込む
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return internalOptions;
    return internalOptions.filter((option) =>
      actualFilterOption(option, searchTerm)
    );
  }, [internalOptions, searchTerm, actualFilterOption]);

  /**
   * 項目を選択／解除する共通ロジック
   */
  const handleSelect = (selected: T) => {
    let newValue: T[];
    if (currentValue.some((value) => isEqual(value, selected))) {
      newValue = currentValue.filter((value) => !isEqual(value, selected));
    } else {
      newValue = [...currentValue, selected];
    }

    // Uncontrolled なら内部 state を更新
    if (!isControlled) {
      setInternalValue(newValue);
    }

    // onChange があれば呼び出す (Controlled / Uncontrolled 共通)
    onChange?.(newValue);
  };

  /**
   * 「新しいタグを作る」→ 選択肢に追加＆即座に選択状態にする
   */
  const handleCreateAndSelect = async (inputValue: string) => {
    if (!onCreateNewOption) return;
    try {
      const createdOption = await onCreateNewOption(inputValue);
      if (!createdOption) return;
      // 新しいタグを内部 state に追加
      setInternalOptions((prev) => [createdOption, ...prev]);
      // 選択状態にも追加
      handleSelect(createdOption);
    } catch (error) {
      console.error("Failed to create new option:", error);
    }
  };

  /**
   * renderOption が指定されていない場合は、単純に文字列化
   */
  const defaultRenderOption = (option: T) => String(option);
  const renderFn = renderOption ?? defaultRenderOption;

  const isShowMenuItemIcon = (option: T) =>
    currentValue.some((value) => isEqual(value, option));

  const exactMatchExists = useMemo(() => {
    // TがTag型(nameを持つ)という前提で書いている例です
    return internalOptions.some((option) => {
      if (typeof option === "object" && option !== null && "name" in option) {
        return (option as any).name === searchTerm;
      }
      return false;
    });
  }, [internalOptions, searchTerm]);

  // タグ名編集→submit時に最新のoptionsをセットする
  // このuseEffectを使う問題として“外部でも同じオブジェクトを更新するという場合に重複管理することになる
  // TODO:useEffectを使わずidのみstateで持つようにし、選択肢の表示側はoptionを参照して名前を引くように
  useEffect(() => {
    if (isControlled) return;
    if (!options) return;

    // タグ一覧も上書き（表示用）
    setInternalOptions(options);

    // 選択中のものを同じidのオブジェクトに差し替え、
    // 見つからない(=undefined)なら除外する
    setInternalValue((prev) =>
      prev
        .map((selected) => {
          const selectedId = (selected as any).id;
          const updatedObject = options.find(
            (o) => (o as any).id === selectedId
          );
          return updatedObject;
        })
        // updatedObject が undefined の要素は排除する
        .filter((obj) => obj !== undefined)
    );
  }, [options, isControlled]);

  return (
    <div className="flex flex-col gap-2">
      {!!label && <FormLabel requirement={requirement}>{label}</FormLabel>}
      <Popover>
        <PopoverTrigger
          disabled={disabled}
          className={`text-left border-[2px] border-transparent flex justify-between items-center gap-3 bg-primary-50 p-3 rounded-md min-h-[68px] data-[state=open]:border-tertialy-oceanblue-400 hover:border-tertialy-oceanblue-400 transition-all cursor-pointer ${
            disabled && "bg-achromatic-100"
          }`}
          asChild
        >
          <div>
            <div>
              {currentValue?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {currentValue?.map((selectedOption, index) => (
                    <Tag
                      key={`${selectedOption}-${index}`}
                      disabled={disabled}
                      onDelete={(e) => {
                        e.stopPropagation();
                        handleSelect(selectedOption);
                      }}
                      deletable
                    >
                      {renderFn(selectedOption)}
                    </Tag>
                  ))}
                </div>
              ) : (
                <p className="text-textColor-weak">{placeholder}</p>
              )}
            </div>
            <div>
              <SVGIcon
                svg={ChevronDown}
                className={`text-textColor-basic w-6 ${
                  disabled && "text-textColor-faint"
                }`}
              />
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="pt-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* 検索用Input */}
          <div className="mb-1">
            <Input
              inputClassName="rounded-tr-[6px] rounded-tl-[6px] rounded-br-none rounded-bl-none"
              formMessageClassName="text-center bg-tertialy-fleshTomato-50 py-1"
              placeholder={`${label}を検索または追加`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={disabled}
              autoFocus={false}
              icon={
                <SVGIcon
                  svg={SearchIcon}
                  className="text-textColor-basic w-6 h-6"
                />
              }
            />
          </div>

          {/* 選択肢リスト */}
          <div className="max-h-48 overflow-y-scroll">
            {filteredOptions?.map((option, index) => (
              <div key={`${String(option)}-${index}`}>
                <MenuItem
                  menuType="option"
                  option={option}
                  isShowIcon={isShowMenuItemIcon(option)}
                  iconSvg={Check}
                  iconSvgColor="text-textColor-basic"
                  onSelect={handleSelect}
                  {...(itemMenu && { menu: itemMenu(option) })}
                >
                  {renderFn(option)}
                </MenuItem>
                {index < filteredOptions.length - 1 && (
                  <Separator className="border-[1px] border-primary-50" />
                )}
              </div>
            ))}

            {/* --- ここから追加導線の表示 --- */}
            {/* 1) onCreateNewOption がある
                2) searchTerm が空ではない
                3) exactMatchExists === false (完全一致のタグは未存在)
              のときに表示 */}
            {onCreateNewOption && searchTerm && !exactMatchExists && (
              <MenuItem
                menuType="option"
                option={searchTerm}
                className="bg-base-bg"
                onSelect={() => handleCreateAndSelect(searchTerm)}
              >
                <div className="flex items-center justify-start">
                  <small className="block whitespace-nowrap">追加：</small>
                  <Tag className="cursor-pointer">
                    <p>{searchTerm}</p>
                  </Tag>
                </div>
              </MenuItem>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
