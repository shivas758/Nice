import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterDialogProps {
  filters: {
    profession: string;
    location: string;
    radius: string;
    language: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onSearch: () => void;
  professions?: any[];
  locations?: any[];
  languages?: any[];
}

const FilterDialog = ({
  filters,
  onFilterChange,
  onSearch,
  professions,
  locations,
  languages,
}: FilterDialogProps) => {
  const handleSearch = () => {
    onSearch();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border-2 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 transition-colors"
        >
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[425px] bg-white shadow-lg" 
        style={{ position: 'fixed', zIndex: 50 }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Filter Options</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            value={filters.profession}
            onValueChange={(value) => onFilterChange("profession", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Profession" />
            </SelectTrigger>
            <SelectContent 
              className="bg-white shadow-lg" 
              position="popper" 
              sideOffset={5}
              style={{ zIndex: 51 }}
            >
              <SelectItem value="all">All Professions</SelectItem>
              {professions?.map((profession) => (
                <SelectItem key={profession.id} value={profession.name}>
                  {profession.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.location}
            onValueChange={(value) => onFilterChange("location", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent 
              className="bg-white shadow-lg" 
              position="popper" 
              sideOffset={5}
              style={{ zIndex: 51 }}
            >
              <SelectItem value="all">All Locations</SelectItem>
              {locations?.map((location) => (
                <SelectItem key={location.id} value={location.name}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.radius}
            onValueChange={(value) => onFilterChange("radius", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Radius" />
            </SelectTrigger>
            <SelectContent 
              className="bg-white shadow-lg" 
              position="popper" 
              sideOffset={5}
              style={{ zIndex: 51 }}
            >
              <SelectItem value="5">5 miles</SelectItem>
              <SelectItem value="10">10 miles</SelectItem>
              <SelectItem value="20">20 miles</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.language}
            onValueChange={(value) => onFilterChange("language", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent 
              className="bg-white shadow-lg" 
              position="popper" 
              sideOffset={5}
              style={{ zIndex: 51 }}
            >
              <SelectItem value="all">All Languages</SelectItem>
              {languages?.map((language) => (
                <SelectItem key={language.id} value={language.name}>
                  {language.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DialogTrigger asChild>
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
              onClick={handleSearch}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;