# Toymeet portfolio

Single-page brutalist-editorial portfolio ("Hard Cut" — Anton + Archivo, paper/ink/acid-lime).
Rendered in-browser as React via Babel standalone; component files are plain `.jsx` loaded
by `index.html`. There is no build step. Design tokens live in `tokens/*.css`.

Serve over HTTP (Babel fetches the `.jsx`/`data.js` files via XHR — `file://` will not work):
`python3 -m http.server 8000` then open http://localhost:8000

## External APIs

- **YouTube IFrame Player API** — https://developers.google.com/youtube/iframe_api_reference
  Used in `Work.jsx` to control the reel carousel: only the centered/foreground Short plays
  (muted autoplay via `YT.Player`); all others are paused. Tapping the centered card unmutes it.
  Loaded from `https://www.youtube.com/iframe_api`.
