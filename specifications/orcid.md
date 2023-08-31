# ORCID

URL API:
+ /api/v1/madmp/services/orcid?search=<ORCID ID> ``(ex: /api/v1/madmp/services/orcid?search=0009-0006-2026-6334)``
+ /api/v1/madmp/services/orcid?search=<name> ``(ex: /api/v1/madmp/services/orcid?search=wilmouth steven)``

Il faudrait intégrer un formulaire dans le même type que celui pour le ROR ID, au clic sur ORCID, un formulaire apparait, composé d'un champs de recherche qui prend en valeur soit nom et prénom ou l'identifiant ORCID.

Une fois le champs remplis, une table apparait pour afficher les différents choix comme ceci:

| Identifiant | Nom/Prénom | Établissement(s) | Sélection |
| --- | --- | --- | --- |
| 0009-0006-2026-6334" | Steven WILMOUTH | Inist, Institute for scientific and technical information, CNRS | [Bouton de sélection du choix] |

L'identifiant est présent dans le champs ``orcid``

Le nom est prénom sont présent dans les champs ``givenNames`` et ``familyNames``

Le(s) établissement(s) se trouve(nt) dans le champs ``institutionName``