import { getPayers } from "@/app/actions/pagadores/fetch_pagadores";
import CreatePayer from "./modal/create-payer";
import TablePayers from "./table-payers";
import { promises as fs } from "fs";
import path from "path";

async function page() {
  const pagadores = await getPayers();

  // Lê dinamicamente os arquivos de avatar do diretório public/avatars
  const avatarsDir = path.join(process.cwd(), "public", "avatars");
  let avatars: string[] = [];
  try {
    const files = await fs.readdir(avatarsDir);
    avatars = files.filter((f) => /\.(png|jpg|jpeg|svg|webp)$/i.test(f));
  } catch (e) {
    avatars = [];
  }

  return (
    <div className="my-4">
      <CreatePayer avatars={avatars} />
      <TablePayers pagadores={pagadores} avatars={avatars} />
    </div>
  );
}

export default page;
