# ADR 001 — Gestion de l'état serveur

## Statut

Accepté — 10/09/2026

## Contexte

BookList Pro consomme un fonds de 500 ouvrages exposé par une API paginée.
L'application doit distinguer les données du serveur de l'état local de
l'interface, conserver un cache, annuler les recherches obsolètes et maintenir
les écrans cohérents après une mutation.

Le mode dégradé ajoute de la latence et des erreurs 503. Une solution centralisée
doit gérer les réessais sans déclencher de boucle sur les erreurs de validation.

## Options envisagées

1. État React local : simple au départ, mais le cache et les invalidations
   seraient dupliqués entre les écrans.
2. Zustand pour toutes les données : adapté à l'état client, mais demanderait de
   réimplémenter le cycle de vie des requêtes et la déduplication.
3. TanStack Query : fournit cache, annulation, invalidation, mutations et états
   de chargement tout en restant indépendant des composants visuels.

## Décision

Nous utilisons TanStack Query pour l'état provenant du serveur.

Les clés sont créées dans `src/lib/query-keys.ts` et suivent une hiérarchie :

```text
["books"]
["books", "list", filters]
["books", "detail", id]
["books", "detail", id, "notes"]
```

Les services de `src/services/api/` restent responsables des appels HTTP et de
la validation Zod. Les hooks de `src/hooks/queries/` relient ces services au
cache. Les écrans ne connaissent ni l'URL de l'API ni `fetch`.

Après une création ou une modification, le détail est écrit dans le cache et
les listes sont invalidées. Après une suppression, le détail est retiré et les
listes sont invalidées.

Les requêtes peuvent être retentées au maximum deux fois uniquement pour une
erreur réseau marquée comme réessayable. Les mutations ne sont jamais rejouées
automatiquement afin d'éviter une double écriture.

## Conséquences

### Positives

- Une source unique décrit l'état de chaque requête.
- La pagination reste côté serveur.
- Les écrans partagent le même cache.
- Les recherches obsolètes peuvent être annulées avec `AbortSignal`.
- Les invalidations sont prévisibles et testables.

### Négatives

- Toute nouvelle ressource doit définir ses clés et ses règles d'invalidation.
- Une invalidation trop large peut provoquer des requêtes inutiles.
- Les mises à jour optimistes exigent une sauvegarde et un rollback explicites.

## Vérification

Les services sont testés avec le client HTTP simulé. Le hook `useBooks` est
testé dans un `QueryClientProvider` isolé afin de vérifier les filtres normalisés
et la récupération d'une page serveur.
