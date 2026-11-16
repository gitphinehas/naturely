import { geocode } from './api/geocoding.js';
import { fetchObservations } from './api/inaturalist.js';
import { createCard } from './ui/cards.js';

const $ = (id) => document.getElementById(id);
const form = $('search-form');
const input = $('address');
const radiusSel = $('radius');
const grid = $('results');
const status = $('status');
const count = $('count');
const moreBtn = $('load-more');
const searchBtn = form.querySelector('button[type="submit"]');

const state = { center: null, radius: 5, page: 0, total: 0, loaded: 0, busy: false };

function setStatus(msg, isError = false) {
  status.textContent = msg;
  status.classList.toggle('status--error', isError);
}

function updateMore() {
  const hasMore = state.loaded < state.total;
  moreBtn.hidden = !hasMore;
  moreBtn.disabled = state.busy;
  count.textContent = state.total ? `${state.total.toLocaleString('de-DE')} Ergebnisse` : '';
}

async function loadPage(page) {
  state.busy = true;
  moreBtn.disabled = searchBtn.disabled = true;
  grid.setAttribute('aria-busy', 'true');
  setStatus('Lade Beobachtungen …');
  try {
    const { total, items } = await fetchObservations({ ...state.center, radius: state.radius, page });
    state.page = page;
    state.total = total;
    state.loaded += items.length;
    grid.append(...items.map(createCard)); // bereits geladene Kacheln bleiben erhalten
    if (state.loaded === 0) setStatus('Keine Beobachtungen gefunden. Versuche einen größeren Radius.');
    else setStatus(`${state.loaded} von ${total.toLocaleString('de-DE')} Beobachtungen angezeigt.`);
  } catch (err) {
    setStatus(`${err.message} Bitte versuche es erneut.`, true);
  } finally {
    state.busy = false;
    searchBtn.disabled = false;
    grid.removeAttribute('aria-busy');
    updateMore();
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (state.busy) return;
  const query = input.value.trim();
  if (!query) return setStatus('Bitte gib eine Adresse oder einen Ort ein.', true);

  state.busy = true;
  searchBtn.disabled = true;
  setStatus('Suche Ort …');
  grid.replaceChildren();
  Object.assign(state, { page: 0, total: 0, loaded: 0, radius: Number(radiusSel.value) });
  updateMore();

  try {
    const place = await geocode(query);
    if (!place) {
      state.busy = false;
      searchBtn.disabled = false;
      return setStatus('Diesen Ort haben wir nicht gefunden. Probiere eine genauere Eingabe.', true);
    }
    state.center = place;
    setStatus(`Standort: ${place.label}`);
    await loadPage(1);
  } catch (err) {
    state.busy = false;
    searchBtn.disabled = false;
    setStatus(`${err.message} Bitte versuche es erneut.`, true);
  }
});

moreBtn.addEventListener('click', () => {
  if (!state.busy) loadPage(state.page + 1);
});
