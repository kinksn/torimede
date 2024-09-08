import type { Metadata } from "next";
import {
  Comfortaa,
  Zen_Kaku_Gothic_New,
  Zen_Maru_Gothic,
} from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { GlobalNavi } from "@/components/GlobalNavi";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
});
const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-zen-kaku-gothic-new",
  subsets: ["latin"],
});
const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-zen-maru-gothic",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const profileImage = session?.user?.image;

  return (
    <html
      lang="ja"
      className={`${zenKakuGothicNew.variable} ${zenMaruGothic.variable} ${comfortaa.variable}`}
    >
      <body>
        <Providers>
          <GlobalNavi initialSession={session} profileImage={profileImage} />
          <div className="container h-full pt-12">{children}</div>
          {modal}
        </Providers>
      </body>
    </html>
  );
}
