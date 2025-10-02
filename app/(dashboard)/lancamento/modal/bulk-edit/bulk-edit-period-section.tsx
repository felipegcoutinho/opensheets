import { UseDates } from "@/hooks/use-dates";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface BulkEditPeriodSectionProps {
  applyPeriod: boolean;
  periodSelection: string;
  onPeriodChange: (value: string) => void;
  onApplyPeriodChange: (value: boolean) => void;
  disabled: boolean;
  monthOptions: {
    value: string;
    label: string;
  }[];
}

export function BulkEditPeriodSection({
  applyPeriod,
  periodSelection,
  onPeriodChange,
  onApplyPeriodChange,
  disabled,
  monthOptions,
}: BulkEditPeriodSectionProps) {
  const { getMonthOptions } = UseDates();
  
  return (
    <fieldset className="space-y-2 pb-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Label className="text-sm">Período</Label>
          <p className="text-muted-foreground text-xs">
            Atualize o mês/ano de competência para os lançamentos.
          </p>
        </div>
        <Switch
          checked={applyPeriod}
          onCheckedChange={onApplyPeriodChange}
          aria-label="Aplicar período"
        />
      </div>
      <Select
        name="periodo"
        value={periodSelection}
        onValueChange={onPeriodChange}
        disabled={!applyPeriod || disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione o período" />
        </SelectTrigger>
        <SelectContent>
          {monthOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="capitalize"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </fieldset>
  );
}