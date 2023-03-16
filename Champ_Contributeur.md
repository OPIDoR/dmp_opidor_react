# Champ Contributeur

A cause de contraintes techniques, il existe plusieurs schémas décrivant un contributeur (ex: DataCollector, DataDocumentationManager).

Dans tous les cas, un contributeur est décrit par un champ `person` (appel du schéma PersonStandard) possédant un `inputType` égal à `pickorCreate` et `role` (valeur constante). L'affichage est cependant particulier.

## Conditions d'affichage

type=array + items.type=object
Si le sous-schéma possède un `classname` égal à "contributor" (ou `"class": "Contributor"`).

## Comportement

On affiche une liste déroulante contenant les Personnes décritent dans l'ensemble du plan. Cette liste est récupérée depuis le serveur à chaque ouverture de la liste. Comme on peut décrire des contributeurs et ajouter des personnes à divers endroits, on souhaite que la liste soit à jour.

On peut ajouter une Personne avec le bouton "+" qui ouvre un formulaire Person dans une modal.

Lors de la sélection, un nouveau contributeur (person + role) est créé et ajouté à une liste de contributeur présente sous le select.
Pour éviter un enregistrement en double de la Person lors de la sauvegarde, on a ajouté un champ `unicity` dans PersonStandard qui décrit les champs permettant de déterminer si la donnée a déjà été créée. C'est géré lors de l'enregistrement en base.
