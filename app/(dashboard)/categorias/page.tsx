import { getNewCategorias } from "@/app/services/categorias";
import CreateCategory from "./modal/create-category";
import TableCategories from "./table-categories";

async function page() {
  const categorias = await getNewCategorias();

  return (
    <div className="my-4">
      <CreateCategory />

      <TableCategories categorias={categorias} />
    </div>
  );
}

export default page;
