# Retours Onglet Information Générale

## Fonctionnement de l'Onglet

Par défaut les formulaires Projet et Meta sont affichés. L'import d'informations projet venant d'un financeur est facultatif. Il faut donc afficher l'onglet Projet avec le template ProjectStandard. L'import d'information financeur permet seulement de remplir automatiquement le formulaire projet et n'est pas nécessaire à l'affichage du formulaire.

## Affichage de l'onglet

L'import est fermé par défaut
Les formulaires Projet et Meta sont ouverts par défaut.
Le contenu de l'onglet peut s'afficher si il n'existe aucun organisme de financement (`dataFundingOrganization`). On pourrait cependant n'afficher le panel "Import Financeur" que si `dataFundingOrganization` existe.

## Variables & fonctions à renommer

- `isOpenPlan, setIsOpenPlan` => `isOpenMetaForm, setIsOpenMetaForm`
- `isOpenProject, setIsOpenProject` => `isOpenProjectForm, setIsOpenProjectForm`
- `isOpenFunder, setIsOpenFunder` => `isOpenFunderImport, setIsOpenFunderImport`
- `isOpenFunder, setIsOpenFunder` => `isOpenFunderImport, setIsOpenFunderImport`
- `dataFundingOrganization, setDataFundingOrganization` => `funders, setFunders`
- `fundedProject, setFundedProject` => `fundedProjects, setFundedProjects`

- `getFundingOrganization` => `getFunders`
- `getFundedProject` => `getFundedProjects`
- `handleChangeFunder` => `handleSelectFunder`
- `handleSaveFunder` => `handleSaveFunding`
- `saveFunder` => `saveFunding`