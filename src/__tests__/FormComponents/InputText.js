import React from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { render, screen } from "@testing-library/react"

import InputText from '../../components/FormComponents/InputText';

const Wrapper = (props) => {
  const formMethods = useForm();

  return (
    <FormProvider {...formMethods}>
      {props.children}
    </FormProvider>
  );
};
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

const inputTextProps = {
  label: 'Input Text Label',
  type: 'text',
  propName: 'myInput',
  tooltip: 'my tooltip',
  placeholder: 'my placeholder'
}

describe('InputText component', () => {
  test('component rendering', async () => {
    render(
      <Wrapper>
        <InputText {...inputTextProps} />
      </Wrapper>
    );
    expect(screen.getByTestId('input-text-label')).toHaveTextContent(inputTextProps.label);
    expect(screen.getByTestId('input-text')).toBeInTheDocument();
    expect(screen.getByTestId('input-text')).toHaveAttribute('type', 'text');
    expect(screen.getByPlaceholderText(`e.g. ${inputTextProps.placeholder}`)).toBeInTheDocument();
  });

  test('component rendering as readonly', async () => {
    const inputTextReadonlyProps = { ...inputTextProps, readonly: true }
    render(
      <Wrapper>
        <InputText {...inputTextReadonlyProps} />
      </Wrapper>
    );
    expect(screen.getByTestId('input-text')).toHaveAttribute('readonly');
  });

  test('component with type=date rendering <input type="date"/>', async () => {
    const inputTextDateProps = { ...inputTextProps, type: "date" }
    render(
      <Wrapper>
        <InputText {...inputTextDateProps} />
      </Wrapper>
    );
    expect(screen.getByTestId('input-text')).toHaveAttribute('type', 'date');
  });

  test('component with hidden rendering <input type="hidden"/>', async () => {
    const inputTextHiddenProps = { ...inputTextProps, hidden: true }
    render(
      <Wrapper>
        <InputText {...inputTextHiddenProps} />
      </Wrapper>
    );
    expect(screen.queryByText(inputTextProps.label)).not.toBeInTheDocument();
    expect(screen.getByTestId('input-text')).toHaveAttribute('type', 'hidden');
  });
});
