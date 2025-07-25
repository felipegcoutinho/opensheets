import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import CreateCategory from "./modal/create-category";
import TableCategories from "./table-categories";

async function page() {
  const categorias = await getCategorias();

  return (
    <div className="my-4">
      <CreateCategory />

      <TableCategories categorias={categorias} />
    </div>
  );
}

export default page;
