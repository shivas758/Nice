import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { UserMarker } from './UserMarker';
import { useAuth } from '@/contexts/AuthContext';

interface UserMarkersProps {
  map: mapboxgl.Map;
  users: any[];
  onViewProfile: (userId: string) => void;
}

export const UserMarkers: React.FC<UserMarkersProps> = ({ map, users, onViewProfile }) => {
  const markers = useRef<mapboxgl.Marker[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!map) return;

    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    const bounds = new mapboxgl.LngLatBounds();

    users.forEach(userData => {
      if (userData.longitude && userData.latitude) {
        const marker = new UserMarker({
          user: userData,
          map,
          onViewProfile,
          currentUserId: user?.id,
        });
        markers.current.push(marker);
        bounds.extend([userData.longitude, userData.latitude]);
      }
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
    };
  }, [map, users, onViewProfile, user?.id]);

  return null;
};
