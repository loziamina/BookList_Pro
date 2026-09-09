# Architecture de BookList Pro

## Objectif

BookList Pro utilise une architecture en couches. Les écrans composent
l'interface, les fonctionnalités orchestrent les cas d'usage, et la couche
`services/` est la seule à connaître les API externes.

## Couches

- `src/app/` : routes Expo Router et composition des écrans. Aucun appel réseau.
- `src/components/` : interface pure pilotée par des propriétés. Aucune
  dépendance directe à l'API ou au store.
- `src/features/` : logique de présentation organisée par domaine.
- `src/hooks/` : logique React réutilisable et hooks TanStack Query.
- `src/services/` : réseau, stockage et adaptations de plateforme.
- `src/domain/` : schémas Zod, types et règles métier sans dépendance à React.
- `src/providers/` : fournisseurs globaux de l'application.
- `src/theme/` : couleurs, espacements et autres tokens de design.

## Parcours d'une modification

1. Un écran de `src/app/` reçoit une action de l'utilisateur.
2. Un composant de `src/components/` appelle une fonction reçue en propriété.
3. La fonctionnalité déclenche un hook de `src/hooks/queries/`.
4. Le hook appelle un service de `src/services/api/`.
5. Le client HTTP valide la réponse avec un schéma de `src/domain/`.
6. TanStack Query met à jour ou invalide son cache.
7. L'écran est rendu à nouveau avec les données validées.

## Contrat du catalogue

Amina consommera les interfaces suivantes :

```text
useBooks(filters)
useToggleFavorite()
useToggleReadStatus()
```

`useBooks` reçoit des filtres compatibles avec `BookFilters`. La recherche,
les filtres, le tri et la pagination sont toujours envoyés au serveur.

## Contrat de la fiche

Mariya consommera les interfaces suivantes :

```text
useBook(id)
useCreateBook()
useUpdateBook()
useDeleteBook()
useNotes(bookId)
useCreateNote(bookId)
useDeleteNote(bookId)
```

Les erreurs `validation` exposent un dictionnaire `fields` afin que le
formulaire associe une erreur HTTP 422 au champ concerné.

## Clés de cache

Toutes les clés TanStack Query sont créées par `src/lib/query-keys.ts`.
Les écrans et composants ne construisent jamais leurs propres clés.

## Gestion des erreurs

La couche réseau convertit les erreurs en union discriminée `AppError` :

- `network` pour une indisponibilité ou un délai dépassé ;
- `validation` pour une réponse 422 ;
- `conflict` pour une réponse 409 ;
- `auth` pour une réponse 401 ou 403 ;
- `not-found` pour une réponse 404 ;
- `unknown` pour les autres situations.

Chaque action en échec doit produire un retour visible. Les erreurs réseau
réessayables peuvent être rejouées, contrairement aux erreurs de validation.

## Responsabilités

- Anas : domaine, services, hooks de données, providers et dépendances.
- Amina : navigation, catalogue, composants UI, thème et traduction.
- Mariya : fiche, formulaires, notes et couvertures.

`package.json`, `package-lock.json` et les providers globaux sont modifiés par
une seule personne à la fois. `src/app/_layout.tsx` reste sous la responsabilité
d'Amina.
