import { CONFIG } from '../config.js';
import { fetchJson } from './http.js';

/** Adresse -> { lat, lng, label } oder null, wenn nichts gefunden wurde. */
export async function geocode(query) {
  const params = new URLSearchParams({
    q: query,
    format: 'jsonv2',
    limit: '1',
    'accept-language': 'de',
  });
  const data = await fetchJson(`${CONFIG.NOMINATIM_URL}?${params}`);
  if (!Array.isArray(data) || data.length === 0) return null;
  const lat = parseFloat(data[0].lat);
  const lng = parseFloat(data[0].lon);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng, label: data[0].display_name };
}
