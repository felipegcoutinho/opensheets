import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface BulkEditPayerSectionProps {
  applyPayer: boolean;
  payerSelection: string;
  onPayerChange: (value: string) => void;
  onApplyPayerChange: (value: boolean) => void;
  disabled: boolean;
  isFetchingPayers: boolean;
  payerOptions: {
    id: string;
    nome: string;
    role?: string | null;
  }[];
}

export function BulkEditPayerSection({
  applyPayer,
  payerSelection,
  onPayerChange,
  onApplyPayerChange,
  disabled,
  isFetchingPayers,
  payerOptions,
}: BulkEditPayerSectionProps) {
  return (
    <fieldset className="space-y-2 border-b border-dashed pb-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Label className="text-sm">Pagador</Label>
          <p className="text-muted-foreground text-xs">
            Escolha um novo responsável ou remova a vinculação atual.
          </p>
        </div>
        <Switch
          checked={applyPayer}
          onCheckedChange={onApplyPayerChange}
          aria-label="Aplicar pagador"
        />
      </div>
      <Select
        name="pagador_id"
        value={payerSelection}
        onValueChange={onPayerChange}
        disabled={
          !applyPayer || disabled || isFetchingPayers
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={
              isFetchingPayers
                ? "Carregando pagadores..."
                : "Selecione um pagador ou remova"
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__clear__">Remover pagador</SelectItem>
          {payerOptions.map((payer) => (
            <SelectItem
              key={payer.id}
              value={payer.id}
              className="capitalize"
            >
              {payer.nome}
              {payer.role ? ` • ${payer.role}` : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </fieldset>
  );
}