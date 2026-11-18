# Promptlog -- NATURELY-Projekt

Dieser Promptlog dokumentiert die genutzten KI-Tools zum
Uni-Projekt **NATURELY**. Er enthält die verwendeten Prompts, das
jeweilige Modell und eine kurze Zusammenfassung der Antworten.

------------------------------------------------------------------------

## 1. Projektkonzept, Anforderungen und Design

### Model

ChatGPT -- GPT-6

### Prompt

> Wir bauen für ein Uni-Projekt eine Website, die erstmal ohne
> Frameworks auskommt und später diese Anforderungen erfüllen soll:
>
> -   Die Website stellt Inhalte übersichtlich auf mehreren Unterseiten
>     dar.
> -   Nutzer:innen können sich über Formulare registrieren und anmelden.
> -   Daten werden über eine externe REST-API dynamisch abgerufen und
>     dargestellt.
> -   Ein Teil dieser Daten wird mithilfe der Bibliothek Leaflet auf
>     einer interaktiven Karte dargestellt.
> -   Nutzer:innen können eigene Datensätze hinzufügen. Diese werden
>     über eine selbst implementierte REST-API in einer Datenbank
>     gespeichert.
>
> Die Website soll Naturely heißen und lokale Natursichtungen sichtbar, 
> suchbar, und selbst erstellbar machen. Dazu haben wir uns für die API
> von iNaturalist entschieden.
>
> Der erste Meilenstein besteht aus Design-Konzept und CSS,
> statische Seiten für Login, Registrierung, Datenschutz, Kontakt und
> Impressum sowie eine Hauptseite mit Fetch-API, Vanilla JavaScript,
> Kacheldarstellung, Pagination und Fehlerbehandlung.
>
> Erstelle  eine Beschreibung von Thema, Zielgruppe und REST-API,
> zusätzliche Anforderungen, mehrere Farbcode-Vorschläge und ein 
> Designkonzept für Kacheln und generelle Designsprache.

### Inhalt der Antwort zusammengefasst

-   Das Thema und die Ziele für die Website allgemein, als auch den ersten Meilenstein
    wurden wiederholt und zusammengefasst
-   Für die Kachelanordnung wurden drei bis vier Spalten auf Desktop,
    zwei auf Tablets und eine auf Smartphones vorgeschlagen.
-   Für die Pagination wurde ein Nachladen weiterer Ergebnisse über die
    serverseitigen Parameter der iNaturalist-API vorgesehen.
-   Die Antwort enthielt außerdem eine Zusammenfassung mehrerer
    Designkonzepte und einen Hinweis auf API-Nutzungsrichtlinien und
    Geocoding.

------------------------------------------------------------------------

## 2. Initiale README erstellen

### Model

ChatGPT -- GPT-6

### Prompt

> Erstelle eine Markdown, die alles davon mit links und
> Darstellungen abbildet. Ausgenommen werden sollen die
> Das soll die initiale README sein, aus der wir dann 
> aussortieren.

### Inhalt der Antwort zusammengefasst

-   Eine `README.md` für das NATURELY-Projekt wurde erstellt.
-   Die Datei fasst alle im ersten Prompt gelieferten Vorschläge 
    und Ideen zusammen.
-   Sie enthält Links zu iNaturalist, OpenStreetMap Nominatim, Leaflet
    und den verwendeten Google Fonts.
-   Das Designkonzept mit Farbpalette und Typografie wurde dokumentiert.
-   Die Hauptseite wurde durch ein schematisches Wireframe und die
    Beobachtungskacheln beschrieben.
-   Mermaid-Diagramme veranschaulichen den Datenfluss und die
    perspektivische Systemarchitektur.
-   Die technischen Leitplanken für den ersten Meilenstein sowie offene
    Punkte wurden aufgenommen.
-   Namensvorschläge und der separate Abschnitt mit weiteren
    Gestaltungsrichtlinien wurden wie gewünscht ausgelassen.

------------------------------------------------------------------------

## 3. Initiale Frontend-Version und Repo-Struktur

**Modell:** Claude Sonnet 5.5

**Prompt:**

> *(Anhang: README.md)*
>
> Diese README.md , fasst Projektziel und unsere festgelegte Designsprache zusammen. 
> Baue eine erste Grundstruktur für frontend und api calls, mit der wir arbeiten können
>
> * frontend: eine einfache Version der Statischen Seiten: Kontakt, Impressum, Datenschutzerklärung, Login / Registrierung
> * frontend: eine globale CSS Datei, die die gewählten Designs umsetzt
> * backend: FetchAbfrage der iNaturalist API
> * backend: AJAX für die darstellung der ergebnisse auf der hauptseite
>
> erkläre abschließend genau die Nutzung der API, sodass wir sie gut selbst einbinden können.

**Zusammenfassung der Antwort:**

- Die Syntax der iNaturalist API v2 (Parameter `fields` in Rison-Notation) wurde per Websuche geprüft.
- Es wurden folgende dateien erstellt
  - `frontend/` mit sechs HTML-Seiten (Startseite, Login, Registrierung, Kontakt, Impressum, Datenschutz), jeweils mit gemeinsamem Header und Footer
  - `css/style.css` mit Farben und Schriften aus dem Designkonzept als CSS-Variablen, responsivem Grid und Barrierefreiheits-Styles
  - `js/` mit getrennter Datenschicht (`api/`: Fetch mit Timeout und Fehlerbehandlung, Geocoding über Nominatim, iNaturalist-Abfrage) und Darstellungsschicht (`ui/cards.js`, `main.js`) inklusive Pagination über „Weitere laden"
  - `backend/` als Platzhalter für spätere REST-API und Datenbank
  - `.vscode/`-Konfiguration für Live Server
- „Backend-Fetch" und „AJAX" sind im ersten Meilenstein clientseitiges JavaScript und liegen deshalb in `js/api/` bzw. `js/ui/`.

------------------------------------------------------------------------
