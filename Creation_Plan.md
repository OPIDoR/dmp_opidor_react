# Création de Plan

Plusieurs choix sont possible lors de la création d'un nouveau plan :

- Choix du modèle par défaut
- Choix d'un modèle proposé par son organisme
- Choix d'un modèle proposé par un autre organisme
- Choix d'un modèle proposé par un organisme identifié comme financeur

Le choix du "contexte" qui est fait avant permet de filtrer les organismes et les modèles proposés, sauf pour le modèle par défaut qui est proposé quelque soit son contexte. Le contexte peut prendre deux valeurs :

- `context=research_project`
- `context=research_structure`

## Choix disponibles

### Modèle par défaut

Toujours proposé en création, les informations nécessaires à sa création sont connues lors de l'affichage du formulaire

### Modèle proposé par l'organisme

Le nom et identifiant de l'organisme sont connus à l'affichage du formulaire.
Dès son ouverture, un appel au serveur est fait pour récupérer les informations sur les modèles disponibles. Si aucun modèle n'est disponible affichage du message "Aucun modèle de disponible."

### Modèle proposé par un autre organisme

Une liste déroulante contenant la liste des organismes est affichée, on peut rechercher un organisme dans cette liste.
Quand on choisit un organisme, un appel est fait au serveur pour récupérer les informations sur les modèles disponibles. Si aucun modèle n'est disponible affichage du message "Aucun modèle de disponible."

### Modèle proposé par un organisme identifié comme financeur

Une liste déroulante contenant la liste des financeurs est affichée, on peut rechercher un financeur dans cette liste.
Quand on choisit un financeur, un appel est fait au serveur pour récupérer les informations sur les modèles disponibles.

## Appels serveurs et données

### Modèle par défaut

Pas d'appel serveur à part lors de la création du plan.

#### Données en entrée

Informations sur le modèle par défaut.
Ex :

- `id` : 276
- `title` : Science Europe : modèle structuré.

### Modèle proposé par l'organisme

#### Données en entrée

Information sur son organisme
Ex :

- `id` : 4
- `name` : CNRS.

#### Données à envoyer

Lors de l'affichage, appel à la route `GET /template_options?plan[research_org_id]=none&plan[funder_id]=none&plan[context]=:context`

- `context` : le contexte choisit précédemment

#### Données réponses du serveur

```json
{
  "templates": [
    {
      "id": 614,
      "title": "ANR - Modèle de PGD (français) (Personnalisé par CNRS)",
      "default": false
    },
    {
      "id": 555,
      "title": "ERC DMP (Personnalisé par CNRS)",
      "default": false
    },
    {
      "id": 600,
      "title": "Final - MASA - Modèle de PGD (français)",
      "default": false
    },
    {
      "id": 399,
      "title": "Horizon 2020 DMP (Personnalisé par CNRS)",
      "default": false
    },
    {
      "id": 401,
      "title": "Horizon 2020 FAIR DMP (anglais) (Personnalisé par CNRS)",
      "default": false
    }
  ]
}
```

### Modèle proposé par un autre organisme

#### Données en entrée

Liste des organismes disponibles
Ex :

```json
[
  {
    "id": 23,
    "name": "AMUE - Agence de Mutualisation des Universités et Etablissements",
    "sort_name": "AMUE - Agence de Mutualisation des Universités et Etablissements"
  },
  {
    "id": 24,
    "name": "ASSISTANCE PUBLIQUE - Hôpitaux de Marseille",
    "sort_name": "ASSISTANCE PUBLIQUE - Hôpitaux de Marseille"
  },
  {
    "id": 20,
    "name": "AgroParisTech - Institut des sciences et industries du vivant et de l'environnement",
    "sort_name": "AgroParisTech - Institut des sciences et industries du vivant et de l'environnement"
  },
  {
    "id": 28,
    "name": "CAMPUS CONDORCET",
    "sort_name": "CAMPUS CONDORCET"
  },
  {
    "id": 274,
    "name": "CC-IN2P3 (Centre de Calcul - Institut national de physique nucléaire et de physique des particules du CNRS)",
    "sort_name": "CC-IN2P3"
  },
  {
    "id": 29,
    "name": "CEA Commissariat à l'énergie atomique et aux énergies alternatives",
    "sort_name": "CEA Commissariat à l'énergie atomique et aux énergies alternatives"
  },
  {
    "id": 33,
    "name": "CINES",
    "sort_name": "CINES"
  },
  {
    "id": 10,
    "name": "CIRAD",
    "sort_name": "CIRAD"
  },
  {
    "id": 4,
    "name": "CNRS",
    "sort_name": "CNRS"
  }
]
```

#### Données à envoyer

Lors de l'affichage, appel à la route `GET /template_options?plan[research_org_id][id]=:org_id&plan[research_org_id][name]=:org_name&plan[research_org_id][sort_name]=:org_name&plan[funder_id]=none&plan[context]=:context`

- `org_id` : l'identifiant de l'organisme choisi
- `org_name` : le nom de l'organisme choisi (à mettre dans name et sort_name)
- `context` : le contexte choisit précédemment

#### Données réponses du serveur

```json
{
  "templates": [
    {
      "id": 760,
      "title": "Horizon 2020 FAIR DMP (français) (Personnalisé par INRAE - Institut national de recherche pour l'agriculture l'alimentation et l'environnement)",
      "default": false
    },
    {
      "id": 501,
      "title": "INRA - Trame Structure (5 modes de gestion)",
      "default": false
    },
    {
      "id": 518,
      "title": "INRA - Trame générique v2",
      "default": false
    },
    {
      "id": 828,
      "title": "INRAE Trame projet v3",
      "default": false
    },
    {
      "id": 829,
      "title": "Test",
      "default": false
    }
  ]
}
```

### Modèle proposé par un financeur

#### Données en entrée

Liste des financeurs disponibles
Ex :

```json
[
  {
    "id": 271,
    "name": "Agence nationale de la recherche (ANR)",
    "sort_name": "Agence nationale de la recherche"
  },
  {
    "id": 6,
    "name": "Commission européenne",
    "sort_name": "Commission européenne"
  },
  {
    "id": 236,
    "name": "Conseil européen de la recherche (European Research Council, ERC)",
    "sort_name": "Conseil européen de la recherche"
  },
  {
    "id": 280,
    "name": "INCa - Institut national du cancer",
    "sort_name": "INCa - Institut national du cancer"
  }
]
```

#### Données à envoyer

Lors de l'affichage, appel à la route `GET /template_options?plan[research_org_id]=none&plan[funder_id][id]=:funder_id&plan[funder_id][name]=:funder_name&plan[funder_id][sort_name]=:funder_name&plan[context]=:context`

- `funder_id` : l'identifiant du financeur choisi
- `funder_name` : le nom du financeur choisi (à mettre dans name et sort_name)
- `context` : le contexte choisit précédemment

#### Données réponses du serveur

```json
{
  "templates": [
    {
      "id": 294,
      "title": "Horizon 2020 DMP",
      "default": false
    },
    {
      "id": 289,
      "title": "Horizon 2020 FAIR DMP (anglais)",
      "default": false
    },
    {
      "id": 295,
      "title": "Horizon 2020 FAIR DMP (français)",
      "default": false
    },
    {
      "id": 820,
      "title": "Horizon Europe DMP (anglais)",
      "default": false
    }
  ]
}
```

### Validation du choix du modèle

Appel à la route `POST /plans`

#### Données à envoyer

- `template_id` : l'identifiant du modèle choisi
