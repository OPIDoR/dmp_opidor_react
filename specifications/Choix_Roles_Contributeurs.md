# Choix du rôle des contributeurs

Il n'est actuellement pas possible de choisir le rôle des contributeurs. Le rôle est obtenu à partir d'une valeur constante située dans le template d'un Contributeur.
Le but de cette fonctionnalité est de permettre à l'utilisateur de choisir le rôle du contributeur qui est déclaré.

## Composants à renommer

- SelectContributor -> SelectContributorMultiple
- SelectInvestigator -> SelectContributorSingle

## Interface

### Contributeurs Multiples

On garde le choix de la Personne avec la possibilité de créer une nouvelle personne.
Ajout de la liste des rôles disponibles, venant du référentiel `Role`
Ajout d'un bouton "Add/Ajouter" permettant de valider la création d'un nouveau contributeur.

### Contributeurs Uniques (ex PrincipalInvestigator)

?

## Templates

Tous les templates contenant une propriété `contributor` appellent désormais un template générique `ContributorStandard`:

```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "../Documentation/Implementation/data_model/Json/",
    "title": "ContributorStandard",
    "description": "ContributorStandard template",
    "type": "object",
    "class": "ContributorStandard",
    "properties": {
        "person": {
            "type": "object",
            "class": "Person",
            "properties": {
                "dbid": {
                    "type": "number"
                }
            },
            "template_name": "PersonStandard",
            "required": [
                "dbid"
            ],
            "description": "Personnes impliquées dans la production et collecte des données",
            "inputType": "pickOrCreate",
            "form_label@fr_FR": "Sélectionner une valeur dans la liste ou créer une nouvelle valeur en cliquant sur +",
            "form_label@en_GB": "Select a value from the drop-down list or create a new value by clicking on +"
        },
        "role": {
            "type": "string",
            "description": "Rôle d'une personne dans la gestion et collecte des données",
            "inputType": "dropdown",
             "registry_name": "Role",
            "label@fr_FR": "Rôle",
            "label@en_GB": "Role",
            "form_label@fr_FR": "Rôle",
            "form_label@en_GB": "Role"
        }
    },
    "required": [
        "person",
        "role"
    ],
    "to_string": [
        "$.person.firstName",
        " ",
        "$.person.lastName ",
        " (",
        "$.role",
        ")"
    ]
}

```

La propriété `role` du template ContributorStandard a été modifiée, elle fait désormais appel au référentiel Role.

## Données

### Référentiels Role

```json
[
    {
        "en_GB": "Project coordinator",
        "fr_FR": "Coordinateur du projet"
    },
    {
        "en_GB": "DMP manager",
        "fr_FR": "Responsable du plan de gestion de données"
    },
    {
        "en_GB": "Data contact",
        "fr_FR": "Personne contact pour les données"
    },
    {
        "en_GB": "Data producers or collectors",
        "fr_FR": "Responsables de la production ou de la collecte des données"
    },
    {
        "en_GB": "Data documentation managers",
        "fr_FR": "Responsables de la documentation des données"
    },
    {
        "en_GB": "Persons in charge of data protection",
        "fr_FR": "Responsables de la protection des données"
    },
    {
        "en_GB": "Legal Experts",
        "fr_FR": "Responsables juridiques"
    },
    {
        "en_GB": "Persons in charge of ethical issues ",
        "fr_FR": "Responsables des questions éthiques"
    },
    {
        "en_GB": "Research staff processing and analysing data",
        "fr_FR": "Responsables du traitement et de l'analyse des données"
    },
    {
        "en_GB": "Persons in charge of data storage",
        "fr_FR": "Responsables du stockage des données"
    },
    {
        "en_GB": "Persons in charge of data deposition and diffusion",
        "fr_FR": "Responsables du dépôt et de la diffusion des données"
    },
    {
        "en_GB": "Persons in charge of long term data preservation",
        "fr_FR": "Responsables de la conservation des données à long terme"
    },
    {
        "en_GB": "Person in charge of sampling management",
        "fr_FR": "Responsable de la gestion des échantillons"
    },
    {
        "en_GB": "Data quality managers",
        "fr_FR": "Responsables de la qualité des données"
    },
    {
        "en_GB": "Data model and/or database designer ",
        "fr_FR": "Concepteur de modèles de données et/ou de bases de données"
    },
    {
        "en_GB": "Data manager",
        "fr_FR": "Gestionnaire de données"
    },
    {
        "en_GB": "Research staff running instruments",
        "fr_FR": "Responsable de la gestion des instruments"
    }
]
```