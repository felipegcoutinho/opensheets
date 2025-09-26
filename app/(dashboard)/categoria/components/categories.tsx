import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import TableCategories from "../table-categories";

export default async function CategoriesSection() {
  const categorias = await getCategorias();
  return <TableCategories categorias={categorias} />;
}
