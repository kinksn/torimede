"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SVGIcon } from "@/components/ui/SVGIcon";
import ChevronDown from "@/components/assets/icon/chevron-down.svg";
import { isEqual } from "es-toolkit";
import { FormLabel } from "@/components/basic/FormLabel";
import { Separator } from "@/components/ui/separator";
import { Tag } from "@/components/basic/Tag";
import { MenuItem } from "@/components/basic/MenuItem";
import Check from "@/components/assets/icon/check.svg";

type MultiSelectProps<T> = {
  options?: T[];
  requirement?: "optional" | "required";
  value?: T[];
  defaultValue?: T[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: T[]) => void;
  renderOption?: (option: T) => React.ReactNode;
};

export const MultiSelect = <T,>({
  options,
  requirement = "optional",
  value,
  defaultValue,
  label,
  placeholder = "選択してください",
  disabled = false,
  onChange,
  renderOption,
}: MultiSelectProps<T>) => {
  // value が渡されていない場合は、内部 state を使う (Uncontrolled)
  // defaultValue があればそれを初期値にし、なければ空配列を初期値にする
  const [internalValue, setInternalValue] = useState<T[]>(defaultValue ?? []);

  // Controlled or Uncontrolled を判定
  const isControlled = value !== undefined;

  // 現在の選択配列: Controlledなら props の value、Uncontrolledなら internalValue
  const currentValue = isControlled ? (value as T[]) : internalValue;

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
   * renderOption が指定されていない場合は、単純に文字列化
   */
  const defaultRenderOption = (option: T) => String(option);
  const renderFn = renderOption ?? defaultRenderOption;

  const isShowMenuItemIcon = (option: T) =>
    currentValue.some((value) => isEqual(value, option));

  return (
    <div className="flex flex-col gap-2">
      {!!label && <FormLabel requirement={requirement}>{label}</FormLabel>}
      <Popover>
        <PopoverTrigger
          disabled={disabled}
          className={`text-left border-[2px] border-transparent flex justify-between items-center gap-3 bg-primary-50 p-3 rounded-md min-h-[60px] data-[state=open]:border-tertialy-oceanblue-400 ${
            disabled && "bg-achromatic-100"
          }`}
        >
          <div>
            {currentValue?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentValue?.map((selectedOption, index) => (
                  <Tag
                    key={`${selectedOption}-${index}`}
                    disabled={disabled}
                    onDelete={() => handleSelect(selectedOption)}
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
        </PopoverTrigger>

        <PopoverContent align="start" className="max-h-48 overflow-y-scroll">
          {options?.map((option, index) => (
            <>
              <MenuItem
                key={`${String(option)}-${index}`}
                menuType="option"
                option={option}
                isShowIcon={isShowMenuItemIcon(option)}
                iconSvg={Check}
                iconSvgColor="text-textColor-basic"
                onSelect={handleSelect}
              >
                {renderFn(option)}
              </MenuItem>
              {index < options.length - 1 && (
                <Separator className="border-[1px] border-primary-50" />
              )}
            </>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};
