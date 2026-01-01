# Troubleshooting: Weiße Seite auf GitHub Pages

## Checkliste zur Fehlerbehebung

### 1. Prüfe die Browser-Konsole
- Öffne die Seite: `https://dkushman.github.io/calorie-tracker/`
- Drücke F12 (oder Rechtsklick → "Untersuchen")
- Gehe zum Tab "Console"
- **Was siehst du?** 
  - Rote Fehlermeldungen? → Notiere sie
  - 404 Fehler für Assets? → Base path Problem
  - Keine Fehler? → Weiter zu Schritt 2

### 2. Prüfe die GitHub Pages Einstellungen
1. Gehe zu: `https://github.com/DKushman/calorie-tracker/settings/pages`
2. **Source:** Sollte "GitHub Actions" sein (NICHT "Deploy from a branch")
3. **Branch:** Sollte leer sein (wird von Actions verwaltet)
4. **Custom domain:** Sollte leer sein

### 3. Prüfe den Workflow
1. Gehe zu: `https://github.com/DKushman/calorie-tracker/actions`
2. Klicke auf den neuesten Workflow
3. **Ist er grün?** ✅ → Weiter zu Schritt 4
4. **Ist er rot?** ❌ → Klicke darauf und schaue, welcher Schritt fehlgeschlagen ist

### 4. Prüfe die URL
- **Richtige URL:** `https://dkushman.github.io/calorie-tracker/`
- **Wichtig:** Am Ende muss ein `/` sein!
- **Falsch:** `https://dkushman.github.io/calorie-tracker` (ohne Slash)

### 5. Cache leeren
- Drücke `Ctrl+Shift+R` (Windows) oder `Cmd+Shift+R` (Mac)
- Oder: Browser-Cache leeren

### 6. Prüfe die Network-Tab
1. Öffne F12 → Tab "Network"
2. Lade die Seite neu
3. **Sind alle Requests grün?** (Status 200)
4. **Gibt es 404 Fehler?** → Base path Problem

## Häufige Probleme

### Problem: 404 für Assets (JS/CSS Dateien)
**Lösung:** Base path ist falsch. Prüfe `vite.config.js`:
```js
base: '/calorie-tracker/',  // Muss mit / enden!
```

### Problem: Weiße Seite, keine Fehler
**Mögliche Ursachen:**
- React App startet nicht
- JavaScript-Fehler in der App
- localStorage Problem

### Problem: "Cannot GET /"
**Lösung:** Du musst die URL mit `/calorie-tracker/` aufrufen, nicht nur `/`

## Nächste Schritte
Wenn du die Fehlermeldungen aus der Browser-Konsole hast, kann ich dir gezielt helfen!

