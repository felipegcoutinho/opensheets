import CreatePayer from "./modal/create-payer";
import { Suspense } from "react";
import TransactionTableFallback from "@/components/fallbacks/transaction-table-fallback";
import PayersSection from "./sections/payers";
import { promises as fs } from "fs";
import path from "path";

async function getAvatars() {
  try {
    const dir = path.join(process.cwd(), "public", "avatars");
    const files = await fs.readdir(dir);
    return files.filter((f) => /\.(png|jpg|jpeg|svg|webp)$/i.test(f));
  } catch {
    return [] as string[];
  }
}

async function page() {
  const avatars = await getAvatars();
  return (
    <div className="my-4">
      <CreatePayer avatars={avatars} />
      <Suspense fallback={<TransactionTableFallback rows={10} /> } >
        <PayersSection />
      </Suspense>
    </div>
  );
}

export default page;
