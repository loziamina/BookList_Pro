# ADR 003 — Stratégie de résolution des conflits

## Statut

Accepté — 11/09/2026

## Contexte

Le Lot 4 introduit le mode hors ligne : les libraires peuvent créer, modifier
et supprimer des ouvrages sans réseau (en réserve, en salon du livre), et les
mutations sont rejouées au retour de la connexion via `POST /sync`.

Cette situation produit inévitablement des conflits : deux libraires peuvent
modifier la même fiche le même jour, l'un hors ligne depuis la réserve,
l'autre en ligne depuis la caisse. L'API détecte ce cas via le mécanisme de
version (`updatedAt` / `version`, en-tête `If-Match`) : une écriture dont la
version est périmée reçoit une réponse `409 Conflict` contenant la fiche
serveur à jour.

Contraintes :
- La règle numéro un du cahier des charges est qu'**aucune saisie de libraire
  ne doit jamais être perdue silencieusement**.
- Le libraire doit comprendre ce qui s'est passé et pouvoir agir en
  connaissance de cause, pas seulement subir un écrasement.
- La stratégie doit rester compréhensible pour quelqu'un qui n'est pas
  développeur (le libraire lui-même, en soutenance).

## Options envisagées

1. **Le serveur gagne** — la modification locale est écartée dès qu'un
   conflit est détecté ; le libraire est prévenu et peut retrouver sa saisie
   pour la ressaisir manuellement s'il le souhaite. Simple à implémenter,
   mais la saisie locale, même conservée quelque part, demande un effort
   manuel de récupération — risque d'abandon par le libraire.

2. **Le client gagne** — réécriture forcée de la fiche serveur avec la
   version locale, après rechargement de la version serveur pour obtenir une
   version à jour. Simple aussi, mais écrase sans discussion le travail d'un
   collègue, ce qui va à l'encontre de l'esprit collaboratif du cahier de
   lecture.

3. **Fusion assistée** — au moment du conflit, un écran de comparaison
   champ par champ s'affiche : pour chaque champ divergent (titre, statut
   lu, note...), le libraire voit la valeur locale et la valeur serveur
   côte à côte, et choisit laquelle garder, champ par champ. Coût
   d'implémentation plus élevé (interface dédiée), mais c'est la seule
   option qui respecte pleinement la règle "aucune saisie perdue" tout en
   laissant le contrôle au libraire plutôt qu'à une règle automatique
   arbitraire.

## Décision

Nous retenons l'option 3, la fusion assistée, limitée aux champs textuels et
numériques du formulaire (titre, auteur, éditeur, année, note). Pour les
champs booléens simples (lu, favori), où une comparaison champ par champ
apporte peu de valeur, nous appliquons un repli automatique sur l'option 1
(le serveur gagne) : la valeur la plus récente côté serveur est conservée,
sans écran de choix, pour ne pas alourdir l'expérience sur des champs à
faible enjeu.

Concrètement :
- Une mutation qui revient en conflit (`409`) déclenche l'affichage d'un
  écran de comparaison plutôt qu'une résolution automatique silencieuse.
- Ce comparatif montre, pour chaque champ divergent, la valeur locale (celle
  que le libraire vient de saisir) et la valeur serveur (celle du
  collègue), avec un choix explicite par champ.
- Tant que le conflit n'est pas résolu par le libraire, la mutation locale
  reste dans la file d'attente : elle n'est ni perdue, ni réappliquée de
  force.
- Une fois les choix faits, un `PUT` avec la version serveur à jour
  (`If-Match`) envoie la fiche fusionnée.

## Conséquences

**Positives :**
- Aucune saisie n'est jamais perdue silencieusement, conformément à la règle
  numéro un du cahier des charges.
- Le libraire garde le contrôle et comprend ce qui s'est passé, plutôt que
  de découvrir après coup qu'une modification a disparu.
- La stratégie est démontrable et explicable simplement en soutenance.

**Négatives :**
- Complexité d'implémentation supérieure aux deux autres options : il faut
  un écran de comparaison dédié, un état de "conflit en attente" distinct
  des autres états de synchronisation, et des tests couvrant le cas où
  plusieurs champs divergent en même temps.
- Expérience potentiellement plus lente pour le libraire en cas de conflit
  fréquent (nécessite une action manuelle à chaque fois, contrairement à une
  résolution automatique).

**À revoir si :**
- Les conflits s'avèrent en pratique très rares (réseau des boutiques plus
  fiable que prévu) : l'effort d'implémentation de l'écran de fusion pourrait
  ne pas être proportionné au bénéfice réel, et une stratégie plus simple
  (option 1) pourrait suffire.
- Le nombre de champs concernés augmente significativement (ex. avec l'ajout
  de collections thématiques), ce qui compliquerait l'écran de comparaison
  et demanderait de le repenser (par exemple, une fusion automatique par
  défaut avec possibilité d'ajustement, plutôt qu'un choix systématique
  champ par champ).