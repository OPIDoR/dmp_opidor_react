# Mode Lecture Seule

Ajout d'un mode lecture seule (ou readonly) aux composants WritePlan, GeneralInfo et au formulaire dynamique.
Chacun de ces composants un nouveau prop optionel `readonly` qui déclenche le mode lecture seule quand la valeur est à `true`.

## Formulaire

Chacun des composants du formulaire a un comportement propre en mode Lecture Seule :

- ModalTemplate : le contenu de la Modal est en readonly, la liste des fragments créés ne sont ni modifiables ni supprimables. Ils peuvent être consultés dans une Modal en readonly en appuyant sur un bouton 'oeil'.
- InputText/InputTextDynamicaly : champ bloqué (disabled), la valeur remplie est affichée
- SelectSingleList : champ bloqué (disabled), la valeur sélectionnée est affichée.
- SelectMultipleList : champ bloqué (disabled), les valeurs sélectionnées sont affichées mais ne sont pas supprimables
- SelectContributeur : champ bloqué (disabled), la liste des contributeurs créés ne sont ni modifiables ni supprimables. Ils peuvent être consultés dans une Modal en readonly en appuyant sur un bouton 'oeil'.
- SelectInvestigator : champ bloqué (disabled), la valeur selectionnée peut être consultée dans une Modal en readonly en appuyant sur un bouton 'oeil'.
- SelectWithCreate : champ bloqué (disabled), la liste des fragments créés ne sont ni modifiables ni supprimables. Ils peuvent être consultés dans une Modal en readonly en appuyant sur un bouton 'oeil'.
- TinyArea : l'éditeur est remplacé par un bloc de texte contenant ce qui a été écrit.
- Le bouton Enregistré n'est pas affiché.

## GeneralInfo

- Affichage des formulaires Project & Meta en mode Lecture Seule
- le module de sélection des projets financés n'est pas affiché.
- La case à cocher Plan Test est désactivée (disabled).

## WritePlan

- Affichage des formulaires des questions en mode Lecture Seule
- Les onglets des produits de recherche sont consultables
- Produit de Recherche : Bouton Créer non affiché
- Produit de Recherche : Bouton Supprimer non affiché
- Bouton Script non affiché
- Commentaires : on ne peut pas ajouter de nouveau commentaire, ni supprimer ou éditeur ceux présents.
