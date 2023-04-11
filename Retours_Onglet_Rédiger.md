# Retours Onglet Rédiger

## Pagination des Produits de Recherche

Les utilisateurs aiment avoir accès à tous les onglets des produits de recherche. On n'a pas une bonne vision des produits créés avec le système de pagination actuel.
Pour le moment, il vaut mieux les regrouper comme dans les captures d'écran de la carte kanboard : https://kb.inist.fr/project/265/task/8694

## DmpServiceApi

Les spécifications manquaient de précision.

Il manque une méthode qui fait appel à `GET /madmp_fragments/load_form/:fragment_id` qui est appelée lorsque les données du formulaire ont déjà été initialisées ou remplies.
Dans ce cas les données `plan` présentes sont les suivantes (c'est succeptible de changer avec l'intégration):

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
                }
            },
            (...)
        ]
    }
}
```

### Description des données

- plan : données liés au plan
  - id: identifiant du plan actuel
  - dmp_id: identifiant du fragment JSON racine
  - research_outputs: liste des produits de recherche du plan
    - id: identifiant du produit de recherche
    - answers: listes des réponses apportées à chaque question. La clé est l'identifiant de la question : `"<question_id>" : { "answer_id": 4236, "fragment_id": 556387 }`
      - answer_id : l'identifiant de la réponse apportée (n'est pas utile avec les formulaire actuels)
      - fragment_id: l'identifiant du fragment de donnée dans la base.

### Comportement

Lors de l'ouverture d'une question, pour un produit de recherche donné, on regarde dans `answers` si il existe une clé correspondant à l'identifiant de la question (`question_id`) :

- Si il n'existe pas, les données n'ont jamais été initialisées. On fait appel à la route `/madmp_fragments/load_form/...` comme précisé dans les spécifications
- Si il existe, on récupère `fragment_id` dans les données en JSON (ex: `{ "answer_id": 4236, "fragment_id": 556387 }`). On fait appel à la route `GET /madmp_fragments/load_form/:fragment_id` pour obtenir les informations du formulaire. Le formulaire est ensuite généré normalement.

## Noms des fonctions et variables

### DmpServiceApi

- `getSchemaByPlanId` : renommer en `loadNewForm` pour que ça soit plus proche du nom de la route

### DmpComentApi

- Renommer le fichier `DmpCommentApi`
- `postNote` : renommer `postComment`
- `updateNote`: renommer `updateComment`

### Affichage des onglets Produits de Recherche

- `currentItems`, `setcurrentItems` : renommer `researchOutputs`, `setResearchOutputs`
- `researchId`, `setResearchId` : renommer `displayedResearchOutputId` et `setDisplayedResearchOutputId`
- `handleClick` : renommer `handleShowResearchOutputClick`

### Icones Runs, Recommandations & Commentaire

- `handleGearClick`, `handleLightClick`, `handleBellClick` : renommer pour que l'action accomplie soit plus claire (ex: `handleShowCommentClick`)
- `ModalRuns` : renommer `RunsModal`
- `ModalComment` : renommer `CommentModal`
- `ModalRecommandation` : renommer `GuidanceModal` (tout le code côté back utilise le terme "guidance" pour parler des recommandations)
- `CustomSpinner` : renommer `CustomSpinner`

## Questions et remarques

- J'ai vu que tu avais stocké des variables CSS dans le state (ex: `fillColorGear`). Est-ce qu'il ne serait pas mieux de d'ajouter une classe sur l'icône et de laisser le CSS gérer en fonction de la présence ou non de cette classe ? Ex:

```css
.comment-guidance-runs-icons {
  color: blue;
}
.comment-guidance-runs-icons.open {
  color: orange;
}
```
