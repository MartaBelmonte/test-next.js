import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const Map = () => {
  const router = useRouter();
  const [searches, setSearches] = useState(new Set());
  const [map, setMap] = useState(null);
  const [address, setAddress] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const mapElement = document.getElementById('map');

    if (mapElement && window.google) {
      const { google } = window;

      const { query } = router;
      const lat = parseFloat(query.lat) || 0;
      const lng = parseFloat(query.lng) || 0;
      const address = query.address;

      if (!isNaN(lat) && !isNaN(lng) && address) {
        const updatedSearches = new Set([...searches, address]);
        setSearches(updatedSearches);
      }

      // Revisamos si el mapa ya fue creado
      if (!mapElement.dataset.mapInitialized) {
        const newMap = new google.maps.Map(mapElement, {
          center: { lat, lng },
          zoom: 8,
        });

        setMap(newMap);

        // Crear el marcador
        const marker = new google.maps.Marker({
          map: newMap,
          position: { lat, lng },
        });

        // Marcamos que el mapa fue inicializado
        mapElement.dataset.mapInitialized = 'true';
      }
    }
  }, [router, map, searches]);

  const handleSearch = async () => {
    if (address.trim() !== '') {
      const updatedSearches = new Set([...searches, address]);
      setSearches(updatedSearches);

      // Realizar búsqueda en el mapa
      await performMapSearch(address);
    }
  };

  const performMapSearch = async (searchAddress) => {
    let marker;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          searchAddress
        )}&key=AIzaSyAxMst2ofWb1PLfmLH050Aee0HsyjiGibE`
      );

      if (response.ok) {
        const data = await response.json();

        if (data.results.length > 0) {
          const location = data.results[0].geometry.location;

          if (map) {
            map.setCenter(location);
            map.setZoom(8);

            // Actualizar la posición del marcador
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

  const handleChange = (e) => {
    setAddress(e.target.value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      performMapSearch(e.target.value);
    }, 500);

    setSearchTimeout(newTimeout);
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
        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={{ lat: 0, lng: 0 }}
          zoom={8}
        ></GoogleMap>
      </div>
      <h2>Búsquedas realizadas en esta sesión:</h2>
      <ul>
        {[...searches].map((search, index) => (
          <li key={index}>{search}</li>
        ))}
      </ul>
    </div>
  );
};

export default Map;
