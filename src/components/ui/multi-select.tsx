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

// Helper function to generate the image path for a skill
function getSkillImagePath(skillName: string, className?: string) {
    if (!className) return "/placeholder.png"; // Fallback image
    const formattedClassName = className.toLowerCase().replace(/\s+/g, '-');
    const formattedSkillName = skillName.toLowerCase().replace(/\s+/g, '-');
    // Handle potential typo in folder name
    const finalClassName = formattedClassName === 'dark-knight' ? 'dark-kinight' : formattedClassName;
    return `/${finalClassName}/skill/imagens/${formattedSkillName}.png`;
}


interface MultiSelectProps {
  selected: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder?: string;
  className?: string;
  itemType?: 'skill' | 'text';
  classNameProp?: string;
}

export function MultiSelect({
  selected,
  onChange,
  placeholder = "Select options",
  className,
  itemType = 'text',
  classNameProp,
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
                {itemType === 'skill' && (
                    <Image
                        src={getSkillImagePath(option, classNameProp)}
                        alt={option}
                        width={20}
                        height={20}
                        className="rounded-sm"
                        onError={(e) => {
                            // Hide image on error
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                )}
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
                if(e.key === "Enter" && inputValue.trim() !== "") {
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
        {open &&
        inputValue.length > 0 &&
        !selected.includes(inputValue.trim()) ? (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onSelect={() => handleSelect(inputValue.trim())}
                  className={"cursor-pointer flex items-center gap-2"}
                >
                    {itemType === 'skill' && (
                         <Image
                            src={getSkillImagePath(inputValue.trim(), classNameProp)}
                            alt={inputValue.trim()}
                            width={20}
                            height={20}
                            className="rounded-sm"
                            onError={(e) => {
                               e.currentTarget.style.display = 'none';
                            }}
                        />
                    )}
                  Adicionar "{inputValue}"
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
