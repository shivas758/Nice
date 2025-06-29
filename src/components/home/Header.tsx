import { Logo } from "@/components/Logo";
import FilterDialog from "./FilterDialog";

interface HeaderProps {
  filters: {
    profession: string;

    radius: string;
    language: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onSearch: () => void;
  professions?: any[];

  languages?: any[];
  userCurrentLocation: { latitude: number; longitude: number } | null;
}

const Header = ({
  filters,
  onFilterChange,
  onSearch,
  professions,

  languages,
  userCurrentLocation,
}: HeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo size="sm" className="ml-2" />
          <FilterDialog
            filters={filters}
            onFilterChange={onFilterChange}
            onSearch={onSearch}
            professions={professions}

            languages={languages}
            userCurrentLocation={userCurrentLocation}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
