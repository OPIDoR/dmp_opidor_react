# Refonte de la partie Recommandations de l'onglet Rédiger

Les recommandations (ou `guidances`) s'ouvrent désormais une modal Bootstrap.
Il existe deux types de recommandations:

- Les recommandations liées directement à la question ou `annotation`.
- Les recommandations associées à un thème, lui même associé à une question. Ces recommandations sont associées à un groupe de recommandations (`guidance_groups`)

## Données

Une nouvelle route dans le back doit être ajoutée.
Appel à la route lors de l'ouverture de la modal `GET /questions/:id/guidances`

Renvoit un tableau vide si il n'existe aucune recommandation associée.

### Données du serveur

```json
[
  {
    "name": "Science Europe",
    "groups": {},
    "annotations": [
      {
        "id": 30869,
        "text": "<p>Description g&eacute;n&eacute;rale du produit de recherche</p>"
      }
    ]
  },
  {
    "name": "CNRS",
    "groups": [
      {
        "theme": "Data description",
        "guidances" : [
          {
            "id": 96,
            "text": "<p>Afin de faciliter l'accessibilit&eacute; aux donn&eacute;es, il est recommand&eacute; d'attribuer des identifiants uniques et p&eacute;rennes.</p>"
          },
          {
            "id": 91,
            "text": "<p>Afin de faciliter la recherche de vos donn&eacute;es, utilisez une nomenclature explicite (ex: nom du projet_param&egrave;tre_date de version)</p>"
          },
          {
            "id": 92,
            "text": "<p>Pr&eacute;f&eacute;rer les formats non propri&eacute;taires ou largement utilis&eacute;s par votre communaut&eacute;</p>"
          },
          {
            "id": 93,
            "text": "<p>Un stockage des donn&eacute;es centralis&eacute; avec acc&egrave;s s&eacute;curis&eacute; et sauvegarde est recommand&eacute;. Les donn&eacute;es d'observation seront stock&eacute;es sur OTELo cloud.</p>"
          },
          {
            "id": 94,
            "text": "<p>Vous pouvez utiliser le template (<a href=\"https://labs.core-cloud.net/ou/OTELo/UMS3562/Lists/DocumentsPartagesSLSSites/Caneva_Metadonnees_donnees.csv\" target=\"_blank\">https://labs.core-cloud.net/ou/OTELo/UMS3562/Lists/DocumentsPartagesSLSSites/Caneva_Metadonnees_donnees.csv</a>) mis &agrave; votre disposition qui permettent de d&eacute;crire vos donn&eacute;es sous un format compatible avec les standards EML, INSPIRE, ISO19115.<br />Pour les jeux de donn&eacute;es qui seront partag&eacute;es dans un entrep&ocirc;t, des standards de m&eacute;tadonn&eacute;es sont utilis&eacute;s.</p>"
          },
          {
            "id": 80,
            "text": "<p>Bref descriptif</p>"
          },
          {
            "id": 81,
            "text": "<p><em>Identifiant de la personne</em> : IdHAL, Researcher ID, ORCID Id <br />L'identifiant ORCID est actuellement encourag&eacute; car c'est un identifiant p&eacute;renne global (multiusages) et unique qui vous permettra de vous connecter &agrave; de nombreuses applications et d'agr&eacute;ger toute votre production scientifique (publication, jeux de donn&eacute;es, logiciels, mod&egrave;les, ...) .</p>"
          },
          {
            "id": 82,
            "text": "<p>Personne qui assure le suivi, la mise &agrave; jour et la mise en &oelig;uvre du DMP</p>"
          },
          {
            "id": 83,
            "text": "<p>Politique(s) de donn&eacute;es du financeur, institution, laboratoire, discipline, ...</p>"
          },
          {
            "id": 84,
            "text": "<p>D&eacute;crire la m&eacute;thode ou citer la r&eacute;f&eacute;rence sans oublier son identifiant (ex DOI, Handle)</p>"
          },
          {
            "id": 85,
            "text": "<p>L&rsquo;identification et la description de vos &eacute;chantillons faciliteront leur r&eacute;utilisation et l&rsquo;analyse crois&eacute;e de donn&eacute;es produites par vous-m&ecirc;me ou par diff&eacute;rentes personnes &agrave; partir d&rsquo;un m&ecirc;me &eacute;chantillon. Pour cela, il s&rsquo;agit de convenir d&rsquo;une nomenclature, ce qu&rsquo;on appelle convention de nommage.</p>"
          },
          {
            "id": 86,
            "text": "<p>Lieu et conditions de stockage</p>"
          },
          {
            "id": 87,
            "text": "<p>Rechercher s'il existe des jeux de donn&eacute;es r&eacute;utilisables dans DataCite, Pangaea, &hellip;.<br />V&eacute;rifier les licences, conditions de r&eacute;utilisation . Citer les jeux de donn&eacute;es r&eacute;utilis&eacute;s par le biais de leurs identifiants</p>"
          },
          {
            "id": 88,
            "text": "<p>V&eacute;rifier les licences, conditions de r&eacute;utilisation. Citer les par le biais des identifiants si disponibles</p>"
          },
          {
            "id": 90,
            "text": "<p>D&eacute;crire succinctement les m&eacute;thodes de collecte et traitement, analyse des donn&eacute;es. Pr&eacute;ciser les standards, contr&ocirc;les qualit&eacute;s appliqu&eacute;s.</p>"
          },
          {
            "id": 95,
            "text": "<p>Par exemple, un dictionnaire des jeux de donn&eacute;es sous format tabulaire afin de pr&eacute;ciser les noms des variables, leurs unit&eacute;s, d&eacute;finitions (Guide de bonnes pratiques, <a href=\"https://hal.archives-ouvertes.fr/hal-01275841/document\" target=\"_blank\">https://hal.archives-ouvertes.fr/hal-01275841/document</a>), des m&eacute;thodes/protocoles, logiciels utilis&eacute;s (nom, version), le mod&egrave;le d'une base de donn&eacute;es. <strong>Ne pas h&eacute;siter &agrave; mettre en lien les fichiers de documentation associ&eacute;e.</strong></p>"
          },
          {
            "id": 97,
            "text": "<p>Ces informations sont pr&eacute;sentes dans l'accord de consortium s'il en existe un sinon il faut les pr&eacute;ciser. <br />Indiquer s'il y a des restrictions au partage des donn&eacute;s par exemple pour des raisons de confidentialit&eacute;&hellip;. (cf Guide Inra : <a href=\"http://prodinra.inra.fr/?locale=fr#!ConsultNotice:382263\" target=\"_blank\">http://prodinra.inra.fr/?locale=fr#!ConsultNotice:382263</a>)</p>"
          },
          {
            "id": 98,
            "text": "<p>Par exemple : <br />donn&eacute;es personnelles: d&eacute;claration CNIL/lien, anonymisation<br />esp&egrave;ces prot&eacute;g&eacute;es: acc&egrave;s restreint</p>"
          },
          {
            "id": 99,
            "text": "<p>Existe-t-il des entrep&ocirc;ts disciplinaires dans lesquels vous pouvez d&eacute;poser les jeux de donn&eacute;es? Existe-t-il un entrep&ocirc;t institutionnel ou sp&eacute;cifique au projet?</p>"
          },
          {
            "id": 100,
            "text": "<p>Le co&ucirc;t de gestion peut inclure les logiciels, l' espace de stockage, les ressources humaines, des formations, &hellip;.</p>"
          },
          {
            "id": 101,
            "text": "<p>Estimer le volume en MB, GB, TB.</p>"
          }
        ]
      }
    ],
    "annotations": []
  }
]
```

### Description des données

- name: Nom de l'organisme d'origine des recommandations
- groups: groupes de recommandations. Contient la liste des thèmes et des recommandations associées aux thèmes
  - theme: le thème du groupe de recommandations
  - guidances: liste des recommandations associées au thème et au groupe
- annotations:  recommandations directement reliées aux questions
- text : texte de la recommandation.

## Affichage

Chaque onglet affiche le nom de l'organime d'origine.
Dans chacun des onglets, on affiche les recommandations associées à l'organisme :

- Si `annotations` est présent, on affiche directement `text` dans l'onglet
- Si `groups` est présent, on crée un collapse pour chaque groupe. Pour le titre du collapse on utilise `theme`, le contenu du collapse on prend toutes les recommandations présente dans la clé `guidances`. On sépare chacune d'entre elle d'une balise `<hr/>` ou autre astuce visuelle.