# Questions Conditionnelles (+ Bonus Informations Produit de Recherche)

Ajout du support des questions conditionnelles : à la création d'un produit de recherche l'utilisateur peut indiquer si son produit contiendra des données personnelles.
Si il indique qu'il n'en contient pas, la question portant sur les données personnelles ne sera pas affichée.

C'est une des premières options de paramétrage des produits de recherche.

## Création d'un produit de recherche

### Interface

Ajout d'un champ checkbox avec le libellé "Votre produit de rechercher contient-il des données personnelles ?"
Idéalement il se présente sous la forme d'un "toggle switch" Oui/Non.

Il existe des exemples en CSS pur ici : https://stackoverflow.com/questions/39846282/how-to-add-the-text-on-and-off-to-toggle-button

### Communication back

Ajout de la propriété `hasPersonalData` au données envoyées au back lors de la création d'un produit de recherche.

Données envoyées:

```json
{
  "plan_id": 1234,
  "abbreviation": "MYRO",
  "title": "My Research Output",
  "type": "Dataset",
  "hasPersonalData": true
}
```

## Onglet Rédiger

Les données envoyées du back prennent en compte l'ajout du paramétrage des produits de recherche :

- les données des questions et sections contiennent des métadonnées sur les templates liés aux questions.
- les données du plan, produits de recherche et réponses (answers) contiennent les informations de paramétrage du produit de recherche.

### Données Sections/Questions

Ajout de la propriété `classname` au niveau de la liste des questions. C'est une propriété indiquant la classe du template lié à la question.

Ex:

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
                    "madmp_schema_id": 49,
                    "classname": "research_output_description",
                },
                {
                    "id": 30662,
                    "text": "Est-ce que des données existantes seront réutilisées ?",
                    "default_value": null,
                    "number": 2,
                    "question_format_id": 9,
                    "madmp_schema_id": 17,
                    "classname": "data_reuse",
                },
                {
                    "id": 30663,
                    "text": "Comment seront produites/collectées les nouvelles données ?",
                    "default_value": null,
                    "number": 3,
                    "question_format_id": 9,
                    "madmp_schema_id": 7,
                    "classname": "data_collection",
                }
            ]
        },
        (...)
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
                    "madmp_schema_id": 42,
                    "classname": "personal_data_issues",
                },
                (...)
            ]
        },
    ]
}

```

### Données Plan/Produits de Recherche/Answers

Ajout de la propriété `metadata` au niveau de la liste des produits de recherches `research_outputs`. C'est un objet JSON contenant les données de paramétrage du produit de recherche (ou métadonnées) ajoutées lors de la création du produit de recherche.
Ex:

```json
{
    "plan": {
        "id": 1234,
        "dmp_id": 9876,
        "research_outputs": [
            {
                "id": 1234,
                "abbreviation": "Output 1",
                "answers": {
                    "12347" : {
                        "answer_id": 5687,
                        "fragment_id": 746321
                    },
                    "12347" : {
                        "answer_id": 8965,
                        "fragment_id": 445627
                    },
                    "12347" : {
                        "answer_id": 4236,
                        "fragment_id": 556387
                    },
                    "12347" : {
                        "answer_id": 5746,
                        "fragment_id": 9983
                    }
                },
                "metadata": {
                    "hasPersonalData": false,
                    "abbreviation": "MYRO"
                }
            },
            (...)
        ]
    }
}

```

- metadata : métadonnées (données de paramétrage) du produit de recherche
  - abbreviation: nom du produit de recherche
  - hasPersonalData : indicateur booléen permettant de déterminer si le produit de recherche contient des données personnelles

### Interface

Lors de l'affichage des sections et des questions, on reçoit à la fois les données des questions et les données du plan et des produits de recherche.

#### Affichage des questions

Quand on ouvre un produit de recherche (clique sur l'onglet du produit de recherche):

- Si `metadata.hasPersonalData = false` on cache la question pour laquelle `classname = "personal_data_issues"`.
- Si `metadata.hasPersonalData = true` on affiche la question pour laquelle `classname = "personal_data_issues"`.

#### Ajout d'un bouton Information "i" pour le produit de recherche

Au niveau du bandeau indiquant le produit de recherche affiché, ajouter une icone 'i' (information). En cliquant dessus, on affiche une zone contenant les informations suivantes :

- Nom du Produit de Recherche : `metadata.abbreviation`
- Contient des données personnelles : Oui/Non en fonction de la valeur de `metadata.hasPersonalData`.
