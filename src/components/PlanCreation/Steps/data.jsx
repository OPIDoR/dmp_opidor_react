import { planCreation } from "../../../services";

export default async function getTemplates(opts, onlyStructured = false) {
  const templates = {
    default: {},
    others: [],
  };

  let currentTemplatesRes;
  try {
    currentTemplatesRes = await planCreation.getRecommendedTemplate(opts.researchContext, opts.templateLanguage);
  } catch (error) {
    setLoading(false);
    return handleError(error);
  }

  const defaultTemplateID = currentTemplatesRes?.data?.id

  templates.default = Array.isArray(currentTemplatesRes?.data)
    ? currentTemplatesRes?.data
    : [currentTemplatesRes?.data]
    .filter(({ locale }) => locale?.toLowerCase() === opts.templateLanguage.toLowerCase());

  let fundersRes;
  try {
    fundersRes = await planCreation.getFunders(opts.researchContext, opts.templateLanguage);
  } catch (error) {
    setLoading(false);
    return handleError(error);
  }

  fundersRes = fundersRes?.data?.map((funder) => ({ ...funder, templates: [] }));

  for await (const funder of fundersRes) {
    let fundersTemplatesRes;

    try {
      fundersTemplatesRes = await planCreation.getTemplatesByFunderId(funder, opts.researchContext);
    } catch (error) {
      setLoading(false);
      handleError(error);
      break;
    }

    templates.others.push({
      ...funder,
      type: 'funder',
      templates: fundersTemplatesRes?.data
        .map((obj) => ({ ...obj, type: 'funder' }))
        .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
        .filter(({ id }) => id !== defaultTemplateID)
        .filter(({ locale }) => locale?.toLowerCase() === opts.templateLanguage.toLowerCase()) || [],
      selected: false,
    });
  }

  let orgsRes;
  try {
    orgsRes = await planCreation.getOrgs(opts.researchContext, opts.templateLanguage);
  } catch (error) {
    setLoading(false);
    return handleError(error);
  }

  orgsRes = orgsRes?.data?.map((org) => ({ ...org, templates: [] }));

  for await (const org of orgsRes) {
    let orgTemplatesRes;

    try {
      orgTemplatesRes = await planCreation.getTemplatesByOrgId(org, opts.researchContext);
    } catch (error) {
      setLoading(false);
      handleError(error);
      break;
    }

    templates.others.push({
      ...org,
      type: 'org',
      templates: orgTemplatesRes?.data
        .map((obj) => ({ ...obj, type: 'org' }))
        .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
        .filter(({ id }) => id !== defaultTemplateID)
        .filter(({ locale }) => locale?.toLowerCase() === opts.templateLanguage.toLowerCase()) || [],
      selected: false,
    });
  }

  if (onlyStructured) {
    templates.default = templates.default.filter(({ structured }) => structured);
    templates.others = templates.others.map((other) => ({
      ...other,
      templates: other.templates.filter(({ structured }) => structured),
    }));
  }

  return Promise.resolve(templates);
}
