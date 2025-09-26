import CreateCategory from "./modal/create-category";
import CategoriesSection from "./components/categories";

async function page() {
  return (
    <div className="my-4">
      <CreateCategory />
      <CategoriesSection />
    </div>
  );
}

export default page;
