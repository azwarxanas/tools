# Tools Dashboard

Free online utility tools — 100% client-side, no data uploaded.

## Tools

### Text
- **Find & Replace** — regex, case-sensitive, replace all
- **Remove AI Characters** — strip hidden Unicode chars (LRM, RLM, ZWJ, etc.)
- **Case Converter** — 11 case transforms (lower, UPPER, Title, camelCase, etc.)
- **Word Counter** — words, chars, sentences, paragraphs, reading time

### Image
- **Resize Image** — preset sizes, custom dimensions, batch, aspect ratio lock
- **Compress Image** — quality slider, format JPEG/PNG/WebP/AVIF, batch

### Convert
- **Unit Converter** — length, weight, temperature, volume, area
- **Percentage Calculator** — X% of Y, percentage change, ratio

### Utility
- **Password Generator** — strength meter, char sets, Fisher-Yates shuffle
- **QR Generator** — gradient themes, dot/line styles, center logo, rounded corners
- **Date Calculator** — date difference, add/subtract days
- **List Randomizer** — shuffle, pick randomly, remove picked from list
- **Timer / Stopwatch** — lap times, countdown with alarm

### Data
- **JSON Formatter** — format, validate, minify
- **Hash Generator** — SHA-1/256/384/512

## Tech Stack

- **Framework**: Next.js 16 (App Router, Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Hosting**: Cloudflare Pages

## Local Development

```bash
npm install
npm run dev       # dev server with hot reload
npm run build     # static export ke folder out/
npm start         # serve production build via localhost:3000
```

## Deployment

Push to GitHub — Cloudflare Pages auto-deploys on every commit to `main`.

Build command: `npm run build` • Output dir: `out`
