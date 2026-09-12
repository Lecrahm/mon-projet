# Hub — Marcel ESMEL

Hub personnel local (Vite + React + TypeScript) pour la shortlist hospitality / accueil. Pas un admin Kanban : une grille de dossiers, chacun avec **offre, lettre, CV adapté et notes**.

Les données restent **dans le navigateur** (`localStorage`). Vercel est optionnel.

## Lancer en local

```bash
cd candidatures-tracker
npm install
npm run dev
```

Ouvrir **http://localhost:5173**.

```bash
npm run build
```

## Ce que contient chaque dossier

Onglets du tiroir : **Offre | Lettre | CV | Notes**, avec boutons **Copier** sur la lettre et le CV.

Les 12 offres de la shortlist sont préchargées. Les deux postes **Cercle de l’Union Interalliée** (`seed-02`, `seed-03` Ensemble sportif) sont **bloqués** (permis B requis — Marcel n’a pas le permis).

Les lettres et CV sont des versions adaptées par maison. Les fichiers sources n’étaient pas dans le repo : les blocs `TODO` (e-mail, téléphone, expériences) sont à compléter.

Vue principale : **grille** (ou liste). Le Kanban reste une vue secondaire.
