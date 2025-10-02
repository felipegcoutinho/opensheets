import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CategoryCombobox } from "../category-combobox";

interface BulkEditCategorySectionProps {
  applyCategory: boolean;
  selectedCategory: string | undefined;
  onCategoryChange: (value: string | undefined) => void;
  onApplyCategoryChange: (value: boolean) => void;
  disabled: boolean;
  categories: {
    id: number | string;
    nome: string;
    tipo_categoria: string;
    icone?: string | null;
  }[];
}

export function BulkEditCategorySection({
  applyCategory,
  selectedCategory,
  onCategoryChange,
  onApplyCategoryChange,
  disabled,
  categories,
}: BulkEditCategorySectionProps) {
  return (
    <fieldset className="space-y-2 border-b border-dashed pb-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Label className="text-sm">Categoria</Label>
          <p className="text-muted-foreground text-xs">
            Defina uma nova categoria para todos os lançamentos.
          </p>
        </div>
        <Switch
          checked={applyCategory}
          onCheckedChange={onApplyCategoryChange}
          aria-label="Aplicar nova categoria"
          disabled={disabled}
        />
      </div>
      <CategoryCombobox
        name="categoria_id"
        categories={categories}
        value={selectedCategory}
        onChange={onCategoryChange}
        disabled={!applyCategory || disabled}
        placeholder="Selecione a categoria"
      />
    </fieldset>
  );
}