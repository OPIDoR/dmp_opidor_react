# Création & Suppression de Produits de Recherche dans l'onglet Rédiger

L'ajout et la suppression d'un produit de recherche doit désormais se faire dans l'onglet Rédiger.

## Création

### Interface

Ajout d'un bouton "Créer" (bouton "+") au niveau de la liste des produits de recherche.
Lorsque l'on clique sur ce bouton, un formulaire de création s'affiche dans la zone de Rédaction. Il sera utilisé pour le paramétrage du produit de recherche.
Pour le moment ce formulaire propose des informations de base à propos du produit de recherche:

- abbreviation: Nom du produit de recherche, limité à 20 caractères
- title: Titre du produit de recherche
- type: type du produit de recherche, liste déroulante proposée à partir du référentiel ResearchDataType contenant les valeurs suivantes :

```json
[
    {
        "en_GB": "Dataset",
        "fr_FR": "Jeu de données"
    },
    {
        "en_GB": "Software",
        "fr_FR": "Logiciel"
    },
    {
        "en_GB": "Model",
        "fr_FR": "Modèle"
    },
    {
        "en_GB": "Physical object",
        "fr_FR": "Objet physique"
    },
    {
        "en_GB": "Workflow",
        "fr_FR": "Workflow"
    },
    {
        "en_GB": "Audiovisual",
        "fr_FR": "Audiovisuel"
    },
    {
        "en_GB": "Collection",
        "fr_FR": "Collection"
    },
    {
        "en_GB": "Image",
        "fr_FR": "Image"
    },
    {
        "en_GB": "Interactive resource",
        "fr_FR": "Resource interactive"
    },
    {
        "en_GB": "Service",
        "fr_FR": "Service"
    },
    {
        "en_GB": "Sound",
        "fr_FR": "Son"
    },
    {
        "en_GB": "Text",
        "fr_FR": "Texte"
    }
]
```

### Communication back

Appel de la route `POST /research_outputs`
Données envoyées:

```json
{
    "plan_id": 1234,
    "abbreviation": "MYRO",
    "title": "My Research Output",
    "type": "Dataset"
}

```

- plan_id: identifiant du plan en cours d'édition
- abbreviation: nom du produit de recherche
- title: titre du produit de recherche
- type: type du produit de recherche, choisi dans la liste déroulante.

### Données réponses du serveur

Une liste complète des produits de recherche du plan contenant la liste des réponses par question (voir Document Retours_Onglet_Rédiger.md).

```json
[
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
        }
    },
    (...)
]

```

## Suppression

### Interface

Dans la zone de rédaction (questions & sections), ajout d'un bouton Supprimer en haut à droite. La suppression doit être validée avec d'être effective. Message de suppression :

- en_GB : Deleting this research output will remove the associated answers. Do you confirm ?
- fr_FR : En supprimant ce produit de recherche, les réponses associées seront également supprimées. Confirmez-vous la suppression ?

### Communication back

Appel de la route `DELETE   /plans/:plan_id/research_outputs/:id`

- plan_id: identifiant du plan en cours d'édition
- id: identifiant du produit de recherche en cours de suppression

### Données réponses du serveur

Comme lors de l'ajout, le serveur renvoit la liste des produits de recherche existants après la suppression.
