# BookList Pro

Application React Native du réseau des Comptoirs du Livre. Elle permettra aux
libraires de consulter et gérer le catalogue, les statuts de lecture, les
favoris et les notes de lecture.

Le projet vise une livraison solide du **lot 3** du cahier des charges, avec une
exécution prioritaire dans le navigateur.

## Équipe

- Anas : domaine, API, état serveur et tests de données
- Amina : navigation, catalogue, thème et internationalisation
- Mariya : fiche détaillée, formulaires, notes et couvertures

## Technologies

- Expo SDK 57 et React Native
- Expo Router
- TypeScript strict
- TanStack Query
- React Hook Form et Zod
- Jest et Testing Library

## Prérequis

- Node.js 22
- npm

## Installation

L'API est incluse dans le dépôt et l'application utilise automatiquement
`http://localhost:3000`. Aucun fichier d'environnement n'est nécessaire pour
une exécution locale.

```bash
git clone https://github.com/loziamina/BookList_Pro.git
cd BookList_Pro
npm install
npm run setup
```

Puis démarrez simultanément l'API et l'application web :

```bash
npm run dev
```

L'API répond sur <http://localhost:3000/health> et Expo affiche l'adresse de
l'application dans le terminal. Pour utiliser une autre API, copiez
`.env.example` vers `.env.local` et modifiez `EXPO_PUBLIC_API_URL`.

## Vérifications

```bash
npm run lint
npx tsc --noEmit
npm test
```

## Architecture

Le projet suit les couches imposées par le cahier des charges :

```text
src/
├── app/          écrans et routes Expo Router
├── components/   composants d'interface purs
├── domain/       modèles, validations et règles métier
├── features/     orchestration par fonctionnalité
├── hooks/        logique React et TanStack Query
├── providers/    providers globaux
├── services/     réseau, stockage et plateformes
└── theme/        tokens de design
```

Les écrans et composants n'effectuent aucun appel réseau direct. Les réponses
de l'API sont validées à l'exécution avec Zod.

La description complète est disponible dans
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## État du projet

Le socle technique commun est disponible :

- modèles et validations des livres et notes ;
- pagination, filtres et clés de cache ;
- client HTTP centralisé avec timeout et erreurs typées ;
- provider TanStack Query ;
- thèmes clair et sombre ;
- configuration ESLint et Jest ;
- premiers tests du domaine.

Les fonctionnalités des lots 1 à 3 sont développées progressivement sur des
branches dédiées et intégrées par Pull Request.

## Documentation disponible

- `docs/ARCHITECTURE.md` : architecture et parcours des données
- `docs/ADR/001-gestion-etat-serveur.md`
- `docs/ADR/003-resolution-conflits.md`
- `docs/PERFORMANCE.md`
- `IA.md`
