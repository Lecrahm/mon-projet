# Face & Ombre

Web app française de **communication asymétrique**.

> Dis la vérité en Ombre. Envoie la Face qui passe.

- **Ombre** : intention brute, privée, jamais envoyée automatiquement
- **Face** : message adapté à un destinataire + canal + registre (Direct / Diplomate / Corporate FR)
- **Luther** : traducteur de colère comique, pour l’acquisition — pas le cœur du produit

## Lancer

```bash
npm install && npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

| Route | Rôle |
|---|---|
| `/` | Landing marketing |
| `/app` | Studio Ombre → Face |
| `/app/destinataires` | Jusqu’à 10 profils |
| `/app/historique` | Timeline Ombre ↔ Face |
| `/app/luther` | Mode Luther + carte PNG |
| `/r/:id` | Page share Luther (navigateur qui a généré) |

## Variables d’environnement

Copier `.env.example` vers `.env.local` si besoin.

| Variable | Effet |
|---|---|
| `OPENAI_API_KEY` | Appelle OpenAI (`gpt-4o-mini` par défaut, surcharge via `OPENAI_MODEL`) |
| `ANTHROPIC_API_KEY` | Utilisé **seulement** si OpenAI n’est pas défini (`claude-3-5-haiku-latest` / `ANTHROPIC_MODEL`) |

**Sans clé :** un reformulateur français déterministe tourne en local. L’app reste démoable offline. Les prompts système/user du brief MVP sont ceux envoyés au LLM quand une clé est présente.

Le texte Ombre/Face n’est jamais loggé. Il n’est transmis à un fournisseur que le temps d’une génération LLM.

## Ce qui marche en v0 (web)

- Landing FR, dualité visuelle Ombre / Face, tease Luther
- Destinataires (nom, rôle, pouvoir, canal, notes) persistés en `localStorage`
- Génération Face A + Face B, copier, marquer envoyé, issue (ouvert / gagné / clash)
- Historique par destinataire
- Luther : rant + copie + carte PNG canvas + page `/r/:id`
- Paywall Free/Pro **simulé** (20 Faces/mois, 3 destinataires, 3 Luther/jour) — « Continuer en démo » ne bloque pas
- Filtre de sécurité avant génération (détresse réelle, violence, doxxing, haine)

## Hors v0 (volontaire)

Pas de clavier iOS, pas de Stripe live, pas d’auth Apple/Google, pas de chiffrement serveur, pas de base Postgres. Voir le brief MVP pour la suite.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4. Données v0 : `localStorage` uniquement.
