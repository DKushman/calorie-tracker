# GitHub Pages Deployment Anleitung

## Option 1: Automatisches Deployment mit GitHub Actions (Empfohlen)

1. Gehe zu deinem Repository auf GitHub: `https://github.com/DKushman/calorie-tracker`
2. Klicke auf **Settings** → **Pages**
3. Unter **Source** wähle **GitHub Actions**
4. Der Workflow wird automatisch ausgeführt, wenn du zu `main` pusht

Die Seite ist dann verfügbar unter:
`https://dkushman.github.io/calorie-tracker/`

## Option 2: Manuelles Deployment

Falls du die Seite manuell deployen möchtest:

1. Baue die App:
```bash
npm run build
```

2. Gehe zu **Settings** → **Pages** in deinem GitHub Repository
3. Wähle **Deploy from a branch**
4. Wähle den Branch `main` und den Ordner `/ (root)`
5. Erstelle einen `gh-pages` Branch und pushe den `dist` Ordner:
```bash
git subtree push --prefix dist origin gh-pages
```

## Wichtig: Base Path

Falls deine Seite unter einem anderen Pfad läuft (z.B. `username.github.io` statt `username.github.io/repo-name`), ändere in `vite.config.js`:

```js
base: '/',  // Für username.github.io
// oder
base: '/calorie-tracker/',  // Für username.github.io/calorie-tracker
```

