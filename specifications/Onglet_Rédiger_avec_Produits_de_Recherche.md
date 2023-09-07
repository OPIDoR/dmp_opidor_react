# Refonte de l'onglet Rédiger avec Produits de recherche

Lorsque deux produits de recherche ou plus sont présents, des onglets sont affichés pour chacun des produits de recherche. Ces onglets sont regroupés 5 par 5 si il existe plus de 5 produits de recherche. Le code permettant de regrouper ces onglets a été fait en HTML/Ruby, il est présent ici :
`https://github.com/OPIDoR/DMPOPIDoR/blob/feature/ui_redesign/app/views/branded/phases/_edit_plan_answers.html.erb`

Pour l'affichage à 5 produits ou plus, des captures d'écran sont disponibles sur la carte Kanban : https://kb.inist.fr/project/265/task/8694

Pour le moment ils sont regroupés dans l'ordre d'affichage, dans le futur on aura des critères de regroupement plus pertinent.

Pour chacun des produits de recherche, le comportement des questions et des sections est identique au fonctionnement avec un seul produit de recherche. 

## Données en entrée du composant ReactJS

Les données en entrée sont identiques, à la différence de la liste des produits de recherche

```json
{
    "sections":[
        {
            "id": 7456,
            "title": "Description des données et collecte ou réutilisation de données existantes",
            "description": null,
            "number": 1,
            "created_at": "2022-03-01T14:51:24.596Z",
            "updated_at": "2022-03-01T14:51:24.596Z",
            "phase_id": 1378,
            "modifiable": true,
            "versionable_id": "f6144df2-8494-403e-a6d8-bf84b22283d6",
            "questions": [
                {
                    "id": 30661,
                    "text": "<p>Description g&eacute;n&eacute;rale du produit de recherche</p>",
                    "default_value": "",
                    "number": 1,
                    "question_format_id": 9,
                    "madmp_schema_id": 49
                },
                {
                    "id": 30662,
                    "text": "Est-ce que des données existantes seront réutilisées ?",
                    "default_value": null,
                    "number": 2,
                    "question_format_id": 9,
                    "madmp_schema_id": 17
                },
                {
                    "id": 30663,
                    "text": "Comment seront produites/collectées les nouvelles données ?",
                    "default_value": null,
                    "number": 3,
                    "question_format_id": 9,
                    "madmp_schema_id": 7
                },
                {
                    "id": 30674,
                    "text": "<p>Backup!</p>",
                    "default_value": "",
                    "number": 4,
                    "question_format_id": 9,
                    "madmp_schema_id": 1
                }
            ]
        },
        {
            "id": 7457,
            "title": "Documentation et qualité des données",
            "description": null,
            "number": 2,
            "created_at": "2022-03-01T14:51:24.909Z",
            "updated_at": "2022-03-01T14:51:24.909Z",
            "phase_id": 1378,
            "modifiable": true,
            "versionable_id": "4bcf3904-76b7-464e-a214-37c140e345f4",
            "questions": [
                {
                    "id": 30664,
                    "text": "Quelles métadonnées et quelle documentation (par exemple mode d'organisation des données) accompagneront les données ?",
                    "default_value": null,
                    "number": 1,
                    "question_format_id": 9,
                    "madmp_schema_id": 26
                },
                {
                    "id": 30665,
                    "text": "Quelles seront les méthodes utilisées pour assurer la qualité scientifique des données ?",
                    "default_value": null,
                    "number": 2,
                    "question_format_id": 9,
                    "madmp_schema_id": 46
                }
            ]
        },
        {
            "id": 7458,
            "title": "Exigences légales et éthiques, code de conduite",
            "description": null,
            "number": 3,
            "created_at": "2022-03-01T14:51:25.171Z",
            "updated_at": "2022-03-01T14:51:25.171Z",
            "phase_id": 1378,
            "modifiable": true,
            "versionable_id": "e05b9cda-b876-4801-aff2-4128e26222af",
            "questions": [
                {
                    "id": 30666,
                    "text": "Quelles seront les mesures appliquées pour assurer la protection des données à caractère personnel ?",
                    "default_value": null,
                    "number": 1,
                    "question_format_id": 9,
                    "madmp_schema_id": 42
                },
                {
                    "id": 30667,
                    "text": "Quelles sont les contraintes juridiques (sensibilité des données autres qu'à caractère personnel, confidentialité, ...) à prendre en compte pour le partage et le stockage des données ?",
                    "default_value": null,
                    "number": 2,
                    "question_format_id": 9,
                    "madmp_schema_id": 35
                },
                {
                    "id": 30668,
                    "text": "Quels sont les aspects éthiques à prendre en compte lors de la collecte des données ?",
                    "default_value": null,
                    "number": 3,
                    "question_format_id": 9,
                    "madmp_schema_id": 28
                }
            ]
        },
        {
            "id": 7459,
            "title": "Traitement et analyse des données",
            "description": null,
            "number": 4,
            "created_at": "2022-03-01T14:51:25.405Z",
            "updated_at": "2022-03-01T14:51:25.405Z",
            "phase_id": 1378,
            "modifiable": true,
            "versionable_id": "e7690683-6825-472e-bd8b-64d23a8281ca",
            "questions": [
                {
                    "id": 30669,
                    "text": "Comment et avec quels moyens seront traitées les données ?",
                    "default_value": null,
                    "number": 1,
                    "question_format_id": 9,
                    "madmp_schema_id": 14
                }
            ]
        },
        {
            "id": 7460,
            "title": "Stockage et sauvegarde des données pendant le processus de recherche",
            "description": null,
            "number": 5,
            "created_at": "2022-03-01T14:51:25.487Z",
            "updated_at": "2022-03-01T14:51:25.487Z",
            "phase_id": 1378,
            "modifiable": true,
            "versionable_id": "ebf97cc1-af61-43b5-892d-8187f85792f6",
            "questions": [
                {
                    "id": 30670,
                    "text": "Comment les données seront-elles stockées et sauvegardées tout au long du projet ?",
                    "default_value": null,
                    "number": 1,
                    "question_format_id": 9,
                    "madmp_schema_id": 22
                }
            ]
        },
        {
            "id": 7461,
            "title": "Partage des données et conservation à long terme",
            "description": null,
            "number": 6,
            "created_at": "2022-03-01T14:51:25.594Z",
            "updated_at": "2022-03-01T14:51:25.594Z",
            "phase_id": 1378,
            "modifiable": true,
            "versionable_id": "4ae63808-5794-43cc-9fe7-2a44d8f1c8ea",
            "questions": [
                {
                    "id": 30671,
                    "text": "Comment les données seront-elles partagées ?",
                    "default_value": null,
                    "number": 1,
                    "question_format_id": 9,
                    "madmp_schema_id": 19
                },
                {
                    "id": 30672,
                    "text": "<p>Comment les donn&eacute;es seront-elles conserv&eacute;es &agrave; long terme ?</p>",
                    "default_value": "",
                    "number": 2,
                    "question_format_id": 9,
                    "madmp_schema_id": 14
                }
            ]
        }
    ],
    "plan": {
        "id": 1234,
        "dmp_id": 9876,
        "research_outputs": [
            {
                "id": 1234,
                "abbreviation": "Output 1"
            },
            {
                "id": 2345,
                "abbreviation": "Output 2"
            },
            {
                "id": 3456,
                "abbreviation": "Output 3"
            },
            {
                "id": 4567,
                "abbreviation": "Output 4"
            },
            {
                "id": 5678,
                "abbreviation": "Output 5"
            },
            {
                "id": 6789,
                "abbreviation": "Output 6"
            },
            {
                "id": 7891,
                "abbreviation": "Output 7"
            }
        ]
    }

}
```

