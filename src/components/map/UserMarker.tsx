import L from 'leaflet';

interface UserMarkerProps {
  user: any;
  map: L.Map;
  onViewProfile: (userId: string) => void;
  currentUserId: string | undefined;
}

export class UserMarker extends L.Marker {
  constructor({ user, map, onViewProfile, currentUserId }: UserMarkerProps) {
    if (!map || !map.getContainer()) {
      console.error('Map not initialized');
      super([0, 0]);
      return;
    }

    const isCurrentUser = currentUserId === user.id;
    
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${isCurrentUser ? '#10B981' : '#4F46E5'};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        ${isCurrentUser ? 'border: 2px solid #047857;' : ''}
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    if (user.latitude && user.longitude) {
      super([user.latitude, user.longitude], { icon: customIcon });
      
      // Only add to map if map is ready
      if (map && map.getContainer()) {
        this.addTo(map);
        this.on('click', () => {
          onViewProfile(user.id);
        });
      }
    } else {
      super([0, 0]); // Fallback coordinates
      console.warn('User missing coordinates:', user.id);
    }
  }
}