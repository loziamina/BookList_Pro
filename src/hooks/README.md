# Hooks

Ce dossier contient la logique React réutilisable. Les hooks TanStack Query
résident dans `queries/` et utilisent exclusivement les services de
`src/services/`.

Les composants purs ne doivent pas importer ces hooks directement ; les
fonctionnalités leur transmettent les données et les actions nécessaires.
