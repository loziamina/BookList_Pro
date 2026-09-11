# Performance

## Objectifs

Le catalogue doit rester réactif pendant la recherche, le filtrage, la
pagination et les mutations optimistes. Les optimisations sont appliquées là où
elles répondent à un coût identifié, sans complexifier inutilement l'application.

## Optimisations présentes

- La recherche attend 300 ms avant d'interroger l'API, ce qui évite une requête
  à chaque frappe.
- Les requêtes devenues obsolètes reçoivent l'`AbortSignal` de TanStack Query.
- Le catalogue charge 20 ouvrages par page au lieu de rendre tout le fonds.
- `FlatList` virtualise les cartes affichées.
- `BookCard` est mémoïsé pour limiter les rendus inutiles.
- TanStack Query conserve les données fraîches pendant 30 secondes.
- Les favoris et statuts de lecture sont mis à jour immédiatement, avec retour
  à l'état précédent si le serveur refuse la mutation.
- Les images envoyées depuis le navigateur sont redimensionnées à 800 px au
  maximum et converties en JPEG avec une qualité de 85 %.

## Protocole reproductible

1. Lancer l'API et l'application web en mode production ou avec les outils de
   profilage désactivés.
2. Charger un jeu de données représentatif.
3. Ouvrir le Profiler React et enregistrer :
   - le premier affichage du catalogue ;
   - une recherche de plusieurs caractères ;
   - un changement de filtre ;
   - un changement de page ;
   - l'ajout puis le retrait d'un favori.
4. Relever la durée des commits, le nombre de rendus de `BookCard` et le nombre
   de requêtes réseau.
5. Répéter chaque scénario trois fois et conserver la médiane.

## Critères de contrôle

- Une saisie continue déclenche au maximum une recherche après 300 ms
  d'inactivité.
- Une ancienne recherche annulée ne remplace pas les résultats plus récents.
- Une action favori ou lu donne un retour visuel immédiat.
- Un changement sur une carte ne provoque pas le rendu de toutes les cartes
  inchangées.
- Une couverture sélectionnée ne dépasse pas 800 px sur son plus grand côté
  avant l'envoi.

Les chiffres issus du Profiler doivent être ajoutés après une mesure sur la
machine de soutenance. Aucun résultat chiffré n'est inventé dans ce document.
