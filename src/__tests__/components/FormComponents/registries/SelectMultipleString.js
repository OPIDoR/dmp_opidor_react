import React from 'react';
import SelectMultipleString from '../../../../components/FormComponents/registries/SelectMultipleString';

import { Wrapper } from '../../../__utils__/reactHookFormHelpers';
import { cleanup, render, screen } from '@testing-library/react';
import Global from '../../../../components/context/Global';
import { service } from '../../../../services/index';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => { }),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => { },
  }
}));

const props = {
  label: 'Select Multiple String Label',
  propName: 'mySelectMultipleString',
  header: 'tableHeader',
  tooltip: 'my tooltip',
  registries: ['SingleRegistry']
}

afterEach(() => {
  cleanup();
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('SelectMultipleString component', () => {
  test('component rendering', async () => {
    const spy = jest.spyOn(service, 'getRegistryByName');
    render(
      <Global>
        <Wrapper propName={props.propName} data={[]}>
          <SelectMultipleString {...props}/>
        </Wrapper>
      </Global>
    );
    expect(screen.getByTestId('select-multiple-string-label')).toHaveTextContent(props.label);
    expect(screen.queryByTestId('select-multiple-string-registry-selector')).not.toBeInTheDocument();
    expect(screen.getByTestId(/tooltip_info_icon_[0-9]+/i)).toBeInTheDocument();
    expect(screen.getByTestId('select-multiple-string-div')).toBeInTheDocument();
    expect(screen.getByTestId('select-multiple-string-div')).toHaveTextContent('Select one or multiple values from the list');
    expect(spy).toHaveBeenCalledWith(props.registries[0]);
  });
  test('component rendering with multiple registries', async () => {
    const multipleRegistriesProps = {...props, registries: ['FirstRegistry', 'SecondRegistry']}
    const spy = jest.spyOn(service, 'getRegistryByName');
    render(
      <Global>
        <Wrapper propName={multipleRegistriesProps.propName} data={[]}>
          <SelectMultipleString {...multipleRegistriesProps} />
        </Wrapper>
      </Global>
    );
    expect(screen.getByTestId('select-multiple-string-label')).toHaveTextContent(multipleRegistriesProps.label);
    expect(screen.queryByTestId('select-multiple-string-registry-selector')).toBeInTheDocument();
    expect(screen.queryByTestId('select-multiple-string-registry-selector')).toHaveTextContent('Select a registry');
    expect(screen.getByTestId(/tooltip_info_icon_[0-9]+/i)).toBeInTheDocument();
    expect(screen.getByTestId('select-multiple-string-div')).toBeInTheDocument();
    expect(screen.getByTestId('select-multiple-string-div')).toHaveTextContent('Then select one or multiple values from the list');
    expect(spy).not.toHaveBeenCalled();
  });
});
