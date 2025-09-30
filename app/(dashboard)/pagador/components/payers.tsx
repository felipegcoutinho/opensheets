import { getPayers } from "@/app/actions/pagadores/fetch_pagadores";
import TablePayers from "../table-payers";
import { promises as fs } from "fs";
import path from "path";

export default async function PayersSection() {
  const [pagadores, avatars] = await Promise.all([
    getPayers(),
    (async () => {
      try {
        const dir = path.join(process.cwd(), "public", "avatars");
        const files = await fs.readdir(dir);
        return files.filter((f) => /\.(png|jpg|jpeg|svg|webp)$/i.test(f));
      } catch {
        return [] as string[];
      }
    })(),
  ]);

  return <TablePayers pagadores={pagadores} avatars={avatars} />;
}
