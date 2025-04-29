import { getNewCategorias } from "@/app/services/categorias";
import TableCategories from "./table-categories";
import CreateCategory from "./modal/create-category";

async function page() {
  const categorias = await getNewCategorias();

  return (
    <div className="mt-4 w-full">
      <div className="my-4">
        <CreateCategory />
      </div>

      <TableCategories categorias={categorias} />
    </div>
  );
}

export default page;
