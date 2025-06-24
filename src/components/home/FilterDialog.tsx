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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FilterDialogProps {
  filters: {
    profession: string;

    radius: string;
    language: string;
    showFriendsOnly: boolean;
  };
  onFilterChange: (key: string, value: string) => void;
  onSearch: () => void;
  professions?: any[];

  languages?: any[];
  userCurrentLocation: { latitude: number; longitude: number } | null;
}

const FilterDialog = ({
  filters,
  onFilterChange,
  onSearch,
  professions,

  languages,
  userCurrentLocation,
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

          <Select
            value={filters.radius}
            onValueChange={(value) => onFilterChange("radius", value)}
            disabled={!userCurrentLocation} // Disable if no location
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Distance Range" />
            </SelectTrigger>
            <SelectContent 
              className="bg-white shadow-lg" 
              position="popper" 
              sideOffset={5}
              style={{ zIndex: 51 }}
            >
              <SelectItem value="5">5 km</SelectItem>
              <SelectItem value="10">10 km</SelectItem>
              <SelectItem value="25">25 km</SelectItem>
              <SelectItem value="50">50 km</SelectItem>
              <SelectItem value="75">75 km</SelectItem>
              <SelectItem value="100">100 km</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center justify-between">
            <Label htmlFor="showFriendsOnly">Show Friends Only</Label>
            <Switch
              id="showFriendsOnly"
              checked={filters.showFriendsOnly}
              onCheckedChange={(checked) => onFilterChange("showFriendsOnly", checked)}
            />
          </div>

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
