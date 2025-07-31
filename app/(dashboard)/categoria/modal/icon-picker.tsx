"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { categoryIconOptions } from "@/utils/category-icons"; // seu arquivo de ícones
import { useState } from "react";

interface IconPickerProps {
  value: string | null;
  onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);

  const selectedIcon = categoryIconOptions.find((opt) => opt.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selectedIcon ? (
            <div className="flex items-center gap-2">
              <selectedIcon.icon className="h-5 w-5" />
              <span className="capitalize">{selectedIcon.value}</span>
            </div>
          ) : (
            "Escolher ícone"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Buscar ícone..." />
          <CommandList className="max-h-[300px] overflow-y-auto">
            {categoryIconOptions.map((opt) => (
              <CommandItem
                key={opt.value}
                onSelect={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <opt.icon className="mr-2 h-5 w-5" />
                <span className="capitalize">{opt.value}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
