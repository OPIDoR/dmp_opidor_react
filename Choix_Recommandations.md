# Choix des Recommandations

Le choix des groupes de recommandations (ou "guidance groups" en anglais) se faisait précédemment dans l'onglet Informations Générales. Il se fait désormais dans l'onglet Rédiger.

## Affichage & Comportement

Voir maquette "4_1 OPIDoR - Page principale rédaction avec onglets"

On affiche un collapse, fermé par défaut, avec une icône d'ampoule qui est identique à celui présent au niveau des questions.
Libellés :

- *fr_FR* : Sélectionnez les recommandations de votre plan
- *en_GB* : Select the guidance of your plan

L'ouverture du collapse de sélection des recommandations déclenche l'appel au serveur qui permet de récupérer la liste des demandes, si celles ci ne sont pas déjà présentes dans le Context.
A l'ouverture, on affiche les recommandations importantes, un bouton Voir plus permet d'afficher l'ensemble des recommandations disponibles dans l'application. Une case à cocher permet d'indiquer si des recommandations ont été sélectionnées. On peut en sélectionner 6 au maximum.
Pour chaque organisme ayant des recommandations, on affiche les groupes disponibles en dessous (voir capture tache Kanboard : https://kb.inist.fr/project/265/task/8695)

Lorsque l'on valide son choix, on met à jour la liste des recommandations liées au question,  en rechargeant les composants par exemple.
L'icône d'ampoule présente au niveau des questions doit indiquer que des recommandations liées à la question sont disponibles.

## Données

### Chargement des recommandations

A l'ouverture du collapse, appel à la route `GET /plans/:id/guidance_groups`

- id ou planId: identifiant du plan donc l'onglet Rédiger est actuellement ouvert

Renvoit un objet JSON contenant :

- la liste de tous les groupes de recommandations `all` => affichés lorsque l'on clique sur Voir tout
- la liste des groupes de recommandations importants `important` => affichés lors de l'ouverture du collapse
- la liste des groupes de recommandations selectionés `selected` => affichés lors de l'ouverture du collapse en plus des recommandations importantes

Chacun de ces tableaux peut être vide.

```json
{
    "all" : {
        "Digital Curation Centre": [
            {
            "id": 27,
            "name": "DCC",
            "org_id": 7
            }
        ],
        "INRAE - Institut national de recherche pour l'agriculture l'alimentation et l'environnement": [
            {
            "id": 28,
            "name": "INRA",
            "org_id": 5
            },
            {
            "id": 41,
            "name": "INRA GenoBois",
            "org_id": 5
            }
        ],
        "CIRAD": [
            {
            "id": 29,
            "name": "Guidance groupe CIRAD",
            "org_id": 17
            }
        ]
    },
    "important": {
        "INRAE - Institut national de recherche pour l'agriculture l'alimentation et l'environnement": [
            {
            "id": 28,
            "name": "INRA",
            "org_id": 5
            },
            {
            "id": 41,
            "name": "INRA GenoBois",
            "org_id": 5
            }
        ]
    }, 
    "selected": [
        28
    ]
}
```

Description des données:

- all/important : objet dont les clés sont les noms des organismes auquel sont liés les recommandations. Chacun de ces clés pointe sur un tableau des groupes de recommandations
  
  - id: identifiant du groupe de recommandations
  - name: nom du groupe de recommandations
  - org_id : identifiant de l'organimse lié au groupe de recommandations
- selected : tableau contenant les identifiants des groupes de recommandations sélectionnés.

### Enregistrement du choix des recommandations

Lorsque l'on appuie sur le bouton Valider du choix des recommandations
Appel à la route `POST /plans/:id/guidance_groups`

- id ou planId: identifiant du plan donc l'onglet Rédiger est actuellement ouvert

#### Données du body

```json
[27, 29, 31]
```

Un tableau contenant les idenfitiants des groupes de recommandations sélectionnés.

#### Données en réponse

```json
[30661, 30663]
```

Un tableau contenant la liste des identifiants des questions (questionId) possédant des recommandations. Cette liste permet d'ajouter ou de retirer l'icone indiquant la présence de recommandation au niveau de la question (icone Ampoule)

### Chargement de l'onglet Rédiger : nouvelles données

De nouvelles données sont à prendre en compte lors du chargement de l'onglet Rédiger

```json
{
    "plan": {
        "id": 1234,
        "dmp_id": 9876,
        "research_outputs": [(...)],
        "questions_with_guidance": [
            30671, 12347
        ]
    }
}
```

Description des nouvelles données :

- questions_with_guidance : tableau des identifiants des questions (questionId) possédant des recommandations. Cette liste permet d'afficher ou non l'icone indiquant la présence de recommandation au niveau de la question (icone Ampoule)