import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

export const Wrapper = (props) => {
  const formMethods = useForm();

  return (
    <FormProvider {...formMethods}>
      {props.children}
    </FormProvider>
  );
};
