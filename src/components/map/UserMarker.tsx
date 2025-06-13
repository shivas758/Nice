import mapboxgl from 'mapbox-gl';

interface UserMarkerProps {
  user: any;
  map: mapboxgl.Map;
  onViewProfile: (userId: string) => void;
  currentUserId: string | undefined;
}

export class UserMarker extends mapboxgl.Marker {
  constructor({ user, map, onViewProfile, currentUserId }: UserMarkerProps) {
    const isCurrentUser = currentUserId === user.id;

    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.backgroundColor = isCurrentUser ? '#10B981' : '#4F46E5';
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.borderRadius = '50%';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.cursor = 'pointer';
    if (isCurrentUser) {
      el.style.border = '2px solid #047857';
    }
    el.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    `;

    if (user.longitude && user.latitude) {
        super({ element: el })
        super.setLngLat([user.longitude, user.latitude])
        super.addTo(map)
        super.getElement().addEventListener('click', () => {
            onViewProfile(user.id);
        });
    } else {
        super();
        console.warn('User missing coordinates:', user.id);
    }
  }
}
