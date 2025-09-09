"use client";

import * as React from "react";
import { X } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  selected: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder?: string;
  className?: string;
  options?: string[]; // New prop for predefined options
}

export function MultiSelect({
  selected,
  onChange,
  placeholder = "Select options",
  className,
  options = [],
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback(
    (option: string) => {
      onChange(selected.filter((s) => s !== option));
    },
    [onChange, selected]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "" && selected.length > 0) {
            handleUnselect(selected[selected.length - 1]);
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [handleUnselect, selected]
  );
  
  const handleSelect = (option: string) => {
    setInputValue("");
    if (!selected.includes(option)) {
        onChange([...selected, option]);
    }
  }

  const filteredOptions = options.filter(option => 
    !selected.includes(option) && 
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Option to add a custom value if it doesn't exist in the options
  const canAddCustom = inputValue.trim() !== "" && !options.includes(inputValue.trim()) && !selected.includes(inputValue.trim());


  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div
        className={cn(
          "group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
           className
        )}
      >
        <div className="flex flex-wrap gap-1">
          {selected.map((option) => {
            return (
              <Badge key={option} variant="secondary" className="flex items-center gap-2">
                {option}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
                if(e.key === "Enter" && canAddCustom) {
                    e.preventDefault();
                    handleSelect(inputValue.trim());
                }
            }}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && (filteredOptions.length > 0 || canAddCustom) ? (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              <CommandGroup>
                {filteredOptions.map((option) => (
                   <CommandItem
                    key={option}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => handleSelect(option)}
                    className={"cursor-pointer"}
                  >
                    {option}
                  </CommandItem>
                ))}
                 {canAddCustom && (
                    <CommandItem
                        onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        }}
                        onSelect={() => handleSelect(inputValue.trim())}
                        className={"cursor-pointer"}
                    >
                        Adicionar "{inputValue}"
                    </CommandItem>
                 )}
              </CommandGroup>
            </CommandList>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
