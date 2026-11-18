/* Burger-Menü: öffnet/schließt die Navigation auf kleinen Bildschirmen */
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  // Ohne JS bleibt die Navigation sichtbar (Progressive Enhancement)
  document.documentElement.classList.add('js');

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  };

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  // Menü schließen nach Klick auf einen Link
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  // Escape schließt das Menü und setzt den Fokus zurück
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Beim Wechsel zur Desktop-Ansicht zurücksetzen
  window.matchMedia('(max-width: 600px)').addEventListener('change', () => setOpen(false));
})();
