import {
  InputVariant,
  MantineSize,
  TextInput,
  TextInputStylesNames,
} from '@mantine/core'
import { FieldProps } from 'formik'
import { FocusEventHandler } from 'react'

export interface TextProps extends FieldProps {
  label?: string
  placeholder?: string
  variant?: InputVariant
  required?: boolean
  size: MantineSize
  stylesApi?: Partial<Record<TextInputStylesNames, string>> | undefined
  onFocus?: FocusEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
}

export default function TextField({
  label,
  placeholder,
  variant,
  required = false,
  stylesApi,
  onFocus,
  onBlur,
  field,
  size = 'sm',
  form,
}: TextProps) {
  // workaround to get meta.  Might be fixed in future of formik
  const meta = form.getFieldMeta(field.name)
  return (
    <TextInput
      {...field}
      label={label}
      placeholder={placeholder}
      withAsterisk={required}
      error={meta.touched && meta.error}
      variant={variant}
      size={size}
      classNames={stylesApi}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
}
