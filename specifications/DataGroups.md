# Datagroups

Les datagroups, ou groupe de données, correspondent à un regroupement visuel des champs d'un formulaire dans une même zone. On peut regrouper ces propriétés de manière thématique (données personnelles, affiliation... voir exemple)

## Nouvelles propriétés et structuration des templates

Ajouts :

- Nouveau type de propriété permettant de définir un datagroup. Ces propriétés du formulaire sont définies avec `$ref`, si `$ref` contient `datagroups` on affiche un groupe de données (ou datagroup). Elles possèdent un `label` à afficher en titre du groupe.

ex :

```json
"personalData" : { 
    "type": "object",
    "label@fr_FR": "Données Personnelles",
    "label@en_GB": "Personal Data",
    "$ref" : "/datagroups/personalData"
}
```

- Nouvelle propriété ajoutée au niveau des champs du formulaire `dataGroup` qui indique à quel groupe appartient le champ.

## Affichage

Modification de l'algorithme d'affichage du formulaire, lors du parcours des propriétés :

- si une propriété possède un champ `dataGroup`, on ne fait rien, elle n'est pas affichée
- si une propriété ne possède pas un champ `dataGroup`, elle est affichée comme actuellement.
- si une propriété possède un champ `$ref` et que ce champ contient `datagroups` : on récupère la valeur après le slash (ex: "/datagroups/personalData" => personalData).

  - On filtre et on récupère les propriétés du formulaire qui appartiennent à ce groupe (ex : toutes les propriétés où `dataGroup` est égal à "personalData")
  - On crée une zone entourée de bordures et affichant le titre contenu dans la propriété `label` (ex: fieldset & legend).
  - Les propriétés récupérées sont affichées dans cette zone.
- La sauvegarde et la structuration des données n'est pas changée.

Quelques règles :

- Si un datagroup ne contient que deux champs, ils sont affichés l'un à coté de l'autre (ex: identifiant & type d'identifiant)
- Si il n'existe que deux datagroups, ils sont affichés l'un à coté de l'autre

## Exemple : PersonStandard

```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "../Documentation/Implementation/data_model/Json/",
    "title": "PersonStandard",
    "description": "PersonStandard template",
    "type": "object",
    "class": "PersonStandard",
    "properties": {
        "personalData" : {
          "type": "object",
          "label@fr_FR": "Données Personnelles",
          "label@en_GB": "Personal Data",
          "$ref" : "/datagroups/personalData"
        },
        "affiliation" : {
          "type": "object",
          "label@fr_FR": "Affiliation",
          "label@en_GB": "Affiliation",
          "$ref" : "/datagroups/affiliation"
        },
        "nameType": {
            "type": "string",
            "description": "Type du nom",
            "inputType": "dropdown",
            "label@fr_FR": "Type (organisation ou personne)",
            "label@en_GB": "Type (organisation or person)",
            "registry_name": "NameTypeValues",
            "form_label@fr_FR": "Type (organisation ou personne)",
            "form_label@en_GB": "Type (organisation or person)",
            "dataGroup": "personalData"
        },
        "lastName": {
            "type": "string",
            "description": "Nom de famille",
            "label@fr_FR": "Nom",
            "label@en_GB": "Last name",
            "example@fr_FR": "Dupont, Service d'Ingénierie des Systèmes d’Information, Comité d'éthique",
            "example@en_GB": "Dupont, Information Systems Engineering Department, Ethics comittee",
            "form_label@fr_FR": "Nom",
            "form_label@en_GB": "Last name",
            "dataGroup": "personalData"
        },
        "firstName": {
            "type": "string",
            "description": "Prénom",
            "label@fr_FR": "Prénom",
            "label@en_GB": "First name",
            "tooltip@fr_FR": "Saisir un prénom, s'il s'agit d'une personne physique",
            "tooltip@en_GB": "Enter a first name, if it is a natural person",
            "form_label@fr_FR": "Prénom",
            "form_label@en_GB": "First name",
            "dataGroup": "personalData"
        },
        "mbox": {
            "type": "string",
            "format": "email",
            "description": "Adresse mail de la personne",
            "label@fr_FR": "Email",
            "label@en_GB": "Email",
            "form_label@fr_FR": "Email",
            "form_label@en_GB": "Email",
            "dataGroup": "personalData"
        },
        "personId": {
            "type": "string",
            "description": "Valeur de l'identifiant",
            "label@fr_FR": "Identifiant",
            "label@en_GB": "Identifier",
            "example@fr_FR": "https://orcid.org/0000-0002-9148-9926",
            "example@en_GB": "https://orcid.org/0000-0002-9148-9926",
            "form_label@fr_FR": "Identifiant",
            "form_label@en_GB": "Identifier",
            "dataGroup": "personalData"
        },
        "idType": {
            "type": "string",
            "description": "Type d'identifiant (ORCID id)",
            "inputType": "dropdown",
            "label@fr_FR": "Type d'identifiant",
            "label@en_GB": "Identifier type",
            "registry_name": "AgentIdSystem",
            "overridable": true,
            "form_label@fr_FR": "Type d'identifiant",
            "form_label@en_GB": "Identifier type",
            "dataGroup": "personalData"
        },
        "affiliationName": {
            "type": "string",
            "description": "Nom de l'affiliation",
            "label@fr_FR": "Nom de l'affiliation",
            "label@en_GB": "Affiliation name",
            "tooltip@fr_FR": "Utiliser de préférence le nom de la structure enregistrée dans le RNSR. Dans le cas d'une organisation, indiquer le nom de l'établissement de rattachement",
            "tooltip@en_GB": "Preferably use the name of the structure registered in RNSR. In case of an organizational name, you can add here the name of the formal institution to which the creator belongs",
            "example@fr_FR": "INIST Institut de l'information scientifique et technique",
            "example@en_GB": "INIST Institut de l'information scientifique et technique ",
            "form_label@fr_FR": "Nom de l'affiliation",
            "form_label@en_GB": "Affiliation name",
            "dataGroup": "affiliation"
        },
        "affiliationId": {
            "type": "string",
            "description": "Identifiant de l'affiliation",
            "label@fr_FR": "Identifiant de l'affiliation",
            "label@en_GB": "Affiliation identifier",
            "example@fr_FR": "198822446E",
            "example@en_GB": "198822446E",
            "form_label@fr_FR": "Identifiant de l'affiliation",
            "form_label@en_GB": "Affiliation identifier",
            "dataGroup": "affiliation"
        },
        "affiliationIdType": {
            "type": "string",
            "description": "Type d'identifiant",
            "inputType": "dropdown",
            "label@fr_FR": "Type d'identifiant de l'affiliation",
            "label@en_GB": "Affiliation identifier type",
            "registry_name": "AgentIdSystem",
            "overridable": true,
            "form_label@fr_FR": "Type d'identifiant de l'affiliation",
            "form_label@en_GB": "Affiliation identifier type",
            "dataGroup": "affiliation"
        }
    },
    "required": [
        "nameType",
        "lastName",
        "firstName",
        "personId",
        "idType",
        "affiliationName",
        "affiliationId",
        "affiliationIdType"
    ],
    "to_string": [
        "$.lastName",
        " ",
        "$.firstName"
    ],
    "unicity": [
        "firstName",
        "lastName"
    ]
}

```