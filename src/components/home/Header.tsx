import { Logo } from "@/components/Logo";
import FilterDialog from "./FilterDialog";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  filters: {
    profession: string;
    radius: string;
    language: string;
    gender: string;
    showFriendsOnly: boolean;
  };
  onFilterChange: (key: string, value: string) => void;
  onSearch: () => void;
  professions?: any[];
  languages?: any[];
  userCurrentLocation: { latitude: number; longitude: number } | null;
  onLogout: () => void;
  onClearFilters: () => void;
  defaultFilters: {
    profession: string;
    radius: string;
    language: string;
    gender: string;
    showFriendsOnly: boolean;
  };
}

const Header = ({
  filters,
  onFilterChange,
  onSearch,
  professions,
  languages,
  userCurrentLocation,
  onLogout,
  onClearFilters,
  defaultFilters,
}: HeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo size="sm" className="ml-2" />
          <div className="flex items-center gap-2">
            <FilterDialog
              filters={filters}
              onFilterChange={onFilterChange}
              onSearch={onSearch}
              professions={professions}
              languages={languages}
              userCurrentLocation={userCurrentLocation}
              onClearFilters={onClearFilters}
              defaultFilters={defaultFilters}
            />
            <Button
              variant="outline"
              size="sm"
              //className="border-2 hover:bg-gradient-to-r hover:text-red-600 hover:bg-red-50 transition-colors"
              className="border-2 text-red-600 hover:text-red-600 hover:bg-red-100 transition-colors"
              onClick={onLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
