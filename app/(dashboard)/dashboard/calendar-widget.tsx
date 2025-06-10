import { Calendar } from "@/components/ui/calendar";
import { UseDates } from "@/hooks/use-dates";

interface CalendarWidgetProps {
  month: string;
  bills: { data_vencimento: string }[];
  invoiceList: { dt_vencimento: number }[];
}

export default function CalendarWidget({
  month,
  bills,
  invoiceList,
}: CalendarWidgetProps) {
  const { optionsMeses } = UseDates();

  const [monthName, year] = month.split("-");
  const monthIndex = optionsMeses.findIndex(
    (m) => m.toLowerCase() === monthName.toLowerCase(),
  );
  const yearNumber = parseInt(year, 10);

  const billDates = (bills ?? []).map((b) => new Date(b.data_vencimento));
  const invoiceDates = (invoiceList ?? []).map(
    (inv) => new Date(yearNumber, monthIndex, Number(inv.dt_vencimento)),
  );

  const dueDates = [...billDates, ...invoiceDates];

  const today = new Date();
  const hasDueToday = dueDates.some(
    (d) => d.toDateString() === today.toDateString(),
  );

  return (
    <div>
      <Calendar
        showOutsideDays={false}
        month={new Date(yearNumber, monthIndex)}
        modifiers={{ due: dueDates }}
        modifiersClassNames={{ due: "bg-red-200 text-red-600" }}
      />
      {hasDueToday && (
        <p className="mt-2 text-center text-sm text-destructive">
          Vencimento hoje
        </p>
      )}
    </div>
  );
}
