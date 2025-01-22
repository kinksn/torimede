import Link from "next/link";
import Image from "next/image";

type ImageItemProps = {
  imageUrl: string;
  href: string;
  actionButton?: React.ReactNode;
};

export const ImageItem = ({ imageUrl, href, actionButton }: ImageItemProps) => {
  return (
    <div className="relative">
      {actionButton && (
        <div className="absolute top-2 right-2 z-20">{actionButton}</div>
      )}
      <Link
        href={href}
        passHref
        className="rounded-[20px] w-full block overflow-hidden relative group"
        scroll={false}
      >
        <div className="absolute inset-0 bg-overlay-image opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" />
        <Image
          src={imageUrl}
          alt="投稿画像"
          width="600"
          height="600"
          className="w-full h-auto"
          loading="lazy"
        />
      </Link>
    </div>
  );
};
