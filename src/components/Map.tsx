import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MapContainer } from './map/MapContainer';
import { UserMarkers } from './map/UserMarkers';
import { UserProfileDialog } from './map/UserProfileDialog';
import { useAuth } from '@/contexts/AuthContext';

interface MapProps {
  className?: string;
  users?: any[]; // Add users prop
}

// Function to calculate distance between two points in kilometers
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const Map: React.FC<MapProps> = ({ className, users: propUsers }) => {
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useAuth();

  // First, get the current user's location
  const { data: currentUserLocation } = useQuery({
    queryKey: ['current-user-location', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('latitude, longitude')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching current user location:', error);
        throw error;
      }
      
      console.log('Current user location:', data);
      return data;
    },
    enabled: !!user?.id,
  });

  // Use propUsers if provided, otherwise fetch all users and filter them
  const { data: fetchedUsers } = useQuery({
    queryKey: ['map-users', currentUserLocation],
    queryFn: async () => {
      console.log('Fetching all users');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);
      
      if (error) throw error;

      // Only filter users within 30km if we have current user's location
      if (currentUserLocation?.latitude && currentUserLocation?.longitude) {
        return data.filter(user => {
          if (!user.latitude || !user.longitude) return false;
          
          const distance = calculateDistance(
            currentUserLocation.latitude,
            currentUserLocation.longitude,
            user.latitude,
            user.longitude
          );
          
          return distance <= 30; // 30km radius
        });
      }
      
      // If no current user location, return all users with valid coordinates
      return data.filter(user => user.latitude && user.longitude);
    },
  });

  const users = propUsers || fetchedUsers;

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg ${className}`}>
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-center text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className={`relative w-full h-full ${className}`} style={{ zIndex: 0 }}>
        <MapContainer onError={setError}>
          {map => (
            <UserMarkers
              map={map}
              users={users || []}
              onViewProfile={(userId) => {
                const selectedUser = users?.find(u => u.id === userId);
                if (selectedUser) {
                  setSelectedUser(selectedUser);
                  setIsProfileOpen(true);
                }
              }}
            />
          )}
        </MapContainer>
      </div>

      <UserProfileDialog
        isOpen={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        selectedUser={selectedUser}
      />
    </>
  );
};

export default Map;
