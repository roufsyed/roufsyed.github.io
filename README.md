Live at **https://roufsyed.github.io/**.

## Structure

```
docs/                     ← the deployed site (GitHub Pages serves this folder)
  index.html              markup + <head> (meta, Open Graph, fonts)
  styles.css              all styling (design tokens, light/dark, responsive)
  app.js                  ES module: renders content from data + live features
  portfolio-data.js       ← EDIT THIS to update site content
  assets/                 rouf-portrait.webp, favicon.svg, og-image.png
  .nojekyll               tells GitHub Pages to serve files verbatim (incl. any dotfiles)
public/                   original source assets (kept for reference; not served)
```

## Update site content

Everything visible on the site is data-driven. Edit **`docs/portfolio-data.js`**:

- **Identity / hero** — `identity` (name, title, headline, personality, contact, `resumeUrl`)
- **Focus areas** — `focusAreas`
- **Career timeline** — `career`
- **Selected work** — `projects`
- **Open source** — `openSource` (GitHub ★ counts and screenshot galleries load live from the
  GitHub API at view time; the `stars`/`screenshots` values are the offline fallback)
- **Publications** — `articles`

The résumé links open `identity.resumeUrl` (currently a Google Drive link) — change that
one line to update it. A full `http(s)` URL opens in a new tab; a local path like
`assets/resume.pdf` would download instead. To replace the portrait, overwrite
`docs/assets/rouf-portrait.webp`.
