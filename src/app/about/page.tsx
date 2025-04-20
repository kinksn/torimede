import Image from "next/image";
import Check from "@/components/assets/icon/check.svg";
import { ContentToolbar } from "@/components/ContentToolbar";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import {
  COMMON_OG_IMAGE,
  DESCRIPTION,
  METADATA_TITLE,
} from "@/app/shared-metadata";
import { SVGIcon } from "@/components/ui/SVGIcon";

export const metadata: Metadata = {
  title: METADATA_TITLE.about,
  description: DESCRIPTION.common,
  openGraph: {
    ...COMMON_OG_IMAGE,
  },
};

const medeTextGradientStyle =
  "bg-gradient-to-r from-[#FF6868] via-[#FD7A6A] to-[#F68859] inline-block text-transparent bg-clip-text";

export default function About() {
  return (
    <>
      <ContentToolbar />
      <article className="w-full px-5 flex flex-col items-center justify-center">
        <header>
          <div className="flex items-center max-sm:flex-col gap-5 mt-10 mb-10">
            <div className="flex flex-col gap-2">
              <h1 className="font-zenMaruGothic text-primary-700 text-typography-xxxl max-sm:text-typography-xxl font-bold max-sm:font-bold max-sm:leading-[1.8] flex flex-col text-left max-sm:items-center max-sm:text-center">
                <p>
                  鳥さんを
                  <span className={medeTextGradientStyle}>愛でて</span>
                </p>
                <p>いやしの輪をひろげる</p>
              </h1>
              <p>
                くわしい人から普段なんとなく鳥さんが気になっている人まで、
                <br className="max-sm:hidden" />
                すべての鳥好きが楽しめる場所です。
              </p>
            </div>
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/image/about/kv.svg`}
              className="max-w-[190px] max-sm:max-w-[148px]"
              alt="メデちゃんがハートを出して喜んでいる姿"
              width={190}
              height={190}
              layout="responsive"
              loading="lazy"
            />
          </div>
        </header>
        <Section title="楽しみ方" subTitle="how">
          <div className="flex flex-col items-center gap-[60px] max-sm:gap-10 mt-20">
            <ul className="flex justify-center max-sm:flex-col gap-10 max-sm:gap-20">
              <li className="relative flex flex-col items-center max-w-[380px] w-full rounded-20 bg-white pt-20 pb-10">
                <small className="flex justify-center absolute h-20 top-0 left-0 right-0 mx-auto -translate-y-[50%]">
                  <span className="flex items-center justify-center bg-secondary-50 rounded-full h-full w-fit px-10">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/image/about/how-title01.svg`}
                      alt="楽しみ方その1"
                      width={56}
                      height={21}
                      className="min-w-[56px]"
                    />
                  </span>
                </small>
                <div className="px-7">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/image/about/how-01.png`}
                    alt="トリメデで投稿をするイメージ画像"
                    width={1296}
                    height={936}
                    layout="responsive"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col gap-5 items-center px-10 pt-10">
                  <h2 className="font-zenMaruGothic text-typography-lg font-bold leading-none">
                    投稿する
                  </h2>
                  <p className="font-medium">
                    街中の野鳥さん、ペットの鳥さんなど、日常で出会う鳥さんを投稿しましょう。イラストやグッズの鳥さんでもOKです。
                  </p>
                </div>
              </li>
              <li className="relative flex flex-col items-center max-w-[380px] w-full rounded-20 bg-white pt-20 pb-10">
                <small className="flex justify-center absolute h-20 top-0 left-0 right-0 mx-auto -translate-y-[50%]">
                  <span className="flex items-center justify-center bg-secondary-50 rounded-full h-full w-fit px-10">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/image/about/how-title02.svg`}
                      alt="楽しみ方その2"
                      width={56}
                      height={21}
                      className="min-w-[56px]"
                    />
                  </span>
                </small>
                <div className="px-7">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/image/about/how-02.png`}
                    alt="メデボタンをおして投稿された鳥さんを愛でるイメージ画像"
                    width={1296}
                    height={936}
                    layout="responsive"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col gap-5 items-center px-10 pt-10">
                  <h2 className="font-zenMaruGothic text-typography-lg font-bold leading-none">
                    愛でる
                  </h2>
                  <p className="font-medium">
                    好きな鳥さんを選んで「メデボタン」を押すと愛でることができます。SNSの「いいね」とはちがい数値は表示されません。
                  </p>
                </div>
              </li>
              <li className="relative flex flex-col items-center max-w-[380px] w-full rounded-20 bg-white pt-20 pb-10">
                <small className="flex justify-center absolute h-20 top-0 left-0 right-0 mx-auto -translate-y-[50%]">
                  <span className="flex items-center justify-center bg-secondary-50 rounded-full h-full w-fit px-10">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/image/about/how-title03.svg`}
                      alt="楽しみ方その3"
                      width={56}
                      height={21}
                      className="min-w-[56px]"
                    />
                  </span>
                </small>
                <div className="px-7">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/image/about/how-03.png`}
                    alt="キラキラになった投稿のイメージ画像"
                    width={1296}
                    height={936}
                    layout="responsive"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col gap-5 items-center px-10 pt-10">
                  <h2 className="font-zenMaruGothic text-typography-lg font-bold leading-none">
                    集める
                  </h2>
                  <p className="font-medium">
                    自分が投稿した鳥さんがたくさん愛でられるとキラキラ輝く特別なカードになります。カードはマイページで見ることができます。
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </Section>
        <Section
          title="SNS疲れさせません"
          subTitle="promise"
          description={
            <>
              気を使うことなく楽しめるように、
              <br />
              以下の約束を守ります
            </>
          }
        >
          <ul className="flex justify-center max-sm:flex-col mt-10 gap-10 max-w-[1220px]">
            <li className="flex flex-col gap-1 max-w-[380px] p-10 rounded-20 bg-secondary-50 border-4 border-secondary-100">
              <h2 className="flex items-center gap-2 text-tertialy-oceanblue-400 font-bold text-typography-lg font-zenMaruGothic">
                <div className="flex items-center justify-center rounded-full w-6 h-6 bg-tertialy-oceanblue-400">
                  <SVGIcon svg={Check} className="w-5 text-base-content" />
                </div>
                通知しない
              </h2>
              <p>あなたが愛でた鳥さんを投稿者や他の人に知らせません。</p>
            </li>
            <li className="flex flex-col gap-1 max-w-[380px] p-10 rounded-20 bg-secondary-50 border-4 border-secondary-100">
              <h2 className="flex items-center gap-2 text-tertialy-oceanblue-400 font-bold text-typography-lg font-zenMaruGothic">
                <div className="flex items-center justify-center rounded-full w-6 h-6 bg-tertialy-oceanblue-400">
                  <SVGIcon svg={Check} className="w-5 text-base-content" />
                </div>
                数値化しない
              </h2>
              <p>愛でた回数やあなたの行動を数値化して他の人に見せません。</p>
            </li>
            <li className="flex flex-col gap-1 max-w-[380px] p-10 rounded-20 bg-secondary-50 border-4 border-secondary-100">
              <h2 className="flex items-center gap-2 text-tertialy-oceanblue-400 font-bold text-typography-lg font-zenMaruGothic">
                <div className="flex items-center justify-center rounded-full w-6 h-6 bg-tertialy-oceanblue-400">
                  <SVGIcon svg={Check} className="w-5 text-base-content" />
                </div>
                勝手に公開しない
              </h2>
              <p>
                育った鳥さんなどあなたが手に入れたものを他の人に見せません。
              </p>
            </li>
          </ul>
        </Section>
        <Section>
          <div className="relative">
            <div className="absolute top-2 -right-2 w-full h-full z-[-1] rounded-20 bg-primary-100 bg-opacity-80" />
            <a
              className="transition-all hover:translate-x-2 hover:translate-y-2 relative flex max-sm:flex-col max-sm:justify-center max-sm:items-center gap-9 max-sm:gap-7 rounded-20 px-[60px] max-sm:px-10 pt-[60px] pb-[60px] max-sm:pb-10 border-8 border-tertialy-oceanblue-400 bg-base-content bg-cover"
              style={{
                backgroundImage: `url(${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/image/about/help-bunner-bg.png)`,
              }}
              href="https://torimede.gitbook.io/torimedehelp/"
              target="_blank"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/image/about/external-icon.svg`}
                alt=""
                width={20}
                height={20}
                className="absolute top-5 right-5"
              />
              <div className="flex flex-col gap-2">
                <span className="font-comfortaa text-secondary-400 leading-none">
                  help
                </span>
                <h1 className="-ml-2 font-zenMaruGothic text-primary-700 text-typography-xxl max-sm:text-typography-xxl font-bold max-sm:font-bold leading-[1.6] max-sm:leading-[1.6]">
                  トリメデについて
                  <br />
                  もっと詳しく知る
                </h1>
                <p className="text-typography-sm mt-1">
                  細かな仕様や使いかたをまとめた
                  <br />
                  <span className="text-textColor-link">ヘルプページ</span>
                  をご用意しています
                </p>
              </div>
              <Image
                src={`${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/image/about/help-medechan.svg`}
                alt=""
                width={156}
                height={166}
              />
            </a>
          </div>
        </Section>
      </article>
    </>
  );
}

const Section = ({
  children,
  title,
  subTitle,
  description,
  className,
  gap,
}: {
  children: React.ReactNode;
  title?: React.ReactNode | string;
  subTitle?: string;
  description?: React.ReactNode;
  className?: string;
  gap?: number;
}) => {
  return (
    <section
      className={cn(
        `flex flex-col items-center justify-center py-10 ${
          gap && "gap-" + gap
        }`,
        className
      )}
    >
      <header className="flex flex-col items-center justify-center">
        {subTitle && (
          <span className="font-comfortaa text-secondary-400 leading-none">
            {subTitle}
          </span>
        )}
        {title && (
          <h1 className="font-zenMaruGothic text-primary-700 text-center text-typography-xxl max-sm:text-typography-xxl font-bold max-sm:font-bold max-sm:leading-[1.6]">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-typography-sm mt-1 text-center">{description}</p>
        )}
      </header>
      {children}
    </section>
  );
};
