# Refonte de l'onglet Rédiger

L'onglet Rédiger fait appel à de nombreuses données provenant du serveur, les temps de chargements peuvent être longs en cas de présence de nombreux produits de recherche.
Deux types de données sont récupérées du serveurs, les données d'affichage en rapport avec la structuration du modèle choisit lors de la création de plan (sections & questions) et les données saisies par l'utilisateur (réponses aux questions, commentaires ...).

Lors de la première ouverture de l'onglet Rédiger, on récupère les informations à propos des sections (titres en rouge) et des questions (qui sont affichées sous forme de Collapse Bootstrap). La liste des produits de recherche déclarés est également récupérée afin d'afficher les onglets, mais cette partie sera réimplémentée dans un deuxième temps. On va donc considérer qu'il n'existe qu'un produit de recherche déclaré dans le DMP, ses informations auront cependant besoin d'être envoyées au serveur afin de récupérer la bonne réponse associée à une question.

Code actuel : `https://github.com/OPIDoR/DMPOPIDoR/blob/feature/ui_redesign/app/views/branded/phases/_edit_plan_answers.html.erb`

## Premier Chargement

Au premier chargement, l'ensemble des questions sont fermées.

### Requête dans le back

`Template.find(853).sections.as_json(:include => {:questions => {only: ['id', 'text', 'number', 'default_value', 'madmp_schema_id', 'question_format_id']}})`

### Données en entrée du composant ReactJS

Tableau JSON contenant les données des sections, les informations d'affichage des questions sont également inclus.

Pour section : seuls id, title et number devraient être utiles

```json
{
  "sections": [
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
        "id": 4569
      }
    ]
  }
}
```

### Description des données

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

## Ouverture d'une question

Lors de l'ouverture d'une question, un appel au back est effectué afin d'afficher le contenu du formulaire.

- Dans le cas où on utilise un modèle structuré (présence de `madmp_schema_id` dans les informations de la question), les informations du template et éventuellement des données stockées en base sont récupérées depuis le serveur. Les composants créés lors du Sprint 1-2 sont utilisés pour le rendu du formulaire.
- (A FAIRE PLUS TARD) Dans le cas où on utilise un modèle classique (absence de `madmp_schema_id` dans les informations de la question), on se base sur le `question_format_id` pour savoir quel type de champ à afficher (champ texte, zone de texte, nombre).

### Première ouverture

C'est la première fois que la question est ouverte, ces informations permettent d'initialiser les données en JSON coté serveur.

Appel à la route `GET /madmp_fragments/load_new_form?madmp_fragment[answer][plan_id]=:plan_id&madmp_fragment[answer][question_id]=:question_id&madmp_fragment[answer][research_output_id]=:research_output_id&madmp_fragment[schema_id]=:madmp_schema_id&madmp_fragment[dmp_id]=:dmp_id`

- `plan_id` : l'identifiant du plan
- `question_id` : l'identifiant de la question qui vient d'être ouverte
- `research_output_id` : l'identifiant du produit de recherche actuellement édité
- `madmp_schema_id` : l'identifiant du template à charger coté serveur
- `dmp_id` : identifiant du fragment JSON racine

### Ouvertures suivantes

Toutes les fois suivantes, les données sont déjà initialisées. Seul l'identifiant de la donnée est envoyée au serveur (fragment_id)

Appel à la route `GET /madmp_fragments/load_form/:fragment_id`

- `plan_id` : l'identifiant du fragment JSON sauvegardé dans la base

### Données réponses du serveur

```json
{
    "fragment_id": 75646,
    "fragment": {
        ...
    },
    "schema": {

    }
}

```

- `fragment_id` : idenfifiant du fragment dans la base
- `fragment` : données du formulaire saisie par l'utilisateur, ou initialisées par le serveur
- `schema` : description du formulaire (template). ex: DataStorageStandard
