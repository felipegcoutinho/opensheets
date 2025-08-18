import { getPayers } from "@/app/actions/pagadores/fetch_pagadores";
import CreatePayer from "./modal/create-payer";
import TablePayers from "./table-payers";

async function page() {
  const pagadores = await getPayers();

  return (
    <div className="my-4">
      <CreatePayer />
      <TablePayers pagadores={pagadores} />
    </div>
  );
}

export default page;
