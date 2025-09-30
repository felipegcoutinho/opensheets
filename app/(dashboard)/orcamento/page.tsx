import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import CreateBudget from "./modal/create-budget";
import BudgetsSection from "./components/budgets";
import Rule502030Section from "./components/rule-502030";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function page({ searchParams }: { searchParams?: { periodo?: string } }) {
  const month = await getMonth({ searchParams });
  const categorias = await getCategorias();

  return (
    <>
      <MonthPicker />
      <Tabs defaultValue="budgets" className="my-2 space-y-4">
        <TabsList>
          <TabsTrigger value="budgets">Orçamentos</TabsTrigger>
          <TabsTrigger value="rule">Regra 50/30/20</TabsTrigger>
        </TabsList>

        <TabsContent value="budgets" className="space-y-4">
          <CreateBudget categorias={categorias} />
          <BudgetsSection month={month} />
        </TabsContent>

        <TabsContent value="rule">
          <Rule502030Section />
        </TabsContent>
      </Tabs>
    </>
  );
}
