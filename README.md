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
- L'API fournie `api-books-v2`

## Installation

Clonez le dépôt et installez les dépendances du client :

```bash
git clone https://github.com/loziamina/BookList_Pro.git
cd BookList_Pro
npm install
```

Créez un fichier `.env.local` à partir de `.env.example` :

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

L'API est incluse dans le dépôt. Préparez-la après le clonage :

```bash
cd api-books-v2
npm install
npm run seed
npm start
```

L'API doit répondre sur <http://localhost:3000/health>.

Dans un second terminal, démarrez le client web :

```bash
cd BookList_Pro
npm run web
```

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
