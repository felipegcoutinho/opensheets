import CreateCategory from "./modal/create-category";
import CategoriesSection from "./sections/categories";
import { Suspense } from "react";
import TransactionTableFallback from "@/components/fallbacks/transaction-table-fallback";

async function page() {
  return (
    <div className="my-4">
      <CreateCategory />
      <Suspense fallback={<TransactionTableFallback rows={8} />}>
        <CategoriesSection />
      </Suspense>
    </div>
  );
}

export default page;
