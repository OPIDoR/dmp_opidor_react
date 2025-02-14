import React from 'react';
import axios from 'axios';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';

import SelectSingleString from '../../../../components/FormComponents/registries/SelectSingleString';

import { Wrapper } from '../../../__utils__/reactHookFormHelpers';
import Global from '../../../../components/context/Global';
import { service } from '../../../../services/index';
import selectEvent from 'react-select-event';

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

// Mock out all top level functions, such as get, put, delete and post:
jest.mock("axios");

const props = {
  label: 'Select Single String Label',
  propName: 'mySelectSingleString',
  tooltip: 'my tooltip',
  category: ['SingleRegistryCategory'],
  dataType: 'none'
}

const mockedRegistriesData = [
  {
    name: "SingleRegistry1",
    values: [{
      "fr_FR": 'Bonjour',
      "en_GB": 'Hello'
    }]
  },
  {
    name: "SingleRegistry2",
    values: [{
      "fr_FR": 'Bonjour',
      "en_GB": 'Hello'
    }]
  }
]

afterEach(() => {
  cleanup();
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('SelectSingleString component', () => {
  test('component rendering', async () => {
    const spy = jest.spyOn(service, 'getRegistriesByCategory');
    spy.mockImplementation((category, dataType) => Promise.resolve({ data: [mockedRegistriesData[0]] }));
    const spyGetRegistryByName = jest.spyOn(service, 'getRegistryByName');
    await act(async () => render(
      <Global>
        <Wrapper propName={props.propName}>
          <SelectSingleString {...props} />
        </Wrapper>
      </Global>
    )
    );
    expect(screen.getByTestId('select-single-string-label')).toHaveTextContent(props.label);
    expect(screen.queryByTestId('select-single-string-registry-selector')).not.toBeInTheDocument();
    expect(screen.getByTestId(/tooltip_info_icon_[0-9]+/i)).toBeInTheDocument();
    expect(screen.getByTestId('select-single-string-div')).toBeInTheDocument();
    expect(screen.getByTestId('select-single-string-div')).toHaveTextContent('Select a value from the list');
    expect(spy).toHaveBeenCalledWith(props.category, props.dataType);
    expect(spyGetRegistryByName).not.toHaveBeenCalled();
  });
  test('component rendering with multiple registries', async () => {
    const spy = jest.spyOn(service, 'getRegistriesByCategory');
    spy.mockImplementation((category, dataType) => Promise.resolve({ data: mockedRegistriesData }));  // replace implementation
    const spyGetRegistryByName = jest.spyOn(service, 'getRegistryByName');
    await act(async () => render(
      <Global>
        <Wrapper propName={props.propName}>
          <SelectSingleString {...props} />
        </Wrapper>
      </Global>
    ));
    expect(screen.getByTestId('select-single-string-label')).toHaveTextContent(props.label);
    expect(screen.queryByTestId('select-single-string-registry-selector')).toBeInTheDocument();
    expect(screen.getByText('Select a registry')).toBeInTheDocument();
    expect(screen.getByTestId(/tooltip_info_icon_[0-9]+/i)).toBeInTheDocument();
    expect(screen.getByTestId('select-single-string-div')).toBeInTheDocument();
    expect(screen.getByTestId('select-single-string-div')).toHaveTextContent('Then select a value from the list');
    expect(spy).toHaveBeenCalledWith(props.category, props.dataType);
    expect(spyGetRegistryByName).not.toHaveBeenCalled();
  });
  test('component with multiple registry should call getRegistryByName when choosing a registry', async () => {
    const spy = jest.spyOn(service, 'getRegistriesByCategory');
    spy.mockImplementation((category, dataType) => Promise.resolve({ data: mockedRegistriesData })); 
   const spyGetRegistryByName = jest.spyOn(service, 'getRegistryByName');
    await act(async () => render(
      <Global>
        <Wrapper propName={props.propName}>
          <SelectSingleString {...props} />
        </Wrapper>
      </Global>
    ));
    const registrySelector = screen.getByText('Select a registry');
    expect(registrySelector).toBeInTheDocument();
    selectEvent.openMenu(registrySelector);
    expect(screen.getByText("SingleRegistry1")).toBeInTheDocument();
    await fireEvent.click(screen.getByText("SingleRegistry1"))
    expect(spyGetRegistryByName).toHaveBeenCalledWith('SingleRegistry1');
  })
});
