// components/ui/combobox-filter.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Check from "remixicon-react/CheckLineIcon";
import ChevronsUpDown from "remixicon-react/ArrowUpDownLineIcon";
import { useState } from "react";

interface ComboboxFilterProps {
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function ComboboxFilter({
  placeholder,
  options,
  value,
  onChange,
}: ComboboxFilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "border-input w-[140px] justify-between truncate border-dashed font-normal",
            value && value !== "all" && "ring-primary font-bold ring-2",
          )}
        >
          {value && value !== "all" ? value : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandInput
            placeholder={`Buscar ${placeholder.toLowerCase()}...`}
          />
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              onSelect={() => {
                onChange("all");
                setOpen(false);
              }}
              className={cn(
                "cursor-pointer",
                value === "all" && "bg-accent text-foreground font-bold",
              )}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === "all" ? "opacity-100" : "opacity-0",
                )}
              />
              Todas
            </CommandItem>

            {options.map((option) => (
              <CommandItem
                key={option}
                onSelect={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={cn(
                  "cursor-pointer capitalize",
                  value === option && "bg-accent text-foreground font-bold",
                )}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option ? "opacity-100" : "opacity-0",
                  )}
                />
                {option}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
