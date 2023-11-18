// Map.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

interface MapProps {
  searches: string[];
  setSearches: React.Dispatch<React.SetStateAction<string[]>>;
}

const Map: React.FC<MapProps> = ({ searches, setSearches }) => {
  const router = useRouter();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [address, setAddress] = useState<string>('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const mapElement = document.getElementById('map');

    if (mapElement && window.google) {
      const { google } = window;

      const { query } = router;
      const lat = parseFloat(query.lat as string) || 0;
      const lng = parseFloat(query.lng as string) || 0;
      const address = query.address;

      if (!isNaN(lat) && !isNaN(lng) && address) {
        // Aquí deberías actualizar el estado de las búsquedas
      }

      if (!mapElement.dataset.mapInitialized) {
        const newMap = new google.maps.Map(mapElement, {
          center: { lat, lng },
          zoom: 8,
        });

        setMap(newMap);

        mapElement.dataset.mapInitialized = 'true';
      }
    }
  }, [router, map]);

  const performMapSearch = async (searchAddress: string) => {
    let marker;

    try {
      const apiKey = 'AIzaSyAxMst2ofWb1PLfmLH050Aee0HsyjiGibE';
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          searchAddress
        )}&key=${apiKey}`
      );

      if (response.ok) {
        const data = await response.json();

        if (data.results.length > 0) {
          const location = data.results[0].geometry.location;

          if (map) {
            map.setCenter(location);
            map.setZoom(8);

            marker = new window.google.maps.Marker({
              map: map,
              position: location,
            });
          }
        } else {
          console.error('No se encontró información de ubicación para la dirección proporcionada.');
        }
      } else {
        console.error('Error al obtener datos:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      performMapSearch(e.target.value);
    }, 500);

    setSearchTimeout(newTimeout);
  };

  const handleSearch = () => {
    if (address.trim() !== '') {
      setSearches((prevSearches) => [...prevSearches, address]);
      performMapSearch(address);
    }
  };

  return (
    <div>
      <h1>Mapa</h1>
      <div>
        <input
          type="text"
          placeholder="Introduce una dirección"
          value={address}
          onChange={handleChange}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>
      <div id="map" style={{ height: '400px', width: '400px' }}>
        <LoadScript googleMapsApiKey="AIzaSyAxMst2ofWb1PLfmLH050Aee0HsyjiGibE">
          <GoogleMap
            mapContainerStyle={{ height: '100%', width: '100%' }}
            center={{ lat: 0, lng: 0 }}
            zoom={8}
          ></GoogleMap>
        </LoadScript>
      </div>
      <h2>Búsquedas realizadas en esta sesión:</h2>
      <ul>
        {searches.map((search, index) => (
          <li key={index}>{search}</li>
        ))}
      </ul>
    </div>
  );
};

export default Map;







