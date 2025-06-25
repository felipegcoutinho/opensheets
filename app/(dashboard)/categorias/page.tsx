import { getNewCategorias } from "@/app/actions/categories/fetch_categorias";
import CreateCategory from "./modal/create-category";
import TableCategories from "./table-categories";

async function page() {
  const categorias = await getNewCategorias();

  return (
    <div className="my-4">
      <CreateCategory />

      {/* <DraftForm /> */}

      <TableCategories categorias={categorias} />
    </div>
  );
}

export default page;
