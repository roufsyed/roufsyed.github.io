# React + Three.js Portfolio (GitHub Pages Ready)

Responsive portfolio website built with:
- React + Vite
- Three.js via `@react-three/fiber` + `@react-three/drei`

## Scripts
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run deploy` (publishes `dist/` to `gh-pages` branch)

## Edit Portfolio Content
Update all career/projects/articles data in:
- `src/data.js`

For new article links (LinkedIn/Reddit/etc), add objects in `articles`:

```js
{
  title: 'My architecture post',
  platform: 'LinkedIn',
  url: 'https://www.linkedin.com/posts/...'
}
```

## GitHub Pages Setup
1. Push this repo to GitHub.
2. Run `npm run deploy`.
3. In GitHub repo settings -> Pages:
   - Source: `Deploy from a branch`
   - Branch: `gh-pages`, folder `/ (root)`

Note: `vite.config.js` uses `base: './'` so assets resolve correctly on GitHub Pages project URLs.