## Description des données

- sections : liste des sections du modèle
  - id : identifiant en base de la section
  - title: titre de la section
  - number : ordre de la section à l'affichage
  - questions : liste des questions associées à la section
    - id : identifiant de la question en base
    - text : texte de la question
    - default_value : valeur par défaut. Souvent à null, sauf dans le cas des modèles de DMP non structurés.
    - number : ordre de la question dans la section
    - question_format_id : identifiant du format de la question. Il est toujours à 9 quand on affiche un formulaire dynamique (modèle structuré).
    - madmp_schema_id : identifiant du template à utiliser pour l'affichage du formulaire. Nécessaire lors de l'appel serveur qui permettra de récupérer le template associé à un formulaire. Il est nul si le modèle de DMP utilisé n'est pas structuré.
- plan : données liés au plan
  - id: identifiant du plan actuel
  - dmp_id: identifiant du fragment JSON racine
  - research_outputs: liste des produits de recherche du plan
    - id: identifiant du produit de recherche
    - abbreviation: abbreviation du nom du produit de recherche, cette donnée est affichée dans l'onglet

## Changement de produit affiché

Lorsque l'on clique sur l'onglet d'un produit de recherche pour la première fois, on affiche les questions fermées, comme lors du premier chargement de l'onglet Rédiger. On peut ouvrir une question pour afficher le formulaire. Si c'est la première fois qu'elle est ouverte, on fait appel à la route d'initialisation :

 `GET /madmp_fragments/load_new_form?madmp_fragment[answer][plan_id]=:plan_id&madmp_fragment[answer][question_id]=:question_id&madmp_fragment[answer][research_output_id]=:research_output_id&madmp_fragment[schema_id]=:madmp_schema_id&madmp_fragment[dmp_id]=:dmp_id`

Ce comportement est identique à l'onglet Rédiger sans produit de recherche. A la différence qu'il faut envoyer l'identifiant du produit de recherche actuellement affiché.

Lorsque l'on change d'onglet de produit de recherche, on garde en mémoire les questions (et formulaires) qui ont été chargés. L'utilisateur doit par exemple pouvoir naviguer entre plusieurs produits de recherche pour comparer le contenu de ses formulaires.
