import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchTypeSelectProps {
  value: "profession" | "language";
  onChange: (value: "profession" | "language") => void;
}

export const SearchTypeSelect = ({ value, onChange }: SearchTypeSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Label htmlFor="searchType">Search by</Label>
      <Select
        value={value}
        onOpenChange={setIsOpen}
        open={isOpen}
        onValueChange={(newValue: "profession" | "language") => {
          onChange(newValue);
          // Keep the select open after selection
        }}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select search type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="profession">Profession</SelectItem>
          <SelectItem value="language">Language</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};