import type { Metadata } from "next";
import {
  Comfortaa,
  Zen_Kaku_Gothic_New,
  Zen_Maru_Gothic,
} from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Header } from "@/components/Header";
import { auth } from "@/lib/auth";
import { Footer } from "@/components/Footer";
import {
  COMMON_OG_IMAGE,
  DESCRIPTION,
  FAVICON,
  METADATA_TITLE,
} from "@/app/shared-metadata";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
});
const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-zen-kaku-gothic-new",
  subsets: ["latin"],
});
const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-zen-maru-gothic",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: METADATA_TITLE.top,
  description: DESCRIPTION.common,
  openGraph: {
    ...COMMON_OG_IMAGE,
  },
  icons: {
    ...FAVICON,
  },
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const session = await auth();
  const profileImage = session?.user?.image;

  return (
    <html
      lang="ja"
      className={`${zenKakuGothicNew.variable} ${zenMaruGothic.variable} ${comfortaa.variable}`}
    >
      <body>
        <Providers>
          <div className="grid grid-rows-[auto_1fr_auto] min-h-[100svh]">
            <Header initialSession={session} profileImage={profileImage} />
            <main>
              {children}
              {modal}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
