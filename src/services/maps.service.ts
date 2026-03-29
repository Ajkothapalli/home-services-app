import { Env } from '../config/env';

export interface GeocodeResult {
  formattedAddress: string;
  coords: { lat: number; lng: number };
  placeId: string;
}

export interface DirectionsResult {
  distanceKm: number;
  durationMinutes: number;
  polyline: string;
  steps: { instruction: string; distanceMetres: number; durationSeconds: number }[];
}

const GEOCODE_BASE = 'https://maps.googleapis.com/maps/api/geocode/json';
const DIRECTIONS_BASE = 'https://maps.googleapis.com/maps/api/directions/json';

/**
 * Converts a human-readable address string into coordinates.
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  const url = `${GEOCODE_BASE}?address=${encodeURIComponent(address)}&key=${Env.GOOGLE_MAPS_KEY}`;
  const response = await fetch(url);
  const json = await response.json();

  if (json.status !== 'OK' || !json.results[0]) {
    throw new Error(`Geocoding failed for address: "${address}". Status: ${json.status}`);
  }

  const result = json.results[0];
  return {
    formattedAddress: result.formatted_address,
    coords: {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
    },
    placeId: result.place_id,
  };
}

/**
 * Converts coordinates into a human-readable address.
 */
export async function reverseGeocode(coords: { lat: number; lng: number }): Promise<GeocodeResult> {
  const url = `${GEOCODE_BASE}?latlng=${coords.lat},${coords.lng}&key=${Env.GOOGLE_MAPS_KEY}`;
  const response = await fetch(url);
  const json = await response.json();

  if (json.status !== 'OK' || !json.results[0]) {
    throw new Error(`Reverse geocoding failed for coords: ${JSON.stringify(coords)}`);
  }

  const result = json.results[0];
  return {
    formattedAddress: result.formatted_address,
    coords,
    placeId: result.place_id,
  };
}

/**
 * Fetches driving directions between two coordinates.
 */
export async function getDirections(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  mode: 'driving' | 'walking' | 'transit' = 'driving',
): Promise<DirectionsResult> {
  const url = `${DIRECTIONS_BASE}?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=${mode}&key=${Env.GOOGLE_MAPS_KEY}`;
  const response = await fetch(url);
  const json = await response.json();

  if (json.status !== 'OK' || !json.routes[0]) {
    throw new Error(`Directions failed. Status: ${json.status}`);
  }

  const leg = json.routes[0].legs[0];
  return {
    distanceKm: leg.distance.value / 1000,
    durationMinutes: Math.ceil(leg.duration.value / 60),
    polyline: json.routes[0].overview_polyline.points,
    steps: leg.steps.map((step: any) => ({
      instruction: step.html_instructions.replace(/<[^>]+>/g, ''),
      distanceMetres: step.distance.value,
      durationSeconds: step.duration.value,
    })),
  };
}
