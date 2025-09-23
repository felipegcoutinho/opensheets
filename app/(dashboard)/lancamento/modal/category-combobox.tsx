"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { categoryIconsMap } from "@/hooks/use-category-icons";
import * as React from "react";

type Category = {
  id: number;
  nome: string;
  tipo_categoria: string;
  icone: string;
};

type CategoryComboboxProps = {
  categories: Category[];
  name: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function CategoryCombobox({
  categories,
  name,
  value,
  onChange,
  placeholder = "Selecione",
  disabled = false,
}: CategoryComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selectedCategory = React.useMemo(
    () => categories.find((categoria) => String(categoria.id) === value),
    [categories, value],
  );

  const grouped = React.useMemo(() => {
    const receitas = categories.filter(
      (categoria) => categoria.tipo_categoria === "receita",
    );
    const despesas = categories.filter(
      (categoria) => categoria.tipo_categoria === "despesa",
    );

    return { receitas, despesas };
  }, [categories]);

  const handleSelect = React.useCallback(
    (categoria: Category) => {
      onChange(String(categoria.id));
      setOpen(false);
    },
    [onChange],
  );

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const raf = window.requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus({ preventScroll: true });
      }
    });

    return () => {
      window.cancelAnimationFrame(raf);
    };
  }, [open]);

  return (
    <div className="w-full">
      <input type="hidden" name={name} value={value ?? ""} />

      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between capitalize"
            disabled={disabled}
          >
            {selectedCategory?.nome ?? placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={6}
          className="w-[--radix-popover-trigger-width] p-0"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <Command>
            <CommandInput
              ref={inputRef}
              autoFocus
              placeholder="Buscar categoria..."
            />
            <CommandList className="max-h-72 overflow-y-auto overscroll-contain">
              <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
              {grouped.receitas.length ? (
                <CommandGroup heading="Receitas">
                  {grouped.receitas.map((categoria) => {
                    const Icon = categoryIconsMap[
                      categoria.icone as keyof typeof categoryIconsMap
                    ];
                    return (
                      <CommandItem
                        key={categoria.id}
                        value={categoria.nome}
                        onSelect={() => handleSelect(categoria)}
                        className="cursor-pointer capitalize"
                      >
                        {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
                        {categoria.nome}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ) : null}
              {grouped.despesas.length ? (
                <CommandGroup heading="Despesas">
                  {grouped.despesas.map((categoria) => {
                    const Icon = categoryIconsMap[
                      categoria.icone as keyof typeof categoryIconsMap
                    ];
                    return (
                      <CommandItem
                        key={categoria.id}
                        value={categoria.nome}
                        onSelect={() => handleSelect(categoria)}
                        className="cursor-pointer capitalize"
                      >
                        {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
                        {categoria.nome}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ) : null}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
