import MedeChan from "@/components/assets/mede-chan/default.svg";
import Logo from "@/components/assets/logo-color-fixed.svg";
import { getAuthSession } from "@/lib/auth";
import ClientPostCard from "@/app/_page/ClientPostCard";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { PillButton } from "@/components/basic/PillButton";
import Link from "next/link";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-10 max-sm:mt-5">
        <h1 className="flex flex-col gap-2">
          <SVGIcon
            svg={MedeChan}
            className="ml-[27px] w-[188px] max-sm:ml-[41px] max-sm:w-[88px]"
          />
          <SVGIcon svg={Logo} className="w-[260px] max-sm:w-[180px]" />
        </h1>
        <h2 className="font-bold text-typography-md font-zenMaruGothic text-primary-900 mt-3 -mr-4 max-sm:text-typography-sm max-sm:font-bold max-sm:-mr-3">
          鳥を愛でて、心ほっこり。
        </h2>
        <PillButton className="mt-6" colorTheme={"secondary"} asChild>
          <Link href={"/about"}>トリメデとは？</Link>
        </PillButton>
      </div>
      <main className="container px-5 grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10 max-sm:mt-5">
        <ClientPostCard session={session} />
      </main>
    </>
  );
}
