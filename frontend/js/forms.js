// Platzhalter: Formulare sind in Meilenstein 1 noch nicht angebunden.
document.querySelectorAll('form[data-static]').forEach((form) => {
  const note = form.querySelector('.form-note');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    note.textContent = 'Dieses Formular ist noch nicht angebunden – es werden keine Daten gesendet.';
  });
});
