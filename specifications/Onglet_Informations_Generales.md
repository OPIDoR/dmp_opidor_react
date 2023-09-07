# Onglet Informations Générales

L'onglet Informations Générales est composé de deux formulaires : Projet et Meta.
Le fonctionnement est particulier, ils ne sont reliés à aucune question. Les données de ces formulaires sont initialisées à la création du plan, il n'est donc pas nécessaire de gérer la "première ouverture" du formulaire comme dans l'onglet Rédiger.

On y trouve deux fonctionnalités spécifiques à cet onglet :

- Une case à cocher permettant de changer le plan en "plan de test"
- L'import de données financeurs.

## Inferface

Voir "5_1 OPIDoR - Page informations générales.pdf" pour les maquettes.

### Case Plan Test

Ajouter une case à cocher "plan test" au dessus du collapse des informations projet :

- libellé *fr_FR* :projet de test, d'entrainement ou à des fins de formation
- libellé *en_GB* : mock project for testing, practice, or educational purposes

### Import de données Financeurs

Voir Page 2 des maquettes

Deux listes déroulantes :

- Selection de l'organisme de financement. Pour le moment il n'en existe qu'un "Agence Nationale de la Recherche (ANR)"
- Selection du projet financé. Sélection avec recherche (exemple de contenu : voir le fichier ANRProject.json), le libellé affiché dépend de la langue de formulaire.

## Données en entrée du composant

- planId : l'identifiant du plan
- dmpId : l'identifiant du fragment racine des données json
- isTestPlan : si `true`, le plan est un plan de test.
- projectFragmentId : identifiant des données du formulaire Projet (Renseignements sur le Projet)
- metaFragmentId : identifiant des données du formulaire Meta (Renseignements sur le Plan)

### Appels serveurs

### Ouverture/Sauvegarde des formulaires

Identitique à celle de l'onglet Rédiger

### Case Plan Test

Appel à la route `POST /plans/:plan_id/set_test`
Avec en body `{is_test: true/false}`

- plan_id: identifiant du plan

### Import de données Financeurs

A la validation appel à la route `GET /codebase/anr_search?project_id=:grantId&fragment_id=:projectFragmentId&script_id=4`

- grantId: idenfitiant du financement, valeur sélectionnée dans la liste des projets financés.
- projectFragmentId:  identifiant des données du formulaire Projet

Lorsque tout se passe bien, les données des formulaires Projet et Meta sony rechargées depuis le serveur.

