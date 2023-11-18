import React from 'react';
import { NextApiRequest, NextApiResponse } from 'next';
import { googleMapsAPIKeyObject } from '../../types/types';

interface ApiProps {
  query: {
    address?: string;
    // Otras propiedades de la query según sea necesario
  };
}

const Api: React.FC<ApiProps> = ({ query }) => {
  const { address } = query;

  const geocodeHandler = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address as string)}&key=${googleMapsAPIKeyObject.apiKey}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Datos de geocodificación:', data);
      } else {
        console.error('Error al obtener datos:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Llama a la función de manejo de geocodificación al renderizar el componente
  React.useEffect(() => {
    geocodeHandler();
  }, [query]);

  return <div>Contenido de la API</div>;
};

export default Api;




