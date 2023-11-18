// app.tsx
"use client";
import React, { useState } from 'react';
import Index from '../app/pages/index';
import Map from '../app/pages/map';
import Api from '../app/pages/API/geocode';
import { googleMapsAPIKeyObject } from './types/types';

const Home = () => {
  const [searches, setSearches] = useState<string[]>([]);
  const query = {
    address: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent('dirección')}&key=${googleMapsAPIKeyObject.apiKey}`,
  };

  return (
    <main>
      <Index />
      <Map searches={searches} setSearches={setSearches} />
      <Api query={query} />
    </main>
  );
};

export default Home;




