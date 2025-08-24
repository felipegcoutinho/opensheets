import CreatePayer from "./modal/create-payer";
import { Suspense } from "react";
import TableSkeleton from "@/components/skeletons/table-skeleton";
import PayersSection from "./sections/payers";

async function page() {
  return (
    <div className="my-4">
      <CreatePayer avatars={[]} />
      <Suspense fallback={<TableSkeleton rows={10} /> } >
        <PayersSection />
      </Suspense>
    </div>
  );
}

export default page;
