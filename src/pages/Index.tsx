import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Map from "@/components/Map";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/home/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react"; // Added this import

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    profession: "all",
    location: "all",
    radius: "5",
    language: "all",
  });
  const [showResults, setShowResults] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Fetch filter options
  const { data: professions } = useQuery({
    queryKey: ["professions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professions")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Update user's location
  const updateUserLocation = async (latitude: number, longitude: number) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ latitude, longitude })
        .eq('id', user?.id);

      if (error) throw error;

      console.log('Location updated successfully');
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: "Error",
        description: "Failed to update your location. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Request and handle location permissions
  useEffect(() => {
    const getLocation = async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        await updateUserLocation(latitude, longitude);
        
        setLocationError(null);
      } catch (error) {
        console.error('Location error:', error);
        setLocationError('Location services are disabled. You can still view other users on the map.');
        toast({
          title: "Location Services Disabled",
          description: "You can still view other users, but your location won't be shown on the map.",
          variant: "default",
        });
      }
    };

    if (user) {
      getLocation();
    }
  }, [user]);

  // Fetch filtered users
  const { data: filteredUsers } = useQuery({
    queryKey: ["filtered-users", filters],
    queryFn: async () => {
      let query = supabase.from("profiles").select("*");

      if (filters.profession !== "all") {
        query = query.eq("profession", filters.profession);
      }
      if (filters.location !== "all") {
        query = query.eq("location", filters.location);
      }
      if (filters.language !== "all") {
        query = query.contains("languages", [filters.language]);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: showResults,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    console.log("Filter changed:", key, value);
  };

  const handleSearch = () => {
    console.log("Searching with filters:", filters);
    setShowResults(true);
    toast({
      title: "Searching Users",
      description: "Finding community members based on your filters...",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 overflow-auto">
      <Header
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        professions={professions}
        locations={locations}
        languages={languages}
      />

      <main className="flex-1 container mx-auto max-w-7xl pt-20 px-4 pb-4">
        <div className="grid gap-6">
          {/* Map Container - Centered with flex */}
          <div className="flex justify-center items-center min-h-[60vh]">
            <Card className="w-full max-w-4xl h-[50vh] bg-white shadow-lg rounded-xl overflow-hidden">
              <Map className="w-full h-full" />
            </Card>
          </div>

          {/* Filtered Results - Scrollable section */}
          {showResults && filteredUsers && (
            <div className="space-y-4 animate-fade-in pb-20">
              <h2 className="text-xl font-semibold text-gray-800">
                Found {filteredUsers.length} community members
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user: any) => (
                  <Card key={user.id} className="p-4 bg-white shadow hover:shadow-md transition-shadow">
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </h3>
                      {user.profession && (
                        <p className="text-sm text-gray-600">{user.profession}</p>
                      )}
                      {user.location && (
                        <p className="text-sm text-gray-600">{user.location}</p>
                      )}
                      {user.languages && (
                        <p className="text-sm text-gray-600">
                          Languages: {user.languages.join(", ")}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
