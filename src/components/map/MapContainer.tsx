import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface MapContainerProps {
  children: (map: L.Map) => React.ReactNode;
  onError: (error: string) => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({ children, onError }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const { user } = useAuth();

  // Fetch current user's location
  const { data: currentUserProfile } = useQuery({
    queryKey: ['current-user-location', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('latitude, longitude')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Initialize map with a wider default view
      map.current = L.map(mapContainer.current).setView([20, 0], 2); // Default to a global view

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map.current);

      map.current.zoomControl.setPosition('topright');

      // If we have the user's location, center the map on it with closer zoom
      if (currentUserProfile?.latitude && currentUserProfile?.longitude) {
        const userLatLng = L.latLng(currentUserProfile.latitude, currentUserProfile.longitude);
        map.current.setView(userLatLng, 11); // Zoom level 11 for local view
      }

    } catch (err) {
      console.error('Error initializing map:', err);
      onError('Failed to initialize map. Please refresh the page and try again.');
    }

    return () => {
      map.current?.remove();
    };
  }, [onError, currentUserProfile]);

  return (
    <div className="absolute inset-0 rounded-lg">
      <div ref={mapContainer} className="h-full rounded-lg" />
      {map.current && children(map.current)}
    </div>
  );
};
