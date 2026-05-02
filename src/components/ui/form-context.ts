import * as React from 'react';
import { FieldValues, type UseFormReturn } from 'react-hook-form';

export const FormFieldContext = React.createContext<{ name: string }>({
  name: '',
});

export const FormItemContext = React.createContext<{ id: string }>({
  id: '',
});

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

export type FormContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TTransformedValues extends FieldValues | undefined = undefined,
> = UseFormReturn<TFieldValues, TTransformedValues>;

export const FormContext = React.createContext<FormContextValue>({} as FormContextValue);

export const useFormContext = () => {
  const context = React.useContext(FormContext);

  if (!context) {
    throw new Error('useFormContext should be used within <Form>');
  }

  return context;
};
