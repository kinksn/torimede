import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ImageItemProps = React.HTMLAttributes<HTMLDivElement> & {
  imageUrl: string;
  href?: string;
  actionButton?: React.ReactNode;
  alt?: string;
  className?: string;
  imageContainerClassName?: string;
  imageClassName?: string;
  isFitContainer?: boolean;
};

export const ImageItem = ({
  imageUrl,
  href,
  actionButton,
  alt,
  className,
  imageContainerClassName,
  imageClassName,
  isFitContainer,
  ...props
}: ImageItemProps) => {
  return (
    <div
      className={cn(
        "relative rounded-[20px] overflow-hidden bg-tertialy-oceanblue-50",
        className
      )}
      {...props}
    >
      {actionButton && (
        <div className="absolute top-2 right-2 z-20">{actionButton}</div>
      )}
      {!!href ? (
        <Link
          href={href}
          passHref
          className={`w-full block overflow-hidden relative group ${
            isFitContainer && "h-full"
          }`}
          scroll={false}
        >
          <div className="absolute inset-0 bg-overlay-image opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 max-sm:hidden" />
          <Image
            src={imageUrl}
            alt={alt ?? "投稿画像"}
            width="600"
            height="600"
            className={`w-full h-auto ${
              isFitContainer && "object-contain h-full max-h-[inherit]"
            }`}
            loading="lazy"
          />
        </Link>
      ) : (
        <div
          className={cn(
            `w-full block overflow-hidden relative group ${
              isFitContainer && "h-full"
            }`,
            imageContainerClassName
          )}
        >
          <Image
            src={imageUrl}
            alt={alt ?? "投稿画像"}
            width="600"
            height="600"
            className={cn(
              `w-full h-auto ${isFitContainer && "object-contain h-full"}`,
              imageClassName
            )}
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};
