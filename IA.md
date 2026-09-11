# Utilisation de l'intelligence artificielle

## Périmètre

L'équipe a utilisé l'assistance IA dans Cursor pour relire le projet, repérer
des écarts entre la documentation et l'implémentation, proposer des corrections
et accélérer certaines tâches répétitives.

Exemples de demandes formulées :

- auditer l'état des fonctionnalités des lots 1 à 3 ;
- vérifier l'intégration du thème sombre et de l'internationalisation ;
- compléter les tests des mutations optimistes ;
- améliorer la documentation technique avant la soutenance.

## Méthode de validation

Les réponses de l'IA ne sont pas considérées comme correctes par défaut. Chaque
modification retenue est relue dans le contexte du projet, puis contrôlée avec :

```bash
npm run lint
npx tsc --noEmit
npm test
```

Les parcours importants (catalogue, recherche, CRUD, notes, favoris,
couvertures, changement de thème et changement de langue) doivent également
être vérifiés manuellement dans le navigateur.

## Responsabilité et limites

L'IA peut produire du code incomplet, des hypothèses erronées ou une
documentation qui ne correspond pas au cahier des charges. L'équipe reste
responsable des choix d'architecture, de la validation fonctionnelle, des tests
et du contenu présenté. Aucun secret, jeton d'accès ou donnée personnelle ne
doit être transmis dans les prompts.
