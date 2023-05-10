# Import d'information dans un Produit de Recherche

L'utilisateur peut choisir d'importer, dans son produit de recherche, des données provenant d'un autre plan. 
Deux possibilités s'offrent à lui :

- Import à partir de l'UUID d'un produit de recherche (identifiant unique)
- Choix parmi les plans accessibles par l'utilisateur, choix du plan puis du produit.

## Interface

Modification de la Modal de création d'un produit de recherche

### Ajout d'onglets Créer/Importer

Le formulaire de paramétrage sera dans l'onglet Créer, le nouveau formulaire d'import sera dans l'onglet Importer.

### Ajout du formulaire d'import d'un produit de recherche.

Ce formulaire permet deux choix :

**Champ de saisie direct pour un UUID (champ texte)**
libellé *en_GB*: "Please fill a research output UUID"
libellé *fr_FR*: "Veuillez saisir l'UUID d'un produit de recherche"

**Champ de sélection avec recherche, affichant la liste des plans accessibles par l'utilisateur.**
libellé *en_GB*: "Please choose one of the plan you have access to : "
libellé *fr_FR*: "Veuillez saisir l'UUID d'un produit de recherche"

A la sélection du plan, un nouveau champ de sélection s'affiche avec la liste des produits de recherche.
libellé *en_GB*: "Please choose one of the research outputs"
libellé *fr_FR*: "Veuillez saisir l'un des produits de recherche"

Dans le cas où il n'existe qu'un produit de recherche dans le plan, on affiche selon la langue:
Research output/Produit de recherche : *titre du produit de recherche*

Entre les deux choix, ajouter un séparateur avec marque "OU/OR" selon la langue.

Quelque soit le choix, l'UUID du produit de recherche est envoyé au serveur. Il faut prévoir un gestion des erreurs venant du serveur (plan non accessible, problème d'import).

## Données & Appels serveur

### 1/ Ouverture de la Modal

#### Communication back

A l'ouverture de la Modal, appel de la route `GET /plans`.

#### Données réponses du serveur

Retourne la liste des plans accessibles. Ces données permettent de créer le champ de sélection des plans accessibles.

```json
[
    {
        "id": 18024,
        "title": "DMP du projet \"Silicium, soufre et carbone issu de biomasse pour des batteries durables\""
    },
    {
        "id": 18290,
        "title": "DMP du projet \"Histoire et archéologie des monastères et des sites ecclésiaux d’Istrie et de Dalmatie (IVe-XIIe s.)\""
    },
    {
        "id": 14894,
        "title": "DMP du projet \"Complexes de lanthanides luminescents avec réponse optique dynamique ajustable\""
    }
]
```

- id: identifiant du plan, utilisé comme `value` du champ de sélection. Envoyé au serveur
- title : titre du plan

### 2/ Choix d'un des plans

#### Communication back

Lors du choix d'un des plans, appel de la route `GET /plans/:id/research_outputs` :

- id : identifiant du plan sélectionné

#### Données réponses du serveur

```json
[
    {
        "uuid": "65856096-32be-4dc0-ad47-841848709c93",
        "title": "Default"
    },
    {
        "uuid": "ed0cff2c-1f2e-4f0c-ac7b-09d16d472a2c",
        "title": "Research Output 2"
    },
    {
        "uuid": "dfb77c60-0040-4259-81d6-223f146a9f21",
        "title": "Research Output 3"
    }
]
```

- uuid: identifiant unique du produit de recherche, utilisé comme `value` du champ de sélection. Envoyé au serveur pour l'import du produit de recherche
- title : titre du produit de recherche

### 3/ Validation du produit de recherche à importer

#### Communication back

Pour les deux cas suivants :

- Saisie directe de l'UUID dans un champs texte
- Choix du plan, choix du produit de recherche à importer

Appel de la route `POST /research_outputs/import` avec en body 

```json
    {
        "plan_id": 18024,
        "uuid": "dfb77c60-0040-4259-81d6-223f146a9f21"
    }
```

- plan_id: identifiant du plan en cours d'édition
- uuid : idenfitiant unique du produit de recherche à importer dans le plan en cours d'édition

#### Données réponses du serveur

Le serveur renvoit la liste complète des produits de recherche, dans un format identique à celui renvoyé lors de la création d'un nouveau produit de recherche:

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


