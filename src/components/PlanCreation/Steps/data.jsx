import { planCreation } from "../../../services";

export default async function getTemplates(opts, onlyStructured = false) {
  const templates = {
    default: {},
    others: [],
  };

  let currentTemplatesRes;
  try {
    currentTemplatesRes = await planCreation.getRecommendedTemplate(opts.templateLanguage);
  } catch (error) {
    throw new Error(error)
  }

  const defaultTemplateID = currentTemplatesRes?.data?.id

  templates.default = Array.isArray(currentTemplatesRes?.data)
    ? currentTemplatesRes?.data
    : [currentTemplatesRes?.data]
      .filter(({ locale }) => locale?.toLowerCase() === opts.templateLanguage.toLowerCase())
      .sort((a, b) => b?.structured - a?.structured);

  let orgsRes;
  try {
    orgsRes = await planCreation.getOrgs(opts.templateLanguage);
  } catch (error) {
    throw new Error(error)
  }

  orgsRes = orgsRes?.data?.map((org) => ({ ...org, templates: [] }));

  for await (const org of orgsRes) {
    let orgTemplatesRes;

    try {
      orgTemplatesRes = await planCreation.getTemplatesByOrgId(org);
    } catch (error) {
      throw new Error(error)
    }

    templates.others.push({
      ...org,
      type: 'org',
      templates: orgTemplatesRes?.data
        .map((obj) => ({ ...obj, type: 'org' }))
        .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
        .filter(({ id }) => id !== defaultTemplateID)
        .filter(({ locale }) => locale?.toLowerCase() === opts.templateLanguage.toLowerCase())
        .sort((a, b) => b?.structured - a?.structured) || [],
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
