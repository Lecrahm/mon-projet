# mon-projet

Two apps live in this repository:

| App | Folder | What it is |
| --- | --- | --- |
| **Hub candidatures** | [`candidatures-tracker/`](./candidatures-tracker) | Personal glass hub for Marcel ESMEL (grille, lettres, CV) |
| N-CARD | repo root (`src/`, `index.html`) | Existing NFC card app — do not treat this as the Vercel preview |

## Open the candidatures tracker

**Local**

```bash
cd candidatures-tracker
npm install
npm run dev
```

Then open **http://localhost:5173** (Vite preview path: the tracker is served at `/`).

**Vercel preview**

The preview URL of this project must serve the tracker at `/`, not the root N-CARD landing.

1. In the Vercel project: **Settings → Build and Deployment → Root Directory** = `candidatures-tracker`
2. Open the PR’s Vercel preview URL — the dashboard is the site root (`https://<deployment>.vercel.app/`)

If Root Directory is still the repository root, `vercel.json` at the repo root still builds `candidatures-tracker` (`install` / `build` / `outputDirectory` all point there). Prefer setting Root Directory to `candidatures-tracker` so Vercel uses [`candidatures-tracker/vercel.json`](./candidatures-tracker/vercel.json) and that folder’s `package.json`.

Full run notes: [`candidatures-tracker/README.md`](./candidatures-tracker/README.md).

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
