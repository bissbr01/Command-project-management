import { InputVariant, NumberInput, TextInputStylesNames } from '@mantine/core'
import { FieldProps } from 'formik'
import { FocusEventHandler } from 'react'

export interface NumberFieldProps extends FieldProps {
  label?: string
  placeholder?: string
  variant?: InputVariant
  required?: boolean
  defaultValue: number
  onFocus?: FocusEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
  stylesApi?: Partial<Record<TextInputStylesNames, string>> | undefined
}

export default function NumberField({
  label,
  placeholder,
  variant,
  required = false,
  stylesApi,
  defaultValue,
  onFocus,
  onBlur,
  field,
  form,
}: NumberFieldProps) {
  // workaround to get meta.  Might be fixed in future of formik
  const meta = form.getFieldMeta(field.name)

  return (
    <NumberInput
      {...field}
      label={label}
      placeholder={placeholder}
      min={0}
      withAsterisk={required}
      defaultValue={defaultValue}
      error={meta.touched && meta.error}
      variant={variant}
      classNames={stylesApi}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={(value) => {
        const event = {
          target: {
            value: value,
            name: field.name,
          },
        }
        field.onChange(event)
      }}
    />
  )
}
