// Alle Texte werden per textContent eingefügt (kein innerHTML -> kein XSS).
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
};

const dateFmt = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' });
const kmFmt = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });

export function formatDate(iso) {
  const d = iso ? new Date(iso) : null;
  return d && !Number.isNaN(d.getTime()) ? dateFmt.format(d) : 'Datum unbekannt';
}

export function createCard(o) {
  const li = el('li');
  const card = el('article', 'card');

  const media = el('div', 'card__media');
  if (o.imageUrl) {
    const img = el('img');
    img.src = o.imageUrl;
    img.alt = `${o.name}${o.scientificName ? ` (${o.scientificName})` : ''}`;
    img.loading = 'lazy';
    img.addEventListener('error', () => {
      img.remove();
      media.classList.add('card__media--empty');
      media.textContent = 'Kein Bild verfügbar';
    });
    media.append(img);
  } else {
    media.classList.add('card__media--empty');
    media.textContent = 'Kein Bild verfügbar';
  }

  const body = el('div', 'card__body');
  const meta = el('div', 'card__meta');
  meta.append(el('span', 'badge', o.category), el('time', null, formatDate(o.date)));
  const title = el('h3', 'card__title', o.name);
  const latin = el('p', 'card__latin', o.scientificName);

  const foot = el('div', 'card__foot');
  foot.append(
    el('span', null, o.distanceKm != null ? `📍 ${kmFmt.format(o.distanceKm)} km entfernt` : 'Ort unbekannt')
  );
  const link = el('a', null, 'Details ansehen →');
  link.href = o.url; // TODO ZF03: eigene Detailansicht
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  foot.append(link);

  body.append(meta, title, latin, foot);
  card.append(media, body);
  li.append(card);
  return li;
}
