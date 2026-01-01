# 🔥 Calorie Tracker App

Eine moderne Kalorienzähler-App gebaut mit React und Vite.

## Features

- ✅ Übersicht über tägliche Kalorien und Makros (Protein, Kohlenhydrate, Fett)
- ✅ Kreisdiagramme zur visuellen Darstellung des Fortschritts
- ✅ Mahlzeiten mit Bildern hinzufügen
- ✅ Schnelles Hinzufügen mit Regler (bis 1000 kcal)
- ✅ Alle Daten werden in localStorage gespeichert
- ✅ Responsive Design
- ✅ Moderne und benutzerfreundliche UI

## Installation

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build erstellen
npm run build
```

## Verwendung

1. **Mahlzeit hinzufügen**: Klicke auf das **+** oben rechts
   - Lade ein Bild hoch (optional)
   - Gib Name, Kalorien und Makros ein
   - Speichere die Mahlzeit

2. **Schnell hinzufügen**: Nutze den "⚡ Schnell hinzufügen" Button
   - Wähle mit dem Regler die Kalorien (0-1000)
   - Füge schnell Kalorien ohne Details hinzu

3. **Mahlzeit löschen**: Hover über eine Mahlzeit und klicke auf das **×**

## Technologien

- React 18
- Vite
- localStorage für Datenpersistenz
- CSS3 mit modernem Design
- Responsive Layout

## Tagesziele

Die Standard-Tagesziele sind:
- Kalorien: 2500 kcal
- Protein: 150g
- Kohlenhydrate: 300g
- Fett: 80g

Diese können im Code angepasst werden (App.jsx, DAILY_GOALS).

## Lizenz

MIT

