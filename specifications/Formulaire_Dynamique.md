# Formulaire Dynamique

https://github.com/OPIDoR/DMPOPIDoR/blob/dmpopidor-dev/engines/madmp_opidor/app/views/dynamic_form/_form.html.erb

## Champs simples

ex : https://github.com/OPIDoR/DMPOPIDoR/blob/dmpopidor-dev/engines/madmp_opidor/app/views/dynamic_form/fields/_text_field.html.erb

- textfield : type=string
- textarea : type=string + inputType=textarea
- datefield : type=string + format=date
- urlfield : type=string + format=uri
- emailfield : type=string + format=email
- numberfield : type=integer ou type=number
- booleanfield : type=boolean
- hiddenfield : hidden est présent
- constfield : const@fr_FR/en_GB est présent

## Tableau de Champs simples

Champs simples avec bouton Add/Delete : type=array + items.type=(tout sauf object)

## Sous Fragments

- Sous fragment unique (sous formulaire) : type=object + schema_id présent
- Sous fragment unique, à sélectionner ou créer (ex: Person) : type=object + schema_id présent + inputType=pickOrCreate
- Liste de sous fragments : type=array + items.type=object + items.schema_id présent
- Liste de contributeurs : type=array + items.type=object + items.schema_id + classname du sous schéma égal "contributor"

## Référentiels

- Référentiel simple à choix unique, sauvegarde d'une chaine de caractère (ex: langue du plan) : type=string + registry_id présent + inputType=dropdown
- Référentiel simple à choix multiple, sauvegarde d'un tableau de chaine de caractère : type=array + registry_id présent + inputType=dropdown
- Référentiel complexe à choix unique, avec sauvegarde d'un sous fragment (ex : Funder) : type=object + schema_id et registry_id présent + inputType=dropdown
- Référentiel complexe à choix multiple, avec sauvegarde d'un sous fragment (ex : Partner) : type=array + items.schema_id et registry_id présent + inputType=dropdown

## Note sur template_name & registry_name

Lors que les schemas sont chargés dans la base, grâce à l'interface d'administration, l'application fait une conversion des champs `template_name` et `registry_name` en les remplaçant par les identifiants présents dans la base :

- `template_name` est remplacé par `schema_id`
- `registry_name` est remplacé par `registry_id`
