import { getAuthSession } from "@/lib/auth";
import ClientPostCard from "@/app/_page/ClientPostCard";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <main className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
      <ClientPostCard session={session} />
    </main>
  );
}
