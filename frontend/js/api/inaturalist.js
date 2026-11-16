import { CONFIG } from '../config.js';
import { fetchJson, ApiError } from './http.js';

// API v2 liefert nur die angeforderten Felder (Rison-Syntax).
const FIELDS =
  '(id:!t,uri:!t,observed_on:!t,location:!t,' +
  'photos:(url:!t,attribution:!t),' +
  'taxon:(name:!t,preferred_common_name:!t,iconic_taxon_name:!t))';

const CATEGORIES = {
  Aves: 'Vogel', Insecta: 'Insekt', Plantae: 'Pflanze', Fungi: 'Pilz',
  Mammalia: 'Säugetier', Reptilia: 'Reptil', Amphibia: 'Amphibie',
  Arachnida: 'Spinnentier', Mollusca: 'Weichtier', Actinopterygii: 'Fisch',
};

/** Entfernung in km (Haversine). */
export function distanceKm(lat1, lng1, lat2, lng2) {
  const rad = (d) => (d * Math.PI) / 180;
  const a =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

/** Rohdaten der API -> einheitliches Objekt für die Darstellung. Toleriert fehlende Felder. */
function normalize(obs, center) {
  const [lat, lng] = String(obs.location ?? '').split(',').map(Number);
  const hasLoc = Number.isFinite(lat) && Number.isFinite(lng);
  const photo = obs.photos?.[0];
  return {
    id: obs.id,
    url: obs.uri ?? `https://www.inaturalist.org/observations/${obs.id}`,
    name: obs.taxon?.preferred_common_name ?? obs.taxon?.name ?? 'Unbekannte Art',
    scientificName: obs.taxon?.name ?? '',
    category: CATEGORIES[obs.taxon?.iconic_taxon_name] ?? 'Sonstiges',
    date: obs.observed_on ?? null,
    imageUrl: photo?.url ? photo.url.replace('/square.', '/medium.') : null,
    attribution: photo?.attribution ?? '',
    lat: hasLoc ? lat : null,
    lng: hasLoc ? lng : null,
    distanceKm: hasLoc ? distanceKm(center.lat, center.lng, lat, lng) : null,
  };
}

/** Eine Ergebnisseite abrufen. radius in km. */
export async function fetchObservations({ lat, lng, radius, page = 1 }) {
  const params = new URLSearchParams({
    lat, lng, radius, page,
    per_page: CONFIG.PER_PAGE,
    photos: 'true',
    quality_grade: 'research',
    order_by: 'observed_on',
    order: 'desc',
    locale: 'de',
    fields: FIELDS,
  });
  const data = await fetchJson(`${CONFIG.INAT_URL}?${params}`);
  if (!data || !Array.isArray(data.results)) {
    throw new ApiError('Die Antwort des Dienstes war ungültig.', 'parse');
  }
  return {
    total: Number(data.total_results) || 0,
    items: data.results.map((o) => normalize(o, { lat, lng })),
  };
}
