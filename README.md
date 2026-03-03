# Portfolio Website

This is my personal portfolio site built with React, Vite, and Three.js.

## Local development

1. Install dependencies:
   `npm install`
2. Start dev server:
   `npm run dev`
3. Build production files:
   `npm run build`
4. Preview production build locally:
   `npm run preview`

## Deploy to GitHub Pages (`main` branch, `docs/` folder)

1. Build:
   `npm run build`
2. Replace docs with latest build output:
   `rm -rf docs && cp -R dist docs && touch docs/.nojekyll`
3. Commit and push:
   `git add docs`
   `git commit -m "Deploy latest build to docs"`
   `git push origin main`

## Update site content

Edit portfolio content in:
- `src/data.js`
