# GlowFix

GlowFix is a client-side React (Vite) application delivering instant portrait smoothing directly in the browser. Upload a portrait, adjust smoothness, and download results privately—no files ever leave your device.

## Getting Started

```bash
npm install
npm run dev
```

- `npm run dev` — starts the Vite dev server on port 4000.
- `npm run build` — builds the production bundle.
- `npm run preview` — previews the production build.
- `npm run lint` — runs ESLint across the client.
- `npm run test` — executes Vitest with full coverage reporting.

## Testing

GlowFix follows a test-driven approach. All Vitest suites enforce 100% coverage across statements, branches, functions, and lines.

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) installs dependencies, enforces the Vite version, verifies the absence of `.module.scss`, lints, runs tests with coverage gates at 100%, and builds the Vite client.

## Project Structure

```
/client          # React Vite client
  └─ src         # Application source
/scripts         # Repository health scripts
```

## Key Features

- Canvas-based smoothing (stack blur) with adjustable intensity (0–10).
- EXIF-aware image loading via `createImageBitmap` fallback to `Image`.
- Reset and download controls with high-quality JPEG export.
- Accessibility-focused UI with keyboard-friendly interactions and focus states.
- React Query-powered content sourcing from the project brief JSON.

## Brand

- **Name:** GlowFix
- **Tagline:** Instant portrait perfection.
- **Mission:** Empower creators with clean, private, in-browser retouching tools — fast, beautiful, and accessible.
