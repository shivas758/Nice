import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  type: "profession" | "language";
  suggestions: Array<{ id: number; name: string }>;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const SearchInput = ({
  value,
  onChange,
  onSearch,
  onClear,
  type,
  suggestions,
  onKeyPress,
}: SearchInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className="relative cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <Input
            placeholder={`Select ${type}`}
            value={value}
            className="pr-20"
            readOnly
          />
          <div className="absolute right-3 top-3 flex gap-2">
            {value && (
              <X
                className="h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                  setIsOpen(false);
                }}
              />
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 opacity-50 transition-transform duration-200",
                isOpen && "transform rotate-180"
              )}
            />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0 z-[60]" 
        align="start"
        sideOffset={5}
      >
        <div className="max-h-[200px] overflow-auto rounded-md bg-white">
          {suggestions.map(item => (
            <div
              key={item.id}
              className={cn(
                "px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between",
                value === item.name && "bg-gray-50"
              )}
              onClick={() => {
                onChange(item.name);
                onSearch();
                setIsOpen(false);
              }}
            >
              <span>{item.name}</span>
              {value === item.name && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};