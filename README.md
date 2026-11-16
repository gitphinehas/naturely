# NATURELY

Webplattform für Naturbeobachtungen in deiner Umgebung (Uni-Projekt).
Nutzer:innen geben einen Ort und einen Radius ein und sehen passende Beobachtungen aus der [iNaturalist API](https://api.inaturalist.org/v2/docs/) als Kacheln.

> Idee, Zielgruppe, Anforderungen und Designkonzept stehen in [CONCEPT.md](CONCEPT.md).
> Diese README beschreibt den Aufbau des Repositories und die lokale Einrichtung.

**Aktueller Stand (Meilenstein 1):** statische Seiten, Hauptseite mit API-Abfrage und Pagination. Login, Registrierung und Kontaktformular sind noch nicht funktional. Datenbank, eigene REST-API und Karte folgen später.

---

## Repository-Struktur

```
naturely/
├── README.md                 Diese Datei
├── CONCEPT.md                Projektkonzept und Design
├── .gitignore
├── .vscode/
│   ├── extensions.json       Empfohlene VS-Code-Extensions (Live Server, Prettier)
│   └── settings.json         Live-Server-Root = /frontend, Port 5500
├── backend/                  Platzhalter für eigene REST-API und Datenbank (noch leer)
└── frontend/                 Alles, was der Browser lädt
    ├── index.html            Hauptseite: Hero, Suche, Ergebnis-Kacheln, „Weitere laden"
    ├── login.html            Login (statisch)
    ├── registrierung.html    Registrierung (statisch)
    ├── kontakt.html          Kontakt (statisch)
    ├── impressum.html        Impressum (Platzhaltertexte)
    ├── datenschutz.html      Datenschutzerklärung (Entwurf)
    ├── css/
    │   └── style.css         Gesamtes Design (Farben und Schriften als CSS-Variablen)
    ├── assets/
    │   ├── fonts/            Lokale Schriftdateien (DM Sans, Playfair Display)
    │   └── img/              Bilder (z. B. Hero-Foto)
    └── js/
        ├── main.js           Einstiegspunkt der Hauptseite: Formular, Zustand, Nachladen
        ├── config.js         API-URLs, Seitengröße (`PER_PAGE`), Timeout
        ├── forms.js          Platzhalter-Verhalten der noch nicht angebundenen Formulare
        ├── api/              Datenschicht (Fetch-Abfragen)
        │   ├── http.js       `fetch` mit Timeout, Statusprüfung, JSON-Parsing, Fehlerklasse
        │   ├── geocoding.js  Adresse → Koordinaten (OpenStreetMap Nominatim)
        │   └── inaturalist.js  Beobachtungen abrufen und für die Anzeige aufbereiten
        └── ui/
            └── cards.js      Erzeugt die Beobachtungskacheln im DOM
```

### Wie die Teile zusammenspielen

```
Eingabe (index.html) → main.js → geocoding.js → Nominatim
                                → inaturalist.js → iNaturalist API
                       main.js ← aufbereitete Daten
                       main.js → cards.js → Kacheln im DOM
```

- **Daten holen** (`js/api/`) und **darstellen** (`js/ui/`) sind getrennt. Für die spätere eigene REST-API kommt in `js/api/` ein weiteres Modul hinzu, die UI bleibt unverändert.
- Header und Footer sind in jeder HTML-Seite direkt enthalten. Bei Änderungen an der Navigation müssen alle sechs Seiten angepasst werden.
- Es werden keine Frameworks und keine externen JavaScript-Bibliotheken verwendet.

---

## Website lokal ansehen (VS Code + Live Server)

Die Seite nutzt ES-Module und `fetch`. Beides funktioniert nicht, wenn man die HTML-Datei einfach per Doppelklick (`file://`) öffnet. Du brauchst einen lokalen Webserver. Am einfachsten geht das mit der VS-Code-Extension **Live Server**.

### Einrichtung (einmalig)

1. Repository klonen und den **Projektordner** (`naturely/`, nicht nur `frontend/`) in VS Code öffnen:
   ```bash
   git clone <REPO-URL>
   cd naturely
   code .
   ```
2. Extension installieren: In VS Code links auf **Extensions** (`Strg+Shift+X` / `Cmd+Shift+X`), nach **Live Server** (Autor: Ritwick Dey) suchen und installieren.
   VS Code schlägt sie beim Öffnen des Ordners auch automatisch vor (über `.vscode/extensions.json`).

### Starten

1. Im Explorer `frontend/index.html` öffnen.
2. Unten rechts in der Statusleiste auf **Go Live** klicken. Alternativ Rechtsklick auf `index.html` → **Open with Live Server**.
3. Der Browser öffnet sich unter **http://127.0.0.1:5500**.
4. Änderungen an HTML, CSS oder JS werden beim Speichern automatisch neu geladen.

Beenden: Statusleiste auf **Port: 5500** klicken.

> Die Datei `.vscode/settings.json` setzt den Server-Root auf `/frontend`. Deshalb liegt die Startseite direkt unter `/` und die Links zwischen den Seiten funktionieren. Falls sich die Seite unter einer anderen URL öffnet, prüfe, ob der Projektordner (nicht ein Unterordner) in VS Code geöffnet ist.

### Alternative ohne Extension

Wenn Python installiert ist:

```bash
cd frontend
python3 -m http.server 5500
```

Danach `http://localhost:5500` im Browser öffnen. (Kein automatisches Neuladen.)

---

## Testen

1. Auf der Startseite z. B. „Tiergarten, Berlin" eingeben, Radius wählen und **Natur entdecken** klicken.
2. Es sollten 12 Kacheln erscheinen. **Weitere Beobachtungen laden** hängt die nächsten 12 an.
3. Entwicklerwerkzeuge im Browser mit `F12` öffnen:
   - **Netzwerk:** zeigt die Anfragen an Nominatim und iNaturalist (inkl. `page`-Parameter).
   - **Gerätesymbol / responsive Ansicht:** prüft die Layouts für Desktop, Tablet und Smartphone.
   - **Netzwerk → „Offline":** prüft die Fehlermeldung bei nicht erreichbarer API.
4. Randfälle: leere Eingabe, unsinniger Ort (z. B. „asdfghjkl"), sehr kleiner Radius in dünn besiedelter Gegend.

**Hinweis:** Die Seite braucht eine Internetverbindung, da die Daten direkt von iNaturalist und Nominatim geladen werden. Bitte deren Nutzungsrichtlinien beachten (siehe CONCEPT.md, Abschnitt 9). Das heißt vor allem, nicht automatisiert in schneller Folge Anfragen zu senden.

---

## Schriften einrichten

Aus Datenschutzgründen werden keine Schriften von Google-Servern geladen. 

- `frontend/assets/fonts/DMSans-Variable.woff2`
- `frontend/assets/fonts/PlayfairDisplay-Variable.woff2`

Bezugsquellen sind [Google Fonts](https://fonts.google.com/) (Download) oder [Fontsource](https://fontsource.org/). Ohne die Dateien nutzt die Seite Ersatzschriften (System-Sans und Georgia), funktioniert aber vollständig.

---

## Typische Probleme

| Problem | Ursache / Lösung |
|---|---|
| Seite öffnet sich, aber Suche tut nichts | Seite per `file://` geöffnet. Über Live Server starten. |
| Konsole: *CORS* oder *Module*-Fehler | Gleiche Ursache wie oben. |
| „Der Dienst ist nicht erreichbar" | Keine Internetverbindung oder API vorübergehend down. Netzwerk-Tab prüfen. |
| „Zu viele Anfragen" (HTTP 429) | Rate-Limit erreicht. Einen Moment warten. |
| CSS wird nicht geladen | Projektordner statt `frontend/` als Root, siehe Hinweis bei „Starten". |
| Port 5500 belegt | In `.vscode/settings.json` den Port ändern. |

---

## Geplante nächste Schritte

Siehe [CONCEPT.md](CONCEPT.md), Abschnitt 8: Filter und Sortierung, Detailansicht, Leaflet-Karte, Nutzerkonten, eigene REST-API mit Datenbank (`backend/`).
