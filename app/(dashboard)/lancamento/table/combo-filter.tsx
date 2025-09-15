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
import { RiArrowUpDownLine, RiCheckLine } from "@remixicon/react";
import { useState } from "react";

interface ComboboxFilterProps {
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  getIcon?: (value: string) => React.ReactNode;
}

export function ComboboxFilter({
  placeholder,
  options,
  value,
  onChange,
  getIcon,
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
            "border-input text-muted-foreground w-full justify-between truncate border-dashed font-normal shadow-none lg:w-[160px]",
            value &&
              value !== "all" &&
              "ring-primary bg-primary/10 font-bold ring-1",
          )}
        >
          {value && value !== "all" ? value : placeholder}
          <RiArrowUpDownLine className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
              <RiCheckLine
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
                <RiCheckLine
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option ? "opacity-100" : "opacity-0",
                  )}
                />
                {getIcon?.(option)}
                {option}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
