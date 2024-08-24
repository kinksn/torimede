import { GlobalNavi } from "@/components/GlobalNavi";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <>
      <GlobalNavi initialSession={session} />
      <div className="container h-full pt-12">{children}</div>
      {modal}
    </>
  );
}
