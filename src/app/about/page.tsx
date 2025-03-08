import Image from "next/image";
import { ContentToolbar } from "@/components/ContentToolbar";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import {
  COMMON_OG_IMAGE,
  DESCRIPTION,
  METADATA_TITLE,
} from "@/app/shared-metadata";

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
        <Section
          title={
            <>
              トリメデは
              <br className="hidden max-sm:block" />
              鳥さんを
              <span className={medeTextGradientStyle}>愛でる</span>
              ための
              <br />
              画像共有サービスです
            </>
          }
          className="pt-0"
          subTitle="about"
        >
          <p className="mt-5 text-center max-sm:text-left">
            くわしい人から普段なんとなく鳥さんが気になっている人まで、
            <br className="max-sm:hidden" />
            すべての鳥好きが楽しめる場所です。
          </p>
          <Image
            src={`${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/image/about/kv.svg`}
            className="max-w-[190px] max-sm:max-w-[148px] mt-10"
            alt="メデちゃんがハートを出して喜んでいる姿"
            width={190}
            height={190}
            layout="responsive"
            loading="lazy"
          />
        </Section>
        <Section title="トリメデの楽しみ方" subTitle="how">
          <div className="flex flex-col items-center gap-[60px] max-sm:gap-10 mt-10 max-sm:mt-5">
            <div className="flex flex-col items-center gap-5">
              <h2 className="font-zenMaruGothic text-typography-xl font-bold text-tertialy-oceanblue-400">
                <span className="text-[24px]">1.</span>投稿する
              </h2>
              <Image
                src={`${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/image/about/post.png`}
                className={"max-w-[440px]"}
                alt="トリメデで投稿をするイメージ画像"
                width={1768}
                height={1216}
                layout="responsive"
                loading="lazy"
              />
              <p>
                鳥さんに関係するものならなんでもOKです。
                <br className="max-sm:hidden" />
                街中で見つけた野鳥、自宅に遊びに来る鳥さん、ペットの鳥さんなど、
                <br className="max-sm:hidden" />
                日常で出会う鳥さんを投稿して一緒に楽しみましょう。
                <br className="max-sm:hidden" />
                また、本物の鳥さんだけでなくイラストやグッズの写真もOKです。
                <br className="max-sm:hidden" />
                投稿するとみんなが見れるタイムラインに表示されます。
              </p>
            </div>
            <div className="flex flex-col items-center gap-5">
              <h2
                className={`font-zenMaruGothic text-typography-xl font-bold text-tertialy-oceanblue-400 ${medeTextGradientStyle}`}
              >
                <span className="text-[24px]">2.</span>愛でる
              </h2>
              <Image
                src={`${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/image/about/mede.png`}
                className={"max-w-[576px] max-sm:hidden"}
                alt="投稿された鳥さんの画像のメデボタンを押しているイメージ画像（PC用）"
                width={2304}
                height={1520}
                loading="lazy"
              />
              <Image
                src={`${process.env.NEXT_PUBLIC_ASSET_BASE_URL}/image/about/mede-sp.png`}
                className={"hidden max-sm:block"}
                alt="投稿された鳥さんの画像のメデボタンを押しているイメージ画像（SP用）"
                width={1340}
                height={880}
                layout="responsive"
                loading="lazy"
              />
              <p>
                好きな鳥さんを選んで「メデボタン」を押すと愛でることができます。
                <br className="max-sm:hidden" />
                SNSの「いいね」とはちがい数値は表示されません。
                <br className="max-sm:hidden" />
                愛でてもらった鳥さんは幸せな変化が起こるかもしれないので、
                <br className="max-sm:hidden" />
                気になった鳥さんをたくさん愛でてみましょう。
              </p>
            </div>
          </div>
        </Section>
        <Section title="SNS疲れはありません" subTitle="promise">
          <div className="rounded-20 bg-white p-10 mt-10">
            <p>
              トリメデは投稿と愛でることしかできません。
              <br className="max-sm:hidden" />
              メデボタンを押しても誰が愛でたか分かるような通知が飛ぶことはないので、
              <br className="max-sm:hidden" />
              気を使うことなく好きなだけ鳥さんを愛でたり投稿したり楽しんでください。
            </p>
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
  className,
  gap,
}: {
  children: React.ReactNode;
  title: React.ReactNode | string;
  subTitle: string;
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
        <span className="font-comfortaa text-secondary-400">{subTitle}</span>
        <h1 className="font-zenMaruGothic text-primary-700 text-center text-typography-xxxl max-sm:text-typography-xxl font-bold max-sm:font-bold max-sm:leading-[1.8]">
          {title}
        </h1>
      </header>
      {children}
    </section>
  );
};
