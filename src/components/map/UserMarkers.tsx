import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { UserMarker } from './UserMarker';
import { useAuth } from '@/contexts/AuthContext';

interface UserMarkersProps {
  map: L.Map;
  users: any[];
  onViewProfile: (userId: string) => void;
}

export const UserMarkers: React.FC<UserMarkersProps> = ({ map, users, onViewProfile }) => {
  const markers = useRef<L.Marker[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Wait for the map to be ready
    if (!map || !map.getContainer()) {
      console.log('Map not ready yet');
      return;
    }

    console.log('Creating markers for users:', users.length);

    // Clean up existing markers
    markers.current.forEach(marker => {
      if (marker) marker.remove();
    });
    markers.current = [];

    // Add new markers
    users.forEach(userData => {
      try {
        if (!userData.latitude || !userData.longitude) {
          console.log('Skipping user without coordinates:', userData.id);
          return;
        }

        const marker = new UserMarker({ 
          user: userData, 
          map, 
          onViewProfile,
          currentUserId: user?.id
        });
        
        if (marker) markers.current.push(marker);
      } catch (error) {
        console.error('Error creating marker for user:', userData.id, error);
      }
    });

    // Fit bounds only if we have markers
    if (markers.current.length > 0) {
      try {
        const group = L.featureGroup(markers.current);
        map.fitBounds(group.getBounds(), { padding: [50, 50] });
      } catch (error) {
        console.error('Error fitting bounds:', error);
      }
    }

    return () => {
      console.log('Cleaning up markers');
      markers.current.forEach(marker => {
        if (marker) marker.remove();
      });
    };
  }, [map, users, onViewProfile, user?.id]);

  return null;
};