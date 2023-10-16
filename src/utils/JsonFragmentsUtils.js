import { exists, pick } from "./utils";

/**
 * This method builds a select options list from a contributor array
 * @param contributorsList : a list of contributor to build the options from
 */
export function createPersonsOptions(contributorsList) {
  let options = contributorsList.map((option) => ({
    value: option.id,
    label: option.to_string,
    object: option,
  }));
  return [ {value:'', label:''}, ...options ]
}
export function checkFragmentExists(fragmentList, newFragment, unicityCriteria) {
  if (fragmentList.length === 0) return false;

  const list = fragmentList.map((f) => pick(f, unicityCriteria));
  const fiteredFragment = pick(newFragment, unicityCriteria);
  return exists(fiteredFragment, list, unicityCriteria);
}
