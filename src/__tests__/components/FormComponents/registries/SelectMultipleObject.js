import React from 'react';
import SelectMultipleObject from '../../../../components/FormComponents/registries/SelectMultipleObject';

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
  label: 'Select Multiple Object Label',
  formLabel: 'Select Multiple Object Form Label',
  propName: 'mySelectMultipleObject',
  tooltip: 'my tooltip',
  registries: ['SingleRegistry']
}

afterEach(() => {
  cleanup();
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('SelectMultipleObject component', () => {
  test('component rendering', async () => {
    const spy = jest.spyOn(service, 'getRegistryByName');
    render(
      <Global>
        <Wrapper propName={props.propName}>
          <SelectMultipleObject {...props} />
        </Wrapper>
      </Global>
    );
    expect(screen.getByTestId('select-multiple-object-label')).toHaveTextContent(props.formLabel);
    expect(screen.queryByTestId('select-multiple-object-registry-selector')).not.toBeInTheDocument();
    expect(screen.getByTestId(/tooltip_info_icon_[0-9]+/i)).toBeInTheDocument();
    expect(screen.getByTestId('select-multiple-object-div')).toBeInTheDocument();
    expect(screen.getByTestId('select-multiple-object-div')).toHaveTextContent('Select one or multiple values from the list');
    expect(spy).toHaveBeenCalledWith(props.registries[0]);
  });
  test('component rendering with multiple registries', async () => {
    const multipleRegistriesProps = {...props, registries: ['FirstRegistry', 'SecondRegistry']}
    const spy = jest.spyOn(service, 'getRegistryByName');
    render(
      <Global>
        <Wrapper propName={multipleRegistriesProps.propName}>
          <SelectMultipleObject {...multipleRegistriesProps} />
        </Wrapper>
      </Global>
    );
    expect(screen.getByTestId('select-multiple-object-label')).toHaveTextContent(multipleRegistriesProps.formLabel);
    expect(screen.queryByTestId('select-multiple-object-registry-selector')).toBeInTheDocument();
    expect(screen.queryByTestId('select-multiple-object-registry-selector')).toHaveTextContent('Select a registry');
    expect(screen.getByTestId(/tooltip_info_icon_[0-9]+/i)).toBeInTheDocument();
    expect(screen.getByTestId('select-multiple-object-div')).toBeInTheDocument();
    expect(screen.getByTestId('select-multiple-object-div')).toHaveTextContent('Then select one or multiple values from the list');
    expect(spy).not.toHaveBeenCalled();
  });
});
