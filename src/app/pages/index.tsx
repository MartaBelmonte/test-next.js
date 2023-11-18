// Home.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Map from './map';

const Home = () => {
  const [address, setAddress] = useState('');
  const [searches, setSearches] = useState<string[]>([]);
  const [searchSuccess, setSearchSuccess] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (address.trim() !== '') {
      try {
        const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
        if (response.ok) {
          const data = await response.json();

          if (data.results.length > 0) {
            const location = data.results[0].geometry.location;
            setSearchSuccess(true);
            setSearches((prevSearches) => [...prevSearches, address]);
            router.push(`/map?lat=${location.lat}&lng=${location.lng}&address=${encodeURIComponent(address)}`);
          } else {
            console.error('No se encontró información de ubicación para la dirección proporcionada.');
            alert('No se encontró información de ubicación para la dirección proporcionada.');
            setSearchSuccess(false);
          }
        } else {
          console.error('Error al obtener datos:', response.statusText);
          setSearchSuccess(false);
        }
      } catch (error) {
        console.error('Error:', error);
        setSearchSuccess(false);
      }
    }
  };

  return (
    <div>
      <h1>Geolocalizador de Direcciones</h1>
      <input
        type="text"
        placeholder="Introduce una dirección"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={handleSearch}>Buscar</button>

      {searchSuccess && <Map searches={searches} setSearches={setSearches} />}
    </div>
  );
};

export default Home;




