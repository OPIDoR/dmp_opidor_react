# Refonte de la partie Commentaires de l'onglet Rédiger

Les commentaires s'ouvrent désormais une modal Bootstrap.
Le système est assez simple, on affiche les commentaires existants, on peut en ajouter et supprimer ses commentaires.

L'éditeur des commentaires n'a besoin que des options de formatage limitées : gras, italique et souligné.

## Données

### Requête dans le back

`Anwer.find(123).non_archived_notes.as_json(:include => { :user => {only: ['firsname', 'surname', 'email']} })`

### Données en entrée

Un tableau vide est passé si aucun commentaire n'existe. Si il existe un ou plusieurs commentaires, les données suivantes sont envoyées :

```json
[
  {
    "id": 418,
    "user_id": 1,
    "text": "<p>Mon commentaire <strong>avec du formatage</strong></p>",
    "archived": false,
    "answer_id": 11549,
    "archived_by": null,
    "created_at": "2023-03-17T12:56:27.448Z",
    "updated_at": "2023-03-17T12:56:27.448Z",
    "user": {
      "firstname": "DMP", 
      "surname": "Administrator",
      "email": "info-opidor@inist.fr"
    }
  },
  {
    "id": 419,
    "user_id": 1,
    "text": "<p>Mon commentaire</p>",
    "archived": false,
    "answer_id": 11549,
    "archived_by": null,
    "created_at": "2023-03-17T13:00:18.641Z",
    "updated_at": "2023-03-17T13:00:18.641Z",
    "user": {
      "firstname": "DMP", 
      "surname": "Administrator",
      "email": "info-opidor@inist.fr"
    }
  }
]

```

### Description des données

- id: identifiant du commentaire
- user_id: identifiant de l'auteur du commentaire (permet de déterminer si l'utilisateur est l'auteur du commentaire)
- text: le texte du commentaire, en HTML
- created_at/updated_at : dates de création et de dernière mise à jour du commentaire
- user: auteur du commentaire
  - firstname: prénom de l'auteur
  - surname: nom de famille de l'auteur
  - email: mail de l'auteur

## Appels serveur

### Création d'un commentaire

Appel à la route `POST /notes`

Exemple de body:

```json
{
    "note": {
        "answer_id": 134,
        "research_output_id": 345,
        "plan_id": 654,
        "user_id": 8,
        "question_id": 963,
        "text": "<p>Mon commentaire</p>"
    }
}

```

- answer_id: identifiant de la réponse associée au commentaire
- research_output_id: identifiant du produit de recherche ouvert
- plan_id: identifiant du plan en cours d'édition
- user_id: identifiant de l'auteur du commentaire (utilisateur connecté)
- question_id: identifiant de la question en cours de réponse.
- text: texte du commentaire

Exemple de réponse (qui peut changer):

```json
{
    "note": {
        "id": 134,
        "text": "<p>Mon commentaire</p>"
    }
}

```

- id: identifiant du commentaire nouvellement créé
- text: texte du commentaire

### Edition d'un commentaire

Appel à la route `POST /notes/:id`

- id: identifiant du commentaire modifié

Exemple de body:

```json
{
    "note": {
        "text": "<p>Mon commentaire</p>"
    }
}

```

- text: texte du commentaire modifié

### Suppression d'un commentaire

Appel à la route `POST /notes/:id/archive`

- id: identifiant du commentaire supprimé
  