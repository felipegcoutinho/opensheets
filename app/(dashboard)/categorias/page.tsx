import { getNewCategorias } from "@/app/services/categorias";
import CreateCategory from "./modal/create-category";
import { DraftForm } from "./modal/create-category-new";
import TableCategories from "./table-categories";

async function page() {
  const categorias = await getNewCategorias();

  return (
    <div className="my-4">
      <CreateCategory />

      <DraftForm />

      <TableCategories categorias={categorias} />
    </div>
  );
}

export default page;
