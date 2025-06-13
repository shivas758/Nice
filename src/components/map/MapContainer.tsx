import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// IMPORTANT: Replace with your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoibmFtYWRoYXYiLCJhIjoiY21idXJ0YW9uMDlrZzJqczZsY2RmMTg0OSJ9.KAMklXE0PG0dzx_mg2AnmA';
interface MapContainerProps {
  children: (map: mapboxgl.Map) => React.ReactNode;
  onError: (error: string) => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({ children, onError }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { user } = useAuth();

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
    if (map.current || !mapContainer.current) return;

    try {
      const lng = currentUserProfile?.longitude || 0;
      const lat = currentUserProfile?.latitude || 20;
      const zoom = currentUserProfile?.latitude ? 11 : 2;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setMapLoaded(true);
      });

    } catch (err) {
      console.error('Error initializing map:', err);
      onError('Failed to initialize map. Please refresh the page and try again.');
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [onError, currentUserProfile]);

  return (
    <div className="absolute inset-0 rounded-lg">
      <div ref={mapContainer} className="h-full rounded-lg" />
      {mapLoaded && map.current && children(map.current)}
    </div>
  );
};
