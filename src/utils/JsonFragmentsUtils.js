import { exists, pick } from './utils';

/**
 * This method builds a select options list from a contributor array
 * @param contributorsList : a list of contributor to build the options from
 */
export function createPersonsOptions(contributorsList) {
  const options = contributorsList.map((option) => ({
    value: option.id,
    label: option.to_string,
    object: option,
  }));
  return [{ value: '', label: '' }, ...options];
}
export function checkFragmentExists(fragmentList, newFragment, unicityCriteria) {
  if (fragmentList.length === 0) return false;

  // the filter method is here to remove the fragment from the list based on its id
  // this prevents the search to create false positives when updating a fragment.
  const list = fragmentList
    .filter((o) => o.id !== newFragment.id)
    .map((f) => pick(f, unicityCriteria));

  const fiteredFragment = pick(newFragment, unicityCriteria);
  return exists(fiteredFragment, list, unicityCriteria);
}
