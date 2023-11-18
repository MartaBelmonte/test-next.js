// map.tsx
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';

interface MapProps {
  searches: string[];
  setSearches: React.Dispatch<React.SetStateAction<string[]>>;
}

const DynamicMap = dynamic(() => import('@react-google-maps/api').then((module) => module.GoogleMap), {
  ssr: false,
});

const Map: React.FC<MapProps> = ({ searches, setSearches }) => {
  const pathname = usePathname();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [address, setAddress] = useState<string>('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Resto del código...
  }, [pathname, map]);

  const performMapSearch = async (searchAddress: string) => {
    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions({ input: searchAddress }, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions && predictions.length > 0) {
        const placeService = new google.maps.places.PlacesService(map as google.maps.Map);
        placeService.getDetails({ placeId: predictions[0].place_id }, (place, placeStatus) => {
          if (placeStatus === google.maps.places.PlacesServiceStatus.OK && place) {
            const { geometry } = place;
            if (geometry && geometry.location) {
              map?.setCenter(geometry.location);
            }
          }
        });
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => performMapSearch(e.target.value), 300);
    setSearchTimeout(timeout);
  };

  const handleSearch = () => {
    if (address) {
      performMapSearch(address);
      setSearches((prevSearches) => [...prevSearches, address]);
    }
  };

  return (
    <div>
      <h1>Mapa</h1>
      <div>
        {/* Resto del código... */}
      </div>
      <div id="map" style={{ height: '400px', width: '400px' }}>
        <LoadScript googleMapsApiKey="AIzaSyAxMst2ofWb1PLfmLH050Aee0HsyjiGibE">
          <GoogleMap
            mapContainerStyle={{ height: '400px', width: '400px' }}
            center={{ lat: 0, lng: 0 }}
            zoom={8}
          />
        </LoadScript>
      </div>
      <h2>Búsquedas realizadas en esta sesión:</h2>
      <ul>
        {/* Resto del código... */}
      </ul>
    </div>
  );
};

export default Map;












