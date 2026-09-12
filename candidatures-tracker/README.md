# Candidatures Tracker — Marcel ESMEL

Tableau de bord glassmorphism (Vite + React + TypeScript) pour suivre une shortlist d’offres d’accueil / hospitality à Paris.

Les données vivent **uniquement dans le navigateur** (`localStorage`) et peuvent être exportées / réimportées en JSON.

## Lancer en local

```bash
cd candidatures-tracker
npm install
npm run dev
```

Puis ouvrir l’URL affichée par Vite (généralement `http://localhost:5173`).

## Build de production

```bash
cd candidatures-tracker
npm install
npm run build
npm run preview
```

## Fonctionnalités

- Compteurs par statut (à traiter, adapté, candidaté, relancé, entretien, offre, refusé, archivé)
- Kanban en cartes verre dépoli (glisser-déposer d’une colonne à l’autre)
- Ajout / édition / suppression via une modale
- Recherche + filtres (statut, contrat, score min.)
- Persistance `localStorage`
- Import / export JSON
- Shortlist réelle préchargée (12 offres, statut **À traiter**)

## Modèle JSON

Chaque offre :

```json
{
  "id": "seed-01",
  "title": "Hospitality Officer H/F",
  "company": "PATCHWORK",
  "location": "Paris QCA",
  "contract": "CDI",
  "salary": "24 715 – 28 546 EUR",
  "url": "https://…",
  "status": "à_traiter",
  "fit_score": 9.5,
  "notes": "",
  "date_found": "2026-09-12",
  "date_applied": "",
  "next_followup": "",
  "tags": ["hospitality", "paris"]
}
```

Statuts possibles : `à_traiter` | `adapté` | `candidaté` | `relancé` | `entretien` | `offre` | `refusé` | `archivé`.

Arrière-plan photographique : cliché Unsplash d’un bureau sombre (clavier / écran), assombri et grainé pour l’effet verre dépoli.
