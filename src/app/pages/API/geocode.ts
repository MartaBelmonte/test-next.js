// pages/api/geocode.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { googleMapsAPIKeyObject } from '../../types/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address as string)}&key=${googleMapsAPIKeyObject.apiKey}`
    );

    if (response.ok) {
      const data = await response.json();
      res.status(200).json(data);
    } else {
      console.error('Error al obtener datos:', response.statusText);
      res.status(response.status).end();
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).end();
  }
}



