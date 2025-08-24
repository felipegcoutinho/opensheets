import CreateCategory from "./modal/create-category";
import CategoriesSection from "./sections/categories";
import { Suspense } from "react";
import TableSkeleton from "@/components/skeletons/table-skeleton";

async function page() {
  return (
    <div className="my-4">
      <CreateCategory />
      <Suspense fallback={<TableSkeleton rows={8} />}>
        <CategoriesSection />
      </Suspense>
    </div>
  );
}

export default page;
