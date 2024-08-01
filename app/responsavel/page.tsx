import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { UseDates } from "@/hooks/UseDates";
import PageUsers from "./page-users";

export default function page({ searchParams }) {
  const { currentMonthName, currentYear } = UseDates();

  const defaultPeriodo = `${currentMonthName}-${currentYear}`;

  const month = searchParams?.periodo ?? defaultPeriodo;

  return (
    <>
      <div className="w-full">
        <Breadcrumb className="py-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/responsavel">Responsáveis</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <PageUsers month={month} />
    </>
  );
}
