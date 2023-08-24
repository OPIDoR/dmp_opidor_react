# API ROR

URL de l'API: `/api/madmp/v1/services/ror`
Paramètres:

- **query** (ex: `query=Inist`)
- **filter** (ex: `filter=country.country_code:FR`)

Exemples de requêtes:

```bash
/api/madmp/v1/services/ror?query=Inist # Recherche libre via sigle

/api/madmp/v1/services/ror?query=02mn0vt57 # Recherche libre via l'identifiant ROR

/api/v1/madmp/services/ror?query=Institut%20de%20l%27Information%20Scientifique%20et%20Technique # Recherche libre via le nom de l'organisme

/api/madmp/v1/services/ror?query=Inist&filter=country.country_code:FR # Recherche libre via sigle + filtrage sur le pays

> Les mêmes requêtes que précédement peuvent être faites aussi avec le filtre
```

Il faudrait prévoir dans l'interface au minimum 2 champs:

- Identifiant: liste déroulante (ne mettre que ROR pour le moment)
- Recherche: champs de type texte (peu prendre n'importe quelle valeur, identifiant ROR, sigle, nom, ....)

Un troisimème champs peut-être ajouté dans le cas du ROR, ce champs est un champs Filtre permettant donc de filtre sur le pays.

Exemple d'interface:

|---------------|
| Identifiant > | > Listé déroulante avec comme choix ROR pour le moment
|---------------|\_
| ROR |
|---------------|

|---------------|
| Recherche | > Afficher le champs quand le type d'identifiant est sélectionné
|---------------|

|---------------| > Afficher le champs quand le type d'identifiant ROR est sélectionné
| Pays > | > Liste déroulante de la liste des Pays, afficher le Pays et récupérer comme valeur le code pays (ex: FR, ES, DE, ...)
|---------------|\_ > N'afficher ce champs que pour ROR
| France |
| Allemagne |
| Espagne |
|---------------|

> Afficher les données dans un tableau pour sélectionner la donnée pertinante pour l'utilisation, qu'il y ait un ou plusieurs résultats.
> |-----------------------------------|--------------------------|------------------------------|-----------------------------------------------|---------------------------------------|
> | Nom de l'organisme (champs: name) | Sigle (champs: acronyms) | Pays (champs: country->code) | Localisation à concatener (champs: addresses) | Bouton séléctionner (champs: **ror**) |
> | ................................. | ........................ | ............................ | ............................................. | ..................................... |
> | ................................. | ........................ | ............................ | ............................................. | ..................................... |
> | ................................. | ........................ | ............................ | ............................................. | ..................................... |
> | ................................. | ........................ | ............................ | ............................................. | ..................................... |
> |-----------------------------------|--------------------------|------------------------------|-----------------------------------------------| --------------------------------------|
