import { SVGIcon } from "@/components/ui/SVGIcon";
import Xmark from "@/components/assets/icon/x-mark.svg";

type TagProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onDelete?: () => void;
};

export const Tag = ({ children, disabled = false, onDelete }: TagProps) => {
  return (
    <div
      role="listitem"
      aria-label={`タグ: ${children}`}
      className="text-typography-md bg-white rounded-full font-bold py-2 px-3 leading-none shadow-basic inline-flex items-center gap-1 cursor-default"
    >
      {children}
      {!disabled && (
        <button
          aria-label={`${children} を削除`}
          className="p-[2px] m-0 leading-none rounded-full hover:bg-primary-50"
          onClick={onDelete}
        >
          <SVGIcon svg={Xmark} className="text-textColor-basic w-2" />
        </button>
      )}
    </div>
  );
};
